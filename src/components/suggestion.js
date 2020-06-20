module.exports = {
    buildSuggestionItem: _buildSuggestionItem,
};

const detailCard = document.getElementById('details-card');

function showDetails() {

}

function _buildSuggestionItem(title, text, maxLength = 60) {
    const splitTitle = title.split(' ');
    // Get the next (add 2 because upper limit of splice is exclusive).
    let idx = splitTitle.indexOf('§') + 2;

    let paragraph = splitTitle.slice(0, idx).join(' ');
    let paragraphTitleText = splitTitle.slice(idx).join(' ');

    let truncatedText = text.substr(0, maxLength) + " [...]";
    return '<a class="list-group-item list-group-item-action border-left-0 border-right-0 border-top-0" id="suggestionItem">\n' +
        '<h5 class="card-title">' + paragraph + '</h5>\n' +
        '<h6 class="card-subtitle mb-2 text-muted">' + paragraphTitleText + '</h6>\n' +
        '<p class="mb-0">' + text + '</p>\n' +
        '</a>'.trim();
}
