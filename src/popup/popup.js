import { makeGetRequest, localStorageIdName, localStorageTokenName, mouliBotApiUrl, getCurrentTab } from "./utils.js"

async function checkValidToken() {
    let token = localStorage.getItem(localStorageTokenName);
    let id = localStorage.getItem(localStorageIdName);
    if (token && id) {
        let request = await makeGetRequest(`${mouliBotApiUrl}/user/id/${id}`, token);
        if (request && request.status === 200)
            return (true);
        else
            return (false);
    }
}

window.onload = async () => {
    const activeTab = await getCurrentTab();
    if (activeTab.url.includes("https://my.epitech.eu")) {
        let checkToken = await checkValidToken();
        if (checkToken)
            window.location.href = "./home.html";
        else
            window.location.href = './SignIn.html';
    }
}
