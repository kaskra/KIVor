const {dialog} = require('electron').remote;

const lawApi = require('./fetch_laws');
const nlp = require('./fake_nlp');
const suggestion = require('./components/suggestion');

const textArea = document.getElementById('mainTextArea');
const textInfo = document.getElementById('text-info');
textInfo.onclick = function () {
    dialog.showMessageBox(null, {
        type: "info",
        title: "Information",
        message: "Dieser Text wird durch ein 'Fake NLP'-Model analysiert. Das Ergebnis wird an die " +
            "API von 'https://de.openlegaldata.io' geschickt, um die Paragraphen zu erhalten. Zu dem " +
            "aktuellen Zeitpunkt wird außerdem nur das Strafgesetzbuch abgefragt. Wenn kein Ergebnis gefunden wird, " +
            "wird als Beispiel ein festes Ergebnis ausgegeben.\n\n" +
            "Durch das Markieren von Sätzen oder Wörtern kann der Bereich der analysiert werden soll, eingeschränkt werden.",
    });
}

const suggestionList = document.getElementById('suggestionList');

const checkboxKeywords = document.getElementById('toggleKeywords');
checkboxKeywords.onclick = toggleKeywords;

const keywordInfo = document.getElementById('keyword-info');
keywordInfo.onclick = function () {
    dialog.showMessageBox(null, {
        type: "info",
        title: "Information",
        message: "Diese Checkbox schält zwischen Keyword- und Paragraphensuche um. Bei einer Keywordsuche, " +
            "werden die Texte der Paragraphen nach einem Keyword durchsucht und nur die ausgegeben, die das Wort beinhalten. " +
            "Bei einer Paragraphensuche werden explizit die Paragraphen gesucht, die das NLP-Model anhand eines Keywords ermittelt hat.",
    });
}

const checkBtn = document.getElementById('checkTextBtn');
checkBtn.onclick = getSuggestions;

const searchParagraphBtn = document.getElementById('search-paragraph');
searchParagraphBtn.onclick = searchByParagraph;

const searchInfo = document.getElementById('search-info');
searchInfo.onclick = function () {
    dialog.showMessageBox(null, {
        type: "info",
        title: "Information",
        message: "Trenne mehrere Paragraphen durch ein Komma.",
    });
}

const detailsClose = document.getElementById('details-close');
detailsClose.onclick = function () {
    unselectListItems();
    resetDetails();
}

//-------------------------------------

let keywordSearch = true;


function searchByParagraph() {
    const searchInput = document.getElementById('paragraph-input');
    let query = searchInput.value;

    if (query === "") {
        dialog.showErrorBox("Eingabefehler",
            "Bitte geben sie mindestens einen Paragraphen an.");
        return;
    }

    const paragraphs = lawApi.fetchLaws(nlp.lawBook, query, '');

    paragraphs.then(
        p => {
            if (p.length > 0) {
                suggestionList.innerHTML = '';

                for (let i = 0; i < p.length; i++) {
                    createEntryInSuggestions(p[i].title, p[i].text, i);
                }
                addEventToItems();
            } else {
                dialog.showErrorBox("Kein Ergebnis",
                    "Es konnten keine passenden Paragraphen gefunden werden.");

                // TODO remove
                suggestionList.innerHTML = '';
                createEntryInSuggestions("StGB § 223 Körperverletzung", "(1) Wer eine andere " +
                    "Person körperlich mißhandelt oder " +
                    "an der Gesundheit schädigt, wird mit Freiheitsstrafe bis zu fünf Jahren " +
                    "oder mit Geldstrafe bestraft.\n" +
                    "\n" +
                    "(2) Der Versuch ist strafbar.\n", 0);
                addEventToItems();
            }
        }
    );
}

function createEntryInSuggestions(title, text, idx) {
    let newSuggestion = suggestion.buildSuggestionItem(title, text, idx);

    suggestionList.innerHTML += newSuggestion;
}

function unselectListItems() {
    for (let card of suggestionList.children) {
        card.classList.remove('active');
        card.children[0].classList.remove('selected-card');
        card.children[1].classList.remove('selected-card');
        card.children[2].classList.remove('selected-card');
    }
}

function setAndShowDetails(title, text) {
    const detailCard = document.getElementById('details-card');
    const detailsTitle = document.getElementById('details-title');
    const detailsText = document.getElementById('details-text');
    detailsTitle.innerText = title;
    detailsText.innerText = text;
    detailCard.hidden = false;
}

function resetDetails() {
    const detailCard = document.getElementById('details-card');
    const detailsTitle = document.getElementById('details-title');
    const detailsText = document.getElementById('details-text');
    detailsTitle.innerText = '';
    detailsText.innerText = '';
    detailCard.hidden = true;
}

function addEventToItems() {

    for (let c = 0; c < suggestionList.childElementCount; c++) {
        let item = suggestionList.children[c]
        let title = item.children[0].innerText;
        let subtitle = item.children[1].innerText;
        let text = item.children[2].innerText;

        item.onclick = function () {
            unselectListItems();
            item.classList.add('active');
            item.children[0].classList.add('selected-card');
            item.children[1].classList.add('selected-card');
            item.children[2].classList.add('selected-card');
            setAndShowDetails(title + " " + subtitle, text);
        }
    }
}

async function getSuggestions() {
    let text = textArea.value;

    let selectedText = window.getSelection().toString();
    console.log(selectedText.length);
    if (selectedText.length > 0) {
        text = selectedText;
    }

    // Search (marked) text for keywords.
    const results = nlp.searchForKeywords(text);


    if (results[0] !== "") {
        let key = results[0];
        let ps = results[1].join(',');

        const paragraphs = lawApi.fetchLaws(nlp.lawBook,
            (keywordSearch) ? '' : ps,
            (keywordSearch) ? key : '');

        paragraphs.then(
            p => {
                // Clear suggestion list if new suggestions were found
                if (p.length >= 0) {
                    suggestionList.innerHTML = '';
                }

                for (let i = 0; i < p.length; i++) {
                    createEntryInSuggestions(p[i].title, p[i].text, i);
                }

                // TODO remove
                if (p.length === 0) {
                    dialog.showErrorBox("Kein Ergebnis",
                        "Es konnten keine passenden Paragraphen gefunden werden.");
                    createEntryInSuggestions("StGB § 223 Körperverletzung", "(1) Wer eine andere " +
                        "Person körperlich mißhandelt oder " +
                        "an der Gesundheit schädigt, wird mit Freiheitsstrafe bis zu fünf Jahren " +
                        "oder mit Geldstrafe bestraft.\n" +
                        "\n" +
                        "(2) Der Versuch ist strafbar.\n", 0);

                }

                addEventToItems();
            }
        )
    } else {
        dialog.showErrorBox("Kein Ergebnis",
            "Es konnten keine Schlüsselwörter gefunden werden.");
    }
}

function toggleKeywords() {
    keywordSearch = checkboxKeywords.checked;
}


let exampleText = "Um 17:45 Uhr am 17.06.2020 erfolgte die Anweisung durch das FLZ die Siberstraße 19 " +
    "in 71253 Entenhausen anzufahren. Laut einem Anrufer waren dort 2 Männer aneinandergeraten, was " +
    "anschließend in eine körperliche Auseinandersetzung übergegangen wäre. Die Anfahrt erfolgte unter Zuhilfenahme " +
    "der Sonder- und Wegerechte (§35, §38 StVO).  Vor Ort konnten tatsächlich 2 Männer angetroffen werden, " +
    "welche sich vor der Einfahrt des Hauses Nr. 19 der Siberstraße schlugen. Dabei lag der Geschädigte Lauditz " +
    "bereits am Boden und versuchte sich vor den Tritten des Beschuldigten Kessler mit den Armen zu schützen.  " +
    "Da der Beschuldigte Kessler auf keinerlei Zurufe reagierte seine Schläge einzustellen, wurde er umgehend von " +
    "meinem Kollegen M.Hammer mithilfe eines Schockschlages zu Boden gebracht. Kurz darauf versuchte der " +
    "Beschuldigte Kessler zu flüchten und" +
    " wurde deshalb von mir und meinem Kollegen M. Hammer umgehend vorläufig festgenommen (§127 StPO). Es erfolgte " +
    "die Belehrung des Beschuldigten gemäß §136 StPO. Der Geschädigte wurde zu seinen Rechten als " +
    "Zeugen belehrt. Er erlitt lediglich leichte Prellungen seitlich der rechten " +
    "Rippen sowie Abschürfungen an beiden Unterarmen. Seinen Aussagen zufolge handelte es sich bei dem Beschuldigten" +
    " Kessler um seinen Nachbarn, welcher sich schon seit Wochen darüber aufregte, dass der Geschädigte Lauditz sein " +
    "PKW abends als so parke, dass die Schnauze des Fahrzeuges von der Einfahrt aus noch in den Gehweg hineinrage. " +
    "Er wünsche einen Strafantrag für die vorliegende Körperverletzung (§223 StGB). Es erfolgte die Aufnahme der " +
    "Personalien der Beteiligten, der Geschädigte Lauditz betrat anschließend sein Haus.  " +
    "Der Beschuldigte Kessler wurde zu seiner Haustüre begleitet, er zeigte sich einsichtig und wurde von seiner " +
    "Frau in Empfang genommen. ";

textArea.value = exampleText;
