import Router from './router.js';
import renderNav from './nav.js';
import renderFooter from './footer.js';
import home from '../page/home.js';
import about from '../page/about.js';
import contact from '../page/contact.js';
import communication from '../page/communication.js';
import inquiry from '../page/inquiry.js';
import hourly from '../page/hourly.js';
import notification from '../page/notification.js';
import retirement from '../page/retirement.js';
import salary from '../page/salary.js';
import synthesis from '../page/synthesis.js';
import login from '../page/login.js';

const routes = {
    "/": home,
    "/about": about,
    "/contact": contact,
    "/communication": communication,
    "/hourly": hourly,
    "/inquiry": inquiry,
    "/notification": notification,
    "/retirement": retirement,
    "/salary": salary,
    "/synthesis": synthesis,
    "/login": login
};

document.addEventListener("DOMContentLoaded", () => {
    renderNav();
    renderFooter();
    const router = new Router(routes);

    document.querySelectorAll('a[data-route]').forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            const path = anchor.getAttribute('href');
            router.navigateTo(path);
        });
    });
});
