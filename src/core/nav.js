export default function renderNav() {
  const navContainer = document.getElementById("nav");
  navContainer.innerHTML = `
  <div id="wrap">
      <header id="headerWrap">
        <nav id="gnbWrap">
          <ul class="gnb">
            <li>
              <a href="/" data-route="/"><b>원점으로</b></a>
                <div class="sub-wrap">
                  <ul>
                    <li> <a href="/about" data-route="/about">팀소개</a></li>
                    <li><a href="/contact" data-route="/contact">작업물 소개</a></li>
                  </ul>
                </div>
             </li>
             <li>
              <a href="#" data-route="#"><b>계산기</b></a>
                <div class="sub-wrap">
                  <ul>
                    <li> <a href="/synthesis" data-route="/synthesis">종합소득세 계산</a></li>
                    <li><a href="/hourly" data-route="/hourly">시급 계산</a></li>
                    <li><a href="/retirement" data-route="/retirement">퇴직금 계산</a></li>
                    <li><a href="/salary" data-route="/salary">급여 계산</a></li>
                  </ul>
                </div>
             </li>
             <li>
              <a href="#" data-route="#"><b>이야기 마당</b></a>
                <div class="sub-wrap">
                  <ul>
                    <li> <a href="/communication" data-route="/communication">자유게시판</a></li>
                    <li><a href="/notification" data-route="/notification">공지사항</a></li>
                    <li><a href="/inquiry" data-route="/inquiry">문의 사항</a></li>
                  </ul>
                </div>
             </li>
             <li>
             <a href="/login" data-route="/login"><b>로그인</b></a>
             </li>
          </ul>
        </nav>
      </header>
  </div>
  `;

  const gnbLi = document.querySelectorAll('.gnb > li');
  const subMenu = document.querySelectorAll('.sub-wrap');

  for (let i = 0; i < gnbLi.length; i++) {
      if (subMenu[i]) {
          gnbLi[i].addEventListener('mouseover', function() {
              subMenu[i].classList.add('active');
          });

          gnbLi[i].addEventListener('mouseleave', function() {
              subMenu[i].classList.remove('active');
          });
      }
  }

  // SPA 라우터 이벤트 리스너 추가
  document.querySelectorAll('a[data-route]').forEach(anchor => {
      anchor.addEventListener('click', function(event) {
          event.preventDefault();
          const path = anchor.getAttribute('data-route');
          window.history.pushState({}, path, window.location.origin + path);
          window.dispatchEvent(new Event('popstate'));
      });
  });
}
