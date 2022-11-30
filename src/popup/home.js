import { localStorageIdName, localStorageTokenName, initRequest, mouliBotApiUrl } from "./utils.js"

function logOut() {
    localStorage.removeItem(localStorageIdName);
    localStorage.removeItem(localStorageTokenName);
    window.location.href = "./popup.html";
}

function addTableElement(key, value) {
    let table = document.getElementById("account-infos-tbody");
    let trElem = document.createElement("tr");
    let tdElem1 = document.createElement("td");
    let tdElem2 = document.createElement("td");
    tdElem1.innerText = key;
    tdElem2.innerText = value;
    trElem.appendChild(tdElem1);
    trElem.appendChild(tdElem2);
    table.appendChild(trElem);
}

function adaptiveBackground(cookies_status) {
    const basePath = '../../assets/image/background/my_account/';
    switch (cookies_status) {
        case 'new':
            document.getElementById("cookiesStatusImg").src = `${basePath}cookies_status_orange.jpg`;
            document.getElementById("cookiesStatusImg").title = 'Waiting for your cookies to be activated';
            break;
        case 'wait':
            document.getElementById("cookiesStatusImg").src = `${basePath}cookies_status_orange.jpg`;
            document.getElementById("cookiesStatusImg").title = 'Waiting for your cookies to be verified';
            break;
        case 'ok':
            document.getElementById("cookiesStatusImg").src = `${basePath}cookies_status_green.jpg`;
            document.getElementById("cookiesStatusImg").title = 'Your cookies are good';
            break;
        default:
            document.getElementById("cookiesStatusImg").src = `${basePath}cookies_status_red.jpg`;
            document.getElementById("cookiesStatusImg").title = 'Your cookies are expired, please reload them';
            break;
    }
}

window.onload = () => {
    document.getElementById("logOutBtn").addEventListener("click", logOut);
    const token = localStorage.getItem(localStorageTokenName);
    const id = localStorage.getItem(localStorageIdName);
    if (token && id) {
        let request = initRequest("GET", `${mouliBotApiUrl}/user/id/${id}`, {}, token);
        request.onload = () => {
            if (request.status === 200) {
                const resBody = JSON.parse(request.response);
                adaptiveBackground(resBody.cookies_status);
                addTableElement("Email", resBody.email);
                addTableElement("Discord server id", resBody.user_id);
                addTableElement("Discord channel id", resBody.channel_id);
                addTableElement("Notif status", resBody.cookies_status);
                const date = new Date(resBody.created_at);
                addTableElement("Date", date.toLocaleDateString("fr"));
            } else {
                console.log(`Error ${request.status}: ${request.responseText}`);
            }
        };
    }
}
