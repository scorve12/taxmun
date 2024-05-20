export default class Router {
    constructor(routes) {
        this.routes = routes;
        this.loadInitialRoute();
    }

    async loadRoute(path) {
        const app = document.getElementById("app");
        const route = this.routes[path];

        if (typeof route === "function") {
            app.innerHTML = await route();
        } else {
            app.innerHTML = "<h1>404</h1><p>Page not found.</p>";
        }
    }

    loadInitialRoute() {
        const path = window.location.hash.replace("#", "") || "/";
        this.loadRoute(path);
        window.addEventListener("hashchange", () => {
            this.loadRoute(window.location.hash.replace("#", ""));
        });
    }
}
