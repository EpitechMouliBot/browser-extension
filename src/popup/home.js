function logOut() {
    //TODO remove token from local storage

    window.location.href = "./popup.html";
}

window.onload = () => {
    document.getElementById("logOutBtn").addEventListener("click", logOut);

    //TODO requete api avec le token pour récupérer toutes les infos à part les cookies
}
