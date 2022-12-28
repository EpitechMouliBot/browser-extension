function getHost(param) {
    if (param.toString().match(/http(s?):\/\//)) {
        let url = new URL(param);
        url = url.host.replace('www.', '');
        if (url.split('.').length > 2) {
            let splits = url.split('.');
            splits.shift();
            return splits.join('.');
        }
        return url;
    }
}

function getCookiesForEpitech() {
    return new Promise((resolve) => {
        chrome.cookies.getAll({}, (cookies) => {
            resolve(cookies.filter((cookie) => {
                return (cookie.domain.indexOf("epitech.eu") !== -1) || (cookie.domain.indexOf("microsoftonline.com") !== -1) || (cookie.domain.indexOf("live.com") !== -1);
            }));
        });
    });
};

chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type } = obj;

    if (type === "GET_COOKIES") {
        getCookiesForEpitech().then((data) => {
            response({ response: data });
        });
        return true;
    }
});
