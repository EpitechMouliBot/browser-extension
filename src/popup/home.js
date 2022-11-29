import { localStorageIdName, localStorageTokenName, initRequest, mouliBotApiUrl } from "./utils.js"

function logOut() {
    localStorage.removeItem(localStorageIdName);
    localStorage.removeItem(localStorageTokenName);
    // window.location.href = "./popup.html";
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
            document.body.style.backgroundImage = `url('${basePath}background_myacc_orange.jpg')`;
            break;
        case 'wait':
            document.body.style.backgroundImage = `url('${basePath}background_myacc_orange.jpg')`;
            break;
        case 'ok':
            document.body.style.backgroundImage = `url('${basePath}background_myacc_green.jpg')`;
            break;
        default:
            document.body.style.backgroundImage = `url('${basePath}background_myacc_red.jpg')`;
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
