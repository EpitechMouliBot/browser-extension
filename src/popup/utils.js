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
    let errorMessage = document.getElementById("errorMessage");

    if (visible) {
        errorMessage.className = "visible validation";
        errorMessage.textContent = text;
    } else {
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

export function initRequest(method, url, body = {}, bearerToken = undefined) {
    let request = new XMLHttpRequest();
    request.open(method, url);
    if (bearerToken)
        request.setRequestHeader("Authorization", "Bearer " + bearerToken);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(body));
    return request;
}
