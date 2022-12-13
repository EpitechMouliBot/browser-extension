import { getCookies, getCurrentTab, initRequest, localStorageIdName, localStorageTokenName, mouliBotApiUrl } from "./utils.js"
import { checkEmail, checkPassword, checkPasswordMatch } from "./utils.js"
import { setErrorAlert, closeAlert } from "./alert.js"

function checkAllInputs(emailInput, passwordInput, confirmPasswordInput) {
    const cguInput = document.getElementById('acceptCGU')

    if (!checkEmail(emailInput)) {
        setErrorAlert(true, "Email missing");
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
    if (!cguInput.checked) {
        setErrorAlert(true, "CGU not accepted");
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
    if (checkAllInputs(email, password, confirmPassword) === false)
        return (false);

    const activeTab = await getCurrentTab();
    getCookies(activeTab.url).then((cookiesData) => {
        let request = initRequest("POST", `${mouliBotApiUrl}/register`, {
            "email": email,
            "password": password,
            "cookies": JSON.stringify(cookiesData)
        });
        request.onload = () => {
            if (request.status === 201) {
                localStorage.setItem(localStorageTokenName, JSON.parse(request.response).token);
                localStorage.setItem(localStorageIdName, JSON.parse(request.response).id);
                window.location.href = "./home.html";
            } else {
                setErrorAlert(true, "Account already exist")
            }
        };
    }).catch((error) => {
        setErrorAlert(true, "Unable to load cookies");
    });
    return (true);
}

window.onload = () => {
    let submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = false;
    document.getElementById("alertMessage").addEventListener("click", closeAlert);
    document.getElementById("haveAccount").addEventListener("click", () => {window.location.href = './SignIn.html'});
    let form = document.getElementById('signUpForm');
    if (form.attachEvent) {
        form.attachEvent("submit", submitForm);
    } else {
        form.addEventListener("submit", submitForm);
    }
}