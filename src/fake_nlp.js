module.exports = {
    searchForKeywords: searchForKeywords,
    lawBook: 'stgb',
};

const mapping = {
    'waffe': ['250', '177', '224', '244'],
    'krankenhaus': ['66b', '71', '63', '67a', '223'],
    'opfer': ['238', '177', '239', '221', '178', '223'],
    'gewalt': ['223', '229', '224', '227', '231'],
    'raub': ['177', '244a', '316a', '260'],
    'tod': ['222', '251', '231', '306c', '176b'],
    'vergewaltigung': ['177', '178', '176b'],
    'strafe': ['145d', '258', '67', '59c'],
    'geld': ['146', '149', '150', '147'],
    'notwehr': ['32', '33'],
    'tat': ['145d'],
    'verteidigt': ['32', '33'],
    'angriff': ['224', '223', '226', '227'],
    'körperverletzung': ['223', '229', '224', '227', '231'],
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

