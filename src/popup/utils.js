export const localStorageTokenName = "auth_token";
export const localStorageIdName = "account_id";
export const localStorageEmail = "account_email";
// export const mouliBotApiUrl = "https://epitechmoulibot.thomasott.fr/api";
export const mouliBotApiUrl = "http://127.0.0.1:3500/api";
import { setErrorAlert } from "./alert.js"

export function checkEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function checkPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\/])(?=.{8,})/.test(password)
}

export function checkPasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
}

function sanitizeInput(input) {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

export function getValueFromInput(id) {
    return sanitizeInput(document.getElementById(id).value);
}

export async function getCurrentTab() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}

export function getCookies() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: "GET_COOKIES"
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
    request.onreadystatechange = function() {
        if (this.status === 0)
            setErrorAlert(true, "Failed to send request");
    };
    request.send(JSON.stringify(body));
    return request;
}
