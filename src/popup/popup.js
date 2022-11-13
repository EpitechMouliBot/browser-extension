async function get_current_tab() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}

function getCookies(activeTabUrl) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({
            type: "GET_COOKIES",
            url: activeTabUrl
        }).then((response) => {
            // console.log("Cookies from popup: ");
            // console.log(response.response);
            resolve(response.response);
        }).catch((error) => {
            console.error(`Error when sending message: ${error}`);
            throw error;
        });
    })
};

const grabBtn = document.getElementById("grabBtn");
grabBtn.addEventListener("click", async () => {
    const activeTab = await get_current_tab();

    getCookies(activeTab.url).then((data) => {
        console.log(data);
        alert("Cookies loaded!\n" + JSON.stringify(data));
    }).catch((error) => {
        console.log(error);
        alert(error);
    })
});

// quand l'onglet a changé
document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await get_current_tab();

    if (activeTab.url.includes("https://my.epitech.eu")) {
        const testElem = document.getElementById("test");
        testElem.innerHTML = '<p>Test p</p>';
    } else {
        const container = document.getElementById("container");
        container.innerHTML = '<div class="title">Nothing to show.</div>';
    }
});
