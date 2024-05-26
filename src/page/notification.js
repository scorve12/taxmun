export default async function notification() {
  try {
      const response = await fetch('/src/api/notification.php');
      
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const notifications = await response.json();

      let tableRows = notifications.map(notification => `
          <tr class="list_board">
              <td width="70">${notification.idx}</td>
              <td width="500"><a href="inform_board_detail.php?idx=${notification.idx}">${notification.title}</a></td>
              <td width="120">${notification.name}</td>
              <td width="100">${notification.view}</td>
          </tr>
      `).join('');

      return `
          <div id="board_area"> 
              <h1>공지사항</h1>
              <div id="button_area">
                  <button class="sort-btn" data-sortby="idx"><span>&darr;</span> 순번순</button>
                  <button class="sort-btn" data-sortby="view"><span>&darr;</span> 조회순</button>
              </div>
              <table class="list-table">
                  <thead>
                      <tr>
                          <th width="70">번호</th>
                          <th width="500">제목</th>
                          <th width="120">글쓴이</th>
                          <th width="100">조회수</th>
                      </tr> 
                  </thead>
                  <tbody>
                      ${tableRows}
                  </tbody>
              </table>
              <div id="write_btn">
                  <a href="inform_board_write.php"><button>글쓰기</button></a>
              </div>
          </div>
          <div id="search_box">
              <form action="inform_board_search.php" method="get">
                  <select name="search_option">
                      <option value="title">제목</option>
                      <option value="name">작성자</option>
                      <option value="content">내용</option>
                  </select>
                  <input type="text" name="search" size="40" required="required" /> <button>검색</button>
              </form>
          </div>
          <a href="index.php"><button>메인화면으로</button></a>
      `;
  } catch (error) {
      console.error('Error loading notifications:', error);
      return '<p>Error loading notifications.</p>';
  }
}
