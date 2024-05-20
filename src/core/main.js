import Router from './router.js';
import home from '../page/home.js';
import about from '../page/about.js';
import contact from '../page/contact.js';

const routes = {
    "/": home,
    "/about": about,
    "/contact": contact
};

document.addEventListener("DOMContentLoaded", () => {
    const router = new Router(routes);
});
