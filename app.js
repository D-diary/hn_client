// html 루트 반복을 줄이기 위해 상수화
const container = document.getElementById('root');
// XMLHttpRequest가 반환하는 결과값을 ajax에 저장
// XMLHttpRequset 객체는 서버로부터 XML 데이터를 전송받아 처리하는데 사용됨
const ajax = new XMLHttpRequest();
// div만듬
const content = document.createElement('div');
// 해커뉴스 api
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const store = {
  currentPage: 1,
};

//ajax 중복되는 부분을 함수화함
function getData(url) {
  ajax.open('GET', url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

function newsFeed() {
  const newsFeed = getData(NEWS_URL);
  const newsList = [];
  let template = `
    <div class="container mx-auto p-4">
      <h1>Hacker News</h1>
      <ul>
        {{__news_feed__}}      
      </ul>
      <div>
        <a href="#/page/{{__prev_page__}}">이전 페이지</a>
        <a href="#/page/{{__next_page__}}">다음 페이지</a>
      </div>
    </div>
  `;
  
  for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
      <li>
        <a href="#/show/${newsFeed[i].id}">
          ${newsFeed[i].title} (${newsFeed[i].comments_count})
        </a>
      </li>
    `);
  }

  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage - 1 : 1);
  template = template.replace('{{__next_page__}}', store.currentPage + 1);


  // 하나로 합침 배열요소안에 있는 문자열들을 하나의 문자열로 합쳐서 반환
  // 콤마라고 하는 문자열로 구분자를 넣어줌 
  container.innerHTML = newsList.join('');
}

// ajax의 응답을 번역해서 newFeed에 넣음

function newsDetail() {
  const id = location.hash.substr(7);

  const newsContent = getData(CONTENT_URL.replace('@id', id))
  const title = document.createElement('h1');

  container.innerHTML = `
  <h1>${newsContent.title}</h1>

  <div>
    <a href="#/page/${store.currentPage}">목록으로</a>
  </div>
  `
}

function router() {
  const routePath = location.hash;

  if (routePath === '') {
    newsFeed();
  } else if (routePath.indexOf('#/page/') >= 0 ) {
    store.currentPage = Number(routePath.substr(7));
    newsFeed();
  } else {
    newsDetail();
  }
}

window.addEventListener('hashchange', router);

router();
