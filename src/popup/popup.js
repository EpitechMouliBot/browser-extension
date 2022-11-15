// const grabBtn = document.getElementById("grabBtn");
// grabBtn.addEventListener("click", async () => {
//     const activeTab = await get_current_tab();

//     getCookies(activeTab.url).then((data) => {
//         console.log(data);
//         alert("Cookies loaded!\n" + JSON.stringify(data));
//     }).catch((error) => {
//         console.log(error);
//         alert(error);
//     });
// });

window.onload = () => {
    document.getElementById("login").addEventListener("click", () => {window.location.href = './logIn.html'});
    document.getElementById("signup").addEventListener("click", () => {window.location.href = './signUp.html'})

    //** quand l'onglet a changé
    // document.addEventListener("DOMContentLoaded", async () => {
    //     const activeTab = await get_current_tab();

    //     if (!(activeTab.url.includes("https://my.epitech.eu"))) {
    //         const container = document.getElementById("container");
    //         container.innerHTML = '<h2 class="title">Nothing to show.</h2>';
    //     }
    // });

    //TODO if valid token in local storage
    // window.location.href = window.location.href = "./home.html"
}
