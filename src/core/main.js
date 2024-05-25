import Router from './router.js';
import renderNav from './nav.js';
import renderFooter from './footer.js'
import home from '../page/home.js';
import about from '../page/about.js';
import contact from '../page/contact.js';

const routes = {
    "/": home,
    "/about": about,
    "/contact": contact
};

document.addEventListener("DOMContentLoaded", () => {
    renderNav();
    renderFooter();
    const router = new Router(routes);

    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            const path = anchor.getAttribute('href');
            router.navigateTo(path);
        });
    });
});
