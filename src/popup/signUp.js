import { setErrorMessage, getCookies, getCurrentTab, initRequest, localStorageIdName, localStorageTokenName } from "./utils.js"

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

async function submitForm(form) {
    if (form.preventDefault)
        form.preventDefault();
    const formData = new FormData(form.target);
    const data = Object.fromEntries(formData.entries());
    const email = data.email;
    const password = data.password;
    const confirmPassword = data.confirmpassword;

    if (!checkEmail(email) || !checkPassword(password) || !checkPasswordMatch(password, confirmPassword))
        throw new Error("Checks failed");

    const activeTab = await getCurrentTab();

    getCookies(activeTab.url).then((cookiesData) => {
        let request = initRequest("POST", `http://127.0.0.1:3000/register`, {
            "email": email,
            "password": password, // TODO encrypter password et cookies
            "cookies": JSON.stringify(cookiesData)
        });
        request.onload = () => {
            if (request.status === 201) {
                localStorage.setItem(localStorageTokenName, JSON.parse(request.response).token);
                localStorage.setItem(localStorageIdName, JSON.parse(request.response).id);
                alert("Account created");
                window.location.href = "./home.html";
            } else {
                let messageRes = `Error ${request.status} when sending request: ${request.responseText}`;
                console.log(messageRes);
                alert(messageRes);
            }
        };
    }).catch((error) => {
        alert("Unable to load cookies");
    });
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
