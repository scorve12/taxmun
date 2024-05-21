export default function renderNav() {
    const navContainer = document.getElementById("nav");
    navContainer.innerHTML = `
    <div id="wrap">
        <header id="headerWrap">
          <nav id="gnbWrap">
            <ul class="gnb">
              <li>
                <a href="#/">마당</a>
                <div class="sub-wrap">
                  <ul>
                    <li><a href="">sub-menu1</a></li>
                    <li><a href="">sub-menu2</a></li>
                    <li><a href="">sub-menu3</a></li>
                    <li><a href="">sub-menu4</a></li>
                  </ul>
                </div>
               </li>
               <li>
                <a href="#/about">팀소개</a>
                <div class="sub-wrap">
                  <ul>
                    <li><a href="">sub-menu1</a></li>
                    <li><a href="">sub-menu2</a></li>
                    <li><a href="">sub-menu3</a></li>
                    <li><a href="">sub-menu4</a></li>
                  </ul>
                </div>
               </li>
               <li>
                <a href="#/contact">menu3</a>
                <div class="sub-wrap">
                  <ul>
                    <li><a href="">sub-menu1</a></li>
                    <li><a href="">sub-menu2</a></li>
                    <li><a href="">sub-menu3</a></li>
                    <li><a href="">sub-menu4</a></li>
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
