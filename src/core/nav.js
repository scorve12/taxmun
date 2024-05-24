export default function renderNav() {
    const navContainer = document.getElementById("nav");
    navContainer.innerHTML = `
    <div id="wrap">
        <header id="headerWrap">
          <nav id="gnbWrap">
            <ul class="gnb">
              <li>
                <a href="#/"><b>알림판</b></a>
                <div class="sub-wrap">
                  <ul>
                    <li> <a href="#/about">팀소개</a></li>
                    <li><a href="">작업물 소개</a></li>
                    <li><a href="">이야기 마당</a></li>
                    <li><a href="">문의사항</a></li>
                  </ul>
                </div>
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
