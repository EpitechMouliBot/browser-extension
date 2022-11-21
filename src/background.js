function getHost (param) {
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

function getCookiesForURL(url) {
    return new Promise((resolve) => {
        chrome.cookies.getAll({}, (cookies) => {
            resolve(cookies.filter((cookie) => {
                return (cookie.domain.indexOf(getHost(url)) !== -1) || (cookie.domain.indexOf("microsoftonline.com") !== -1) || (cookie.domain.indexOf("live.com") !== -1);
            }));
        });
    });
};

chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, url } = obj;

    console.log('message of type: ' + type + ' recieved:\n\turl: ' + url);
    if (type === "GET_COOKIES") {
        getCookiesForURL(url).then((data) => {
            console.log("Cookies from background:");
            console.log(data);
            response({ response: data });
        });
        return true;
    }
});

chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("my.epitech.eu")) {
    }
});
