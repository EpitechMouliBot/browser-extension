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
}
