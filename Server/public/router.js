console.log('Hello World!')

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
}

const routes = {
    "/": "/pages/home.html",
    "/login" : "/pages/login.html",
    "/register" : "/pages/register.html",
    "404": "/pages/404.html"
}

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes["/"];

    console.log("Navigating to:", path, "→", route); 
    const html = await fetch(route).then((data) => data.text());
    document.querySelector('.content').innerHTML = html;

    if (path === "/") {
        const { initPageFunctions } = await import("./script.js");
        initPageFunctions();
    } else if (path === "/login") {
        const { userLogin } = await import("./scripts/login.js"); 
        userLogin();
    } else if (path === "/register") {
        const { registerUser } = await import("./scripts/register.js");
        registerUser();
    }
}


window.onpopstate = handleLocation;
window.route = route;

handleLocation();