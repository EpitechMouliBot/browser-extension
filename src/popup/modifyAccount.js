import { localStorageIdName, localStorageTokenName, localStorageEmail, initRequest, mouliBotApiUrl, mouliBotRelayUrl } from "./utils.js"
import { checkEmail, checkPassword, checkPasswordMatch } from "./utils.js"
import { setErrorAlert, closeAlert } from "./alert.js"

function checkAllInputs(emailInput, passwordInput, confirmPasswordInput) {
    if (!checkEmail(emailInput)) {
        setErrorAlert(true, "Email missing");
        return false;
    }
    if (passwordInput === "" && confirmPasswordInput === "")
        return true;
    if (confirmPasswordInput === "" || passwordInput === "") {
        setErrorAlert(true, "Please fill both password and confirm password inputs");
        return false;
    }
    if (!checkPassword(passwordInput) || !checkPassword(confirmPasswordInput)) {
        setErrorAlert(true, "Password missing");
        return false;
    }
    if (!checkPasswordMatch(passwordInput, confirmPasswordInput)) {
        setErrorAlert(true, "Passwords must match");
        return false;
    }
    return true;
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
        return false;

    const token = localStorage.getItem(localStorageTokenName);
    const id = localStorage.getItem(localStorageIdName);
    if (!id || !token) {
        setErrorAlert(true, "Please reopen this window and login");
        return true;
    }

    const payload = { "email": email };
    if (password !== "")
        payload.password = password;
    let requestApi = initRequest("PUT", `${mouliBotApiUrl}/user/id/${id}`, payload, token);
    requestApi.onload = () => {
        if (requestApi.status === 200) {
            const oldEmail = localStorage.getItem(localStorageEmail);
            let requestRelay = initRequest("GET", `${mouliBotRelayUrl}/account/change/${id}/${oldEmail}/${email}`, {}, token);
            requestRelay.onload = () => {
                if (requestRelay.status === 200) {
                    localStorage.setItem(localStorageEmail, email);
                    window.location.href = "./home.html";
                } else
                    setErrorAlert(true, "Unable to modify your account");
            };
        } else
            setErrorAlert(true, "Unable to modify your account");
    };
    return true;
}

function deleteAccount() {
    const token = localStorage.getItem(localStorageTokenName);
    const id = localStorage.getItem(localStorageIdName);
    const email = localStorage.getItem(localStorageEmail);
    if (!id || !token || !email)
        setErrorAlert(true, "Please reopen this window and login");
    if (confirm("Do you really want to delete your account?")) {
        let requestApi = initRequest("DELETE", `${mouliBotApiUrl}/user/id/1`, {}, token);
        requestApi.onload = () => {
            if (requestApi.status === 200) {
                let requestRelay = initRequest("DELETE", `${mouliBotRelayUrl}/account/delete/${email}`, {}, token);
                requestRelay.onload = () => {
                    if (requestRelay.status === 200) {
                        alert("Account deleted");
                        localStorage.removeItem(localStorageTokenName);
                        localStorage.removeItem(localStorageIdName);
                        localStorage.removeItem(localStorageEmail);
                        window.location.href = "./SignUp.html";
                    } else
                        setErrorAlert(true, "Unable to delete your account, please retry later");
                };
            } else
                setErrorAlert(true, "Unable to delete your account, please retry later");
        };
    }
}

function setInputText(className, value) {
    document.getElementById(className).value = value;
}

window.onload = () => {
    let form = document.getElementById('modifyForm');
    if (form.attachEvent)
        form.attachEvent("submit", submitForm);
    else
        form.addEventListener("submit", submitForm);
    document.getElementById("deleteAccountBtn").addEventListener("click", deleteAccount);
    document.getElementById("alertMessage").addEventListener("click", closeAlert);
    document.getElementById("cancelBtn").addEventListener("click", () => {
        window.location.href = "./home.html";
    });
    const token = localStorage.getItem(localStorageTokenName);
    const id = localStorage.getItem(localStorageIdName);
    const email = localStorage.getItem(localStorageEmail);
    if (!id || !token || !email) {
        window.location.href = './SignIn.html';
        return;
    }
    setInputText('emailInput', email);
}
