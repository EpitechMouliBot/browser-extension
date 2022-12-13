import { initRequest, localStorageIdName, localStorageTokenName, mouliBotApiUrl } from "./utils.js"
import { setErrorAlert, closeAlert } from "./alert.js"

function submitForm(form) {
    if (form.preventDefault)
        form.preventDefault();
    const formData = new FormData(form.target);
    const data = Object.fromEntries(formData.entries());
    const email = data.email;
    const password = data.password;

    let request = initRequest("POST", `${mouliBotApiUrl}/login`, {
        "email": email,
        "password": password
    });
    request.onload = () => {
        if (request.status === 201) {
            localStorage.setItem(localStorageTokenName, JSON.parse(request.response).token);
            localStorage.setItem(localStorageIdName, JSON.parse(request.response).id);
            window.location.href = "./home.html";
        } else
            setErrorAlert(true, "Invalid credentials")
    };
    return true;
}

window.onload = () => {
    let submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = false;
    document.getElementById("alertMessage").addEventListener("click", closeAlert);
    document.getElementById("noAccount").addEventListener("click", () => {window.location.href = './SignUp.html'});

    let form = document.getElementById('SignInForm');
    if (form.attachEvent) {
        form.attachEvent("submit", submitForm);
    } else {
        form.addEventListener("submit", submitForm);
    }
}
