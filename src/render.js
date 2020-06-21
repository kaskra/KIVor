const lawApi = require('./fetch_laws');
const nlp = require('./fake_nlp');
const suggestion = require('./components/suggestion');

const textArea = document.getElementById('mainTextArea');
const suggestionList = document.getElementById('suggestionList');

const checkBtn = document.getElementById('checkTextBtn');
checkBtn.onclick = getSuggestions;


function createEntryInSuggestions(title, text, idx) {
    let newSuggestion = suggestion.buildSuggestionItem(title, text, idx);

    suggestionList.innerHTML += newSuggestion;
}

function addEventToItems() {
    const detailCard = document.getElementById('details-card');
    const detailsTitle = document.getElementById('details-title');
    const detailsText = document.getElementById('details-text');
    for (let c = 0; c < suggestionList.childElementCount; c++) {
        let item = suggestionList.children[c]
        let title = item.children[0].innerText;
        let subtitle = item.children[1].innerText;
        let text = item.children[2].innerText;

        item.onclick = function () {
            detailsTitle.innerText = title + " " + subtitle;
            detailsText.innerText = text;
            detailCard.hidden = false;
        }
    }
}

async function getSuggestions() {
    const text = textArea.value;
    // TODO only get marked text if marked
    // TODO Add as Info-Icon

    // Search (marked) text for keywords.
    const results = nlp.searchForKeywords(text);


    if (results[0] !== "") {
        let key = results[0];
        let ps = results[1].join(',');

        // TODO
        console.log(key);
        console.log(ps);

        const paragraphs = lawApi.fetchLaws(nlp.lawBook, '', key);
        paragraphs.then(
            p => {
                // Clear suggestion list if new suggestions were found
                if (p.length > 0) {
                    suggestionList.innerHTML = '';
                }

                for (let i = 0; i < p.length; i++) {
                    createEntryInSuggestions(p[i].title, p[i].text, i);
                }

                if (p.length === 0) {
                    for (let i = 0; i < 8; i++) {
                        createEntryInSuggestions("StGB $ 223 Körperverletzung", "(1) Wer eine andere Person körperlich mißhandelt oder an der Gesundheit schädigt, wird mit Freiheitsstrafe bis zu fünf Jahren oder mit Geldstrafe bestraft.\n" +
                            "\n" +
                            "(2) Der Versuch ist strafbar.", i);
                    }
                }

                addEventToItems();
            }
        )
    }


}


let exampleText = "Um 17:45 Uhr am 17.06.2020 erfolgte die Anweisung durch das FLZ die Siberstraße 19 " +
    "in 71253 Entenhausen anzufahren. Laut einem Anrufer waren dort 2 Männer aneinandergeraten, was " +
    "anschließend in eine körperliche Auseinandersetzung übergegangen wäre. Die Anfahrt erfolgte unter Zuhilfenahme " +
    "der Sonder- und Wegerechte ($35, $38 StVO).  Vor Ort konnten tatsächlich 2 Männer angetroffen werden, " +
    "welche sich vor der Einfahrt des Hauses Nr. 19 der Siberstraße schlugen. Dabei lag der Geschädigte Lauditz " +
    "bereits am Boden und versuchte sich vor den Tritten des Beschuldigten Kessler mit den Armen zu schützen.  " +
    "Da der Beschuldigte Kessler auf keinerlei Zurufe reagierte seine Schläge einzustellen, wurde er umgehend von " +
    "meinem Kollegen M.Hammer mithilfe eines Schockschlages zu Boden gebracht. Kurz darauf versuchte der " +
    "Beschuldigte Kessler zu flüchten und" +
    " wurde deshalb von mir und meinem Kollegen M. Hammer umgehend vorläufig festgenommen ($127 StPO). Es erfolgte " +
    "die Belehrung des Beschuldigten gemäß $136 StPO. Der Geschädigte wurde zu seinen Rechten als " +
    "Zeugen belehrt. Er erlitt lediglich leichte Prellungen seitlich der rechten " +
    "Rippen sowie Abschürfungen an beiden Unterarmen. Seinen Aussagen zufolge handelte es sich bei dem Beschuldigten" +
    " Kessler um seinen Nachbarn, welcher sich schon seit Wochen darüber aufregte, dass der Geschädigte Lauditz sein " +
    "PKW abends als so parke, dass die Schnauze des Fahrzeuges von der Einfahrt aus noch in den Gehweg hineinrage. " +
    "Er wünsche einen Strafantrag für die vorliegende Körperverletzung ($223 StGB). Es erfolgte die Aufnahme der " +
    "Personalien der Beteiligten, der Geschädigte Lauditz betrat anschließend sein Haus.  " +
    "Der Beschuldigte Kessler wurde zu seiner Haustüre begleitet, er zeigte sich einsichtig und wurde von seiner " +
    "Frau in Empfang genommen. ";

textArea.value = exampleText;
