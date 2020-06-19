module.exports = {
    fetchLaws: fetchLaws,
    fetchLaw: fetchLaw,
};

// a945a429b0b6112353d740fd834ed456391cda10
// https://stackoverflow.com/questions/34860814/basic-authentication-using-javascript
// https://stackoverflow.com/questions/31473420/make-an-http-post-authentication-basic-request-using-javascript
// https://github.com/openlegaldata/oldp-sdk-javascript/blob/master/src/ApiClient.js
// https://de.openlegaldata.io/
// async function fetchLaws(bookCode, title, text, id) {
//     let call = "https://de.openlegaldata.io/api/laws/search/?book_code=" + bookCode + "&text=" + text +
//         "&title=" + title + "&id=" + id;
//     console.log(call);
//     let response = await fetch(call, );
//     let data = await response.json();
//     console.log(data);
//     return data;
// }

async function _fetch(request){
    const auth = 'a945a429b0b6112353d740fd834ed456391cda10';

    let response = await fetch(request, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth,
        }
    });

    return await response.json();
}

function fetchLaws(bookCode, title, text) {
    const auth = 'a945a429b0b6112353d740fd834ed456391cda10';

    let url = "https://de.openlegaldata.io/api/laws/search/?";
    let req = url + "book_code=" + bookCode + "&text=" + text + "&title=" + title;

    let res = _fetch(req);

    let x = res.then(p=>p['results']);
    console.log(x);

    return x;
}


function fetchLaw(bookCode, title, text) {
    const auth = 'a945a429b0b6112353d740fd834ed456391cda10';
    let data = 'book_code=' + bookCode + '&text=' + text + '&title=' + title;
    let request = new XMLHttpRequest();
    request.open("GET", 'https://de.openlegaldata.io/api/laws/search/?' + data);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', auth);
    request.send(data);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                alert(request.responseText);
                let res = JSON.parse(request.responseText);
                console.log(res);
                return res;
            } else if (request.status === 204) {
                return {'msg': "Could not find any matching paragraphs!"};
            } else if (request.status === 404) {
                return {'msg': "Could not find this request!"};
            }
        } else if (request.readyState === 3) {
            return {'msg': 'Loading...'};
        }
    }
}