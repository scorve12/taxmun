export default function renderNav() {
    const navContainer = document.getElementById("footer");
    navContainer.innerHTML = `
    <div id="footerWrap">
        <footer>
            <div class="contact-info">
                <p>(61452)광주광역시 동구 필문대로 309(서석동, 조선대학교)</p>
                <p>TEL. 062-230-6046 FAX. 062-232-0504</p>
            </div>
            <div class="team-info">
                <p>개발 : 조선의 봄</p>
                <p>과제 : 자율설계학기제</p>
                <p>마감 : 6월 8일</p>
            </div>       
        </footer>
    </div>
    
    `;
}