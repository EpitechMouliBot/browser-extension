import { setErrorMessage } from "./utils.js"

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

    console.log(email);
    console.log(password);

    console.log("Log in form ok");
    //TODO requete API get login
    //TODO si requete a marché, stocker token dans local storage et changer de page
    // window.location.href = "./home.html";
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