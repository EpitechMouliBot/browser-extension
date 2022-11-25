import { initRequest, localStorageIdName, localStorageTokenName, mouliBotApiUrl, getCurrentTab } from "./utils.js"

function checkValidToken() {
    let token = localStorage.getItem(localStorageTokenName);
    let id = localStorage.getItem(localStorageIdName);
    if (token && id) {
        let request = initRequest("GET", `${mouliBotApiUrl}/user/id/${id}`, {}, token);
        request.onload = () => {
            if (request.status === 200) {
                window.location.href = "./home.html";
            } else {
                console.log(`Error ${request.status}: ${request.responseText}`);
            }
        };
    }
}

window.onload = async () => {
    const activeTab = await getCurrentTab();

    if (!activeTab.url.includes("https://my.epitech.eu")) {
        // document.getElementById('backgroundBody').style.backgroundImage="url(../../assets/image/background/background_wrong_website.jpg)";
    } else {
        window.location.href = './SignIn.html';
        checkValidToken();
    }
}
