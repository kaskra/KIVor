module.exports = {
    fetchLaws: fetchLaws,
};

const {dialog} = require('electron').remote;

/**
 * Data transfer class to make access of response of law book api easier.
 */
class LawResponse {

    constructor(bookCode, title, text) {
        this.bookCode = bookCode;
        this.title = title;
        this.text = text;

    }
}

/**
 * Request https://de.openlegaldata.io/ to query information about laws/law books etc.
 * @param {string} bookCode the law book code
 * @param {string} title string to search for in the title
 * @param {string} text string to search for in the text
 * @returns {Promise<[LawResponse]>} response from with found laws
 */
async function fetchLaws(bookCode, title, text) {
    const auth = 'a945a429b0b6112353d740fd834ed456391cda10';

    let url = "https://de.openlegaldata.io/api/laws/search/?";
    let req = url + "book_code=" + bookCode + "&text=" + text + "&title=" + title;

    let response = await fetch(req, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth,
        }
    });

    if (response.status === 429) {
        dialog.showErrorBox("Abfragefehler", "Ihre heutige Anzahl an Requests ist aufgebraucht!\n(Limitierung der Datenbank)");

        return [];
    }

    return await response.json().then(
        p => {
            let res = [];
            for (let i = 0; i < p['results'].length; i++) {
                // Make sure that the result is actually a paragraph (e.g. not a table of contents).
                if (p['results'][i]['title'].search('§') !== -1) {
                    let bookCode = p['results'][i]['book_code'];
                    let title = p['results'][i]['title'];
                    let text = p['results'][i]['text'];

                    let t = new LawResponse(bookCode, title, text);
                    res.push(t);
                }
            }
            return res;
        }
    );
}


