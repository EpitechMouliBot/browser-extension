export const localStorageTokenName = "mouliBotAccountToken";
export const localStorageIdName = "mouliBotAccountId";
export const mouliBotApiUrl = "http://127.0.0.1:3000";

function sanitizeInput(input) {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

export function getValueFromInput(id) {
    return sanitizeInput(document.getElementById(id).value);
}

export function setErrorMessage(visible, text) {
    let errorImage = document.getElementById("errorImage");
    let errorMessage = document.getElementById("errorMessage");
    if (visible) {
        errorImage.className = "visible";
        errorMessage.className = "visible";
        errorMessage.textContent = text;
    } else {
        errorImage.className = "hidden";
        errorMessage.className = "hidden";
        errorMessage.textContent = text;
    }
}

export async function getCurrentTab() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}

export function getCookies(activeTabUrl) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: "GET_COOKIES",
            url: activeTabUrl
        }).then((response) => {
            resolve(response.response);
        }).catch((error) => {
            console.error(`Error when sending message: ${error}`);
            reject(error);
        });
    })
}

export async function makeGetRequest(url, token) {
    const options = {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }};
    return fetch(url, options)
    .then((response) => response)
    .catch((e) => console.log(e))
}


export function initRequest(method, url, body = {}, bearerToken = undefined) {
    let request = new XMLHttpRequest();
    request.open(method, url);
    if (bearerToken)
        request.setRequestHeader("Authorization", "Bearer " + bearerToken);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(body));
    return request;
}
