module.exports = {
    buildSuggestionItem: _buildSuggestionItem,
};

function _buildSuggestionItem(title, text, index) {
    const splitTitle = title.split(' ');
    // Get the next (add 2 because upper limit of splice is exclusive).
    let idx = splitTitle.indexOf('§') + 2;

    let paragraph = splitTitle.slice(0, idx).join(' ');
    let paragraphTitleText = splitTitle.slice(idx).join(' ');

    return '<a class="list-group-item list-group-item-action border-left-0 border-right-0 border-top-0" id="suggestionItem' + index + '">\n' +
        '<h5 class="card-title">' + paragraph + '</h5>\n' +
        '<h6 class="card-subtitle mb-2">' + paragraphTitleText + '</h6>\n' +
        '<p class="mb-0">' + text + '</p>\n' +
        '</a>'.trim();
}
