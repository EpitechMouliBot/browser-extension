import { localStorageIdName, localStorageTokenName, initRequest, mouliBotApiUrl } from "./utils.js"
import { setErrorAlert, setSuccessAlert, closeAlert } from "./alert.js"

async function reloadCookies() {
    const token = localStorage.getItem(localStorageTokenName);
    const id = localStorage.getItem(localStorageIdName);
    if (!id || !token) {
        setErrorAlert(true, "Please reopen this window and login");
        return;
    }
    const activeTab = await getCurrentTab();
    getCookies(activeTab.url).then((cookiesData) => {
        let request = initRequest("PUT", `${mouliBotApiUrl}/id/${id}`, {
            "cookies": JSON.stringify(cookiesData)
        }, token);
        request.onload = () => {
            if (request.status === 200) {
                setSuccessAlert(true, "Cookies reloaded!");
            } else {
                setErrorAlert(true, "Unable to reload cookies");
            }
        };
    }).catch((error) => {
        setErrorAlert(true, "Unable to reload cookies");
    });
}

function logOut() {
    localStorage.removeItem(localStorageIdName);
    localStorage.removeItem(localStorageTokenName);
    window.location.href = "./popup.html";
}

function setDivText(className, value) {
    let elem = document.getElementById(className);
    elem.textContent = value;
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
    document.getElementById("reloadCookiesBtn").addEventListener("click", reloadCookies);
    document.getElementById("logOutBtn").addEventListener("click", logOut);
    const token = localStorage.getItem(localStorageTokenName);
    const id = localStorage.getItem(localStorageIdName);
    if (token && id) {
        let request = initRequest("GET", `${mouliBotApiUrl}/user/id/${id}`, {}, token);
        request.onload = () => {
            if (request.status === 200) {
                const resBody = JSON.parse(request.response);
                adaptiveBackground(resBody.cookies_status);
                setDivText('caseEmail', resBody.email);
                setDivText('caseDiscordID', resBody.channel_id);
                const date = new Date(resBody.created_at);
                setDivText('caseDateAccount', date.toLocaleDateString("fr"));
                setDivText('caseDiscordStatus', resBody.discord_status === 1 ? 'Active' : 'Disable');
            } else {
                console.log(`Error ${request.status}: ${request.responseText}`);
            }
        };
    }
}
