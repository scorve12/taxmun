export default function renderNav() {
    const navContainer = document.getElementById("footer");
    navContainer.innerHTML = `
    <div id="footerWrap">
        <footer>
            <div class="team-info">
                <p>홍길동 - 개발자</p>
                <p>이순신 - 디자이너</p>
                <p>장보고 - 프로젝트 매니저</p>
            </div>
        </footer>
    </div>
    
    `;
}