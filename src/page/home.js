// home.js
import showScroll from './showScroll.js';
export default function home() {
    return `
    <link href="https://fonts.googleapis.com/css2?family=Shippori+Antique+B1&family=Source+Sans+Pro:wght@300;400;600&family=Zen+Kurenaido&display=swap" rel="stylesheet">
    <div class="wrap">
        ${showScroll()}
    </div>
    
    `;
}
