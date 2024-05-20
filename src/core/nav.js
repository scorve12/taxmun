export default function renderNav() {
    const navContainer = document.getElementById("nav");
    navContainer.innerHTML = `
        <nav>
            <ul>
                <li><a href="#/" id="home-link">Home</a></li>
                <li><a href="#/about" id="about-link">About</a></li>
                <li><a href="#/contact" id="contact-link">Contact</a></li>
            </ul>
        </nav>
    `;
}
