import { localStorageIdName, localStorageTokenName, initRequest, mouliBotApiUrl } from "./utils.js"
import { checkEmail, checkPassword, checkPasswordMatch } from "./utils.js"
import { setErrorAlert, closeAlert } from "./alert.js"

function checkAllInputs(emailInput, passwordInput, confirmPasswordInput) {
    if (!checkEmail(emailInput)) {
        setErrorAlert(true, "Email missing");
        return (false);
    }
    if (passwordInput === "" && confirmPasswordInput === "")
        return;
    if (confirmPasswordInput === "" || passwordInput === "") {
        setErrorAlert(true, "Please fill both password and confirm password inputs");
        return (false);
    }
    if (!checkPassword(passwordInput) || !checkPassword(confirmPasswordInput)) {
        setErrorAlert(true, "Password missing");
        return (false);
    }
    if (!checkPasswordMatch(passwordInput, confirmPasswordInput)) {
        setErrorAlert(true, "Passwords must match");
        return (false);
    }
    return (true);
}

async function submitForm(form) {
    if (form.preventDefault)
    form.preventDefault();
    const formData = new FormData(form.target);
    const data = Object.fromEntries(formData.entries());
    const email = data.email;
    const password = data.password;
    const confirmPassword = data.confirmpassword;
    if (!checkAllInputs(email, password, confirmPassword))
        return (false);

    const token = localStorage.getItem(localStorageTokenName);
    const id = localStorage.getItem(localStorageIdName);
    if (!id || !token) {
        setErrorAlert(true, "Please reopen this window and login");
        return (true);
    }

    const payload = { "email": email };
    if (password !== "")
        payload.password = password;

    let request = initRequest("PUT", `${mouliBotApiUrl}/id/${id}`, payload, token);
    request.onload = () => {
        if (request.status === 200) {
            window.location.href = "./home.html";
        } else {
            setErrorAlert(true, "Unable to modify your account");
        }
    };
    return (true);
}

function deleteAccount() {
    const token = localStorage.getItem(localStorageTokenName);
    const id = localStorage.getItem(localStorageIdName);
    if (!id || !token) {
        setErrorAlert(true, "Please reopen this window and login");
    }
    if (confirm("Do you really want to delete your account?")) {
        let request = initRequest("DELETE", `${mouliBotApiUrl}/id/${id}`, {}, token);
        request.onload = () => {
            if (request.status === 200) {
                alert("Account deleted");
                window.location.href = "./SignUp.html";
            } else {
                setErrorAlert(true, "Unable to delete your account");
            }
        };
    }
}

function setInputText(className, value) {
    document.getElementById(className).value = value;
}

window.onload = () => {
    let form = document.getElementById('modifyForm');
    if (form.attachEvent) {
        form.attachEvent("submit", submitForm);
    } else {
        form.addEventListener("submit", submitForm);
    }
    document.getElementById("deleteAccountBtn").addEventListener("click", deleteAccount);
    document.getElementById("alertMessage").addEventListener("click", closeAlert);
    const token = localStorage.getItem(localStorageTokenName);
    const id = localStorage.getItem(localStorageIdName);
    if (!id || !token) {
        // window.location.href = './SignIn.html';
        return;
    }
    let request = initRequest("GET", `${mouliBotApiUrl}/user/id/${id}`, {}, token);
    request.onload = () => {
        if (request.status === 200) {
            const resBody = JSON.parse(request.response);
            setInputText('emailInput', resBody.email);
        } else {
            console.log(`Error ${request.status}: ${request.responseText}`);
        }
    };
}
