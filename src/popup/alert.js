export function setErrorAlert(visible, text) {
    let alertImage = document.getElementById("alertImage");
    let alertMessage = document.getElementById("alertMessage");
    alertImage.style.backgroundImage = 'url("../../assets/image/error_message.png")';
    if (visible) {
        alertImage.className = "visible";
        alertMessage.className = "visible";
        alertMessage.textContent = text;
    } else {
        alertImage.className = "hidden";
        alertMessage.className = "hidden";
        alertMessage.textContent = text;
    }
}

export function setSuccessAlert(visible, text) {
    let alertImage = document.getElementById("alertImage");
    let alertMessage = document.getElementById("alertMessage");
    alertImage.style.backgroundImage = 'url("../../assets/image/success_message.png")';
    if (visible) {
        alertImage.className = "visible";
        alertMessage.className = "visible";
        alertMessage.textContent = text;
    } else {
        alertImage.className = "hidden";
        alertMessage.className = "hidden";
        alertMessage.textContent = text;
    }
}

export function closeAlert() {
    setSuccessAlert(false, "");
    setErrorAlert(false, "");
}
