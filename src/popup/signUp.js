import { setErrorMessage } from "./utils.js"

function checkEmail(email) {
    // return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function checkPassword(password) {
    // return true;
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)
}

function checkPasswordMatch(password, confirmPassword) {
    // return true;
    return password === confirmPassword;
}

function checkAllInputs() {
    let emailInput = document.getElementById("emailInput").value;
    let passwordInput = document.getElementById("passwordInput").value;
    let confirmPasswordInput = document.getElementById("confirmPasswordInput").value;

    if (emailInput === "" || passwordInput === "" || confirmPasswordInput === "") {
        setErrorMessage(false, "");
        return true;
    }
    if (!checkEmail(emailInput)) {
        setErrorMessage(true, "Email is invalid");
        return true;
    }
    if (!checkPassword(passwordInput)) {
        setErrorMessage(true, "Password must contain at least: 8 characters, 1 capital letter, 1 small letter, 1 number and 1 special character in !@#$%^&*");
        return true;
    }
    if (!checkPasswordMatch(passwordInput, confirmPasswordInput)) {
        setErrorMessage(true, "Passwords must match");
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
    const confirmPassword = data.confirmpassword;

    console.log(email);
    console.log(password);
    console.log(confirmPassword);

    if (!checkEmail(email) || !checkPassword(password) || !checkPasswordMatch(password, confirmPassword))
        throw new Error("Checks failed");

    console.log("Sign up form ok");
    //TODO requete API signup
    //TODO si requete a marché, stocker token dans local storage et changer de page
    // window.location.href = "./home.html";
    return true;
}

window.onload = () => {
    document.getElementById("emailInput").addEventListener("keyup", enableDisableSubmitBtn);
    document.getElementById("passwordInput").addEventListener("keyup", enableDisableSubmitBtn);
    document.getElementById("confirmPasswordInput").addEventListener("keyup", enableDisableSubmitBtn);
    document.getElementById("haveAccount").addEventListener("click", () => {window.location.href = './logIn.html'});

    let form = document.getElementById('signUpForm');
    if (form.attachEvent) {
        form.attachEvent("submit", submitForm);
    } else {
        form.addEventListener("submit", submitForm);
    }
}
