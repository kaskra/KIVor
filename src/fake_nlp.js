module.exports = {
    searchForKeywords: searchForKeywords,
    lawBook: 'stgb',
};

const mapping = {
    'waffe': [],
    'krankenhaus': [],
    'opfer': [],
    'gewalt': [],
    'raub': ['177', '244a', '316a', '260'],
    'tod': [],
    'vergewaltigung': [],
    'strafe': [],
    'geld': [],
    'notwehr': [],
    'tat': [],
    'verteidigung': [],
    'angriff': [],
    'körperverletzung': [],
};

function searchForKeywords(text) {
    let maxKey = "";
    let maxAmount = 0;
    for (let k in mapping) {
        let lowerCasedKey = "\\b"+k.toLowerCase()+"\\b";
        let regExp = new RegExp(lowerCasedKey, 'g');
        let matches = text.toLowerCase().matchAll(regExp);
        let numMatches = [...matches].length;
        if (numMatches > maxAmount) {
            maxAmount = numMatches;
            maxKey = k;
        }
    }
    return [maxKey, mapping[maxKey]];
}

// nach wörtern in text suchen...
// die mit den meisten vorkommen unterschiedlicher keywords als bestes gewichten
