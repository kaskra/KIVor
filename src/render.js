const electron = require('electron');
const lawApi = require('./api_calls');
const nlp = require('./fake_nlp');

const textArea = document.getElementById('mainTextArea');
const suggestionList = document.getElementById('suggestionList');
const detailCard = document.getElementById('detail_card');
const checkBtn = document.getElementById('checkTextBtn');

checkBtn.onclick = oldQuery;


async function getSuggestions() {
    // TODO language model anwenden?


    const text = textArea.value;
    console.log(text);

    const li = document.createElement('li');
    const itemText = document.createTextNode(text);
    li.appendChild(itemText);

    // li.className = "card";
    suggestionList.appendChild(li);

    // li onclick open detailsBox

    detailCard.hidden = false;
}

function createEntryInSuggestions(json){
    let body = json['title'];
    console.log(body);
}

async function oldQuery() {
    const text = textArea.value;
    const results = nlp.searchForKeywords(text);

    console.log(results);
    if (results[0] !== ""){
        let key = results[0];
        let ps = results[1].join(',');
        let book_code = nlp.lawBook;

        console.log(key);
        console.log(ps);
        console.log(book_code);

        const paragraphs = lawApi.fetchLaws(book_code, '', key);
        // let paragraphs = lawApi.fetchLaw(book_code, '', key);
        // paragraphs.then(
        //     p => {
        //         for (let i=0; i <= p['results'].length; i++){
        //             createEntryInSuggestions(p['results'][i]);
        //         }
        //
        //     }
        // )

        console.log(paragraphs);
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



const detailText = document.getElementById('detail_text');
detailText.onclick = function () {
    console.log('Clicked!');
    detailText.innerHTML = "";
};
