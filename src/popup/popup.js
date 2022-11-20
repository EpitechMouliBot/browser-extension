import { initRequest, localStorageIdName, localStorageTokenName, mouliBotApiUrl, getCurrentTab, getCookies } from "./utils.js"

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

    //** quand l'onglet a changé
    // document.addEventListener("DOMContentLoaded", async () => {
    //     const activeTab = await getCurrentTab();
    //     console.log("DOMContentLoaded");
    // });

    if (!(activeTab.url.includes("https://my.epitech.eu"))) {
        const container = document.getElementById("container");
        container.innerHTML = '<h2 class="title">Please go on my.epitech.eu</h2>';
    } else {
        document.getElementById("login").addEventListener("click", () => {window.location.href = './logIn.html'});
        document.getElementById("signup").addEventListener("click", () => {window.location.href = './signUp.html'});
        checkValidToken();
    }
}
