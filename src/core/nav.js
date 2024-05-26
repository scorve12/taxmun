export default function renderNav() {
    const navContainer = document.getElementById("nav");
    navContainer.innerHTML = `
    <div id="wrap">
        <header id="headerWrap">
          <nav id="gnbWrap">
            <ul class="gnb">
              <li>
                <a href="/"><b>원점으로</b></a>
                  <div class="sub-wrap">
                    <ul>
                      <li> <a href="/about">팀소개</a></li>
                      <li><a href="/contact">작업물 소개</a></li>
                    </ul>
                  </div>
               </li>
               <li>
                <a href="/"><b>계산기</b></a>
                  <div class="sub-wrap">
                    <ul>
                      <li> <a href="/synthesis">종합소득세 계산</a></li>
                      <li><a href="/hourly">시급 계산</a></li>
                      <li><a href="/retirement">퇴직금 계산</a></li>
                      <li><a href="/salary">급여 계산</a></li>
                    </ul>
                  </div>
               </li>
               <li>
                <a href="/"><b>이야기 마당</b></a>
                  <div class="sub-wrap">
                    <ul>
                      <li> <a href="/communication">자유게시판</a></li>
                      <li><a href="/notification">공지사항</a></li>
                      <li><a href="/inquiry">문의 사항</a></li>
                    </ul>
                  </div>
               </li>
               <li>
               <a href="/login"><b>로그인</b></a>
               </li>
            </ul>
          </nav>
        </header>
    </div>
    `;

    const gnbLi = document.querySelectorAll('.gnb > li');
    const subMenu = document.querySelectorAll('.sub-wrap');

    for(let i = 0; i < gnbLi.length; i++) {
        gnbLi[i].addEventListener('mouseover', function() {
            subMenu[i].classList.add('active');
        });

        gnbLi[i].addEventListener('mouseleave', function() {
            subMenu[i].classList.remove('active');
        });
    }
}
