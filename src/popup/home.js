import { localStorageIdName, localStorageTokenName, localStorageEmail, initRequest, mouliBotApiUrl, getCookies, getCurrentTab } from "./utils.js"
import { setErrorAlert, setSuccessAlert, closeAlert } from "./alert.js"

async function reloadCookies() {
    const token = localStorage.getItem(localStorageTokenName);
    const id = localStorage.getItem(localStorageIdName);
    if (!id || !token) {
        setErrorAlert(true, "Please reopen this window and login");
        return;
    }
    getCookies().then((cookiesData) => {
        let request = initRequest("PUT", `${mouliBotApiUrl}/user/id/${id}`, {
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
    localStorage.removeItem(localStorageTokenName);
    localStorage.removeItem(localStorageIdName);
    localStorage.removeItem(localStorageEmail);
    window.location.href = "./popup.html";
}

function setDivText(className, value) {
    let elem = document.getElementById(className);
    elem.textContent = value;
}

function adaptiveBackground(cookies_status) {
    const basePath = '../../assets/image/background/my_account/';
    console.log(cookies_status)
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

function listenerCheckBox(checkboxName) {
    const checkbox = document.querySelector(`input[name='${checkboxName}']`);

    checkbox.addEventListener('click', () => {
        const checked = checkbox.checked ? 1 : 0;
        console.log(`${checkboxName} checkbox clicked. New value: ${checkbox.checked}`);

        const token = localStorage.getItem(localStorageTokenName);
        const id = localStorage.getItem(localStorageIdName);
        if (!id || !token) {
            setErrorAlert(true, "Please reopen this window and login");
            return true;
        }

        let payload = {};
        if (checkboxName === 'checkboxDiscord')
            payload.discord_status = checked;
        if (checkboxName === 'checkboxEmail')
            payload.email_status = checked;
        if (checkboxName === 'checkboxNtfy')
            payload.phone_status = checked;
        initRequest("PUT", `${mouliBotApiUrl}/user/id/${id}`, payload, token);
    });
}

function updateCheckbox(checkboxName, value) {
    const checkbox = document.querySelector(`input[name='${checkboxName}']`);
    if (checkbox) {
        checkbox.checked = (value === 1 ? true : false);
    }
}

window.onload = () => {
    document.getElementById("alertMessage").addEventListener("click", closeAlert);
    document.getElementById("logOutBtn").addEventListener("click", logOut);
    document.getElementById("modifyAccountBtn").addEventListener("click", () => {
        window.location.href = "./modifyAccount.html";
    });
    listenerCheckBox('checkboxDiscord');
    listenerCheckBox('checkboxEmail');
    listenerCheckBox('checkboxNtfy');

    const token = localStorage.getItem(localStorageTokenName);
    const id = localStorage.getItem(localStorageIdName);
    if (token && id) {
        let request = initRequest("GET", `${mouliBotApiUrl}/user/id/${id}`, {}, token);
        request.onload = () => {
            if (request.status === 200) {
                const resBody = JSON.parse(request.response);
                adaptiveBackground(resBody.cookies_status);
                setDivText('caseEmail', resBody.email);
                setDivText('caseNtfyTopic', resBody.phone_topic);

                updateCheckbox('checkboxDiscord', resBody.discord_status);
                updateCheckbox('checkboxEmail', resBody.email_status);
                updateCheckbox('checkboxNtfy', resBody.phone_status);
            } else {
                console.log(`Error ${request.status}: ${request.responseText}`);
            }
        };
    }
}
