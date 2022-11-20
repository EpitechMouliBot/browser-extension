import { setErrorMessage, initRequest, localStorageIdName, localStorageTokenName } from "./utils.js"

function checkAllInputs() {
    let emailInput = document.getElementById("emailInput").value;
    let passwordInput = document.getElementById("passwordInput").value;

    if (emailInput === "" || passwordInput === "") {
        // setErrorMessage(false, "");
        return true;
    }
    setErrorMessage(false, "");
    return false;
}

function enableDisableSubmitBtn() {
    let submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = checkAllInputs();
}

function submitForm(form) {
    if (form.preventDefault)
        form.preventDefault();
    const formData = new FormData(form.target);
    const data = Object.fromEntries(formData.entries());
    const email = data.email;
    const password = data.password;

    let request = initRequest("POST", `http://127.0.0.1:3000/login`, {
        "email": email,
        "password": password // TODO encrypter password
    });
    request.onload = () => {
        if (request.status === 201) {
            localStorage.setItem(localStorageTokenName, JSON.parse(request.response).token);
            localStorage.setItem(localStorageIdName, JSON.parse(request.response).id);
            window.location.href = "./home.html";
        } else {
            let messageRes = `Error ${request.status} when sending request: ${request.responseText}`;
            console.log(messageRes);
            alert(messageRes);
        }
    };
    return true;
}

window.onload = () => {
    document.getElementById("emailInput").addEventListener("keyup", enableDisableSubmitBtn);
    document.getElementById("passwordInput").addEventListener("keyup", enableDisableSubmitBtn);
    document.getElementById("noAccount").addEventListener("click", () => {window.location.href = './signUp.html'});

    let form = document.getElementById('logInForm');
    if (form.attachEvent) {
        form.attachEvent("submit", submitForm);
    } else {
        form.addEventListener("submit", submitForm);
    }
}