export default class Router {
    constructor(routes) {
        this.routes = routes;
        this.loadInitialRoute();
        this.addPopStateListener();
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

    addPopStateListener() {
        window.addEventListener("popstate", (event) => {
            this.loadRoute(window.location.pathname);
        });
    }

    loadInitialRoute() {
        const path = window.location.pathname || "/";
        this.loadRoute(path);
    }

    navigateTo(path) {
        window.history.pushState({}, path, window.location.origin + path);
        this.loadRoute(path);
    }
}