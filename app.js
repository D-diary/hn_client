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

function getData(url) {
  ajax.open('GET', url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

// ajax의 응답을 번역해서 newFeed에 넣음
const newsFeed = getData(NEWS_URL);
const ul = document.createElement('ul');

window.addEventListener('hashchange', function() {
  const id = location.hash.substr(1);

  const newsContent = getData(CONTENT_URL.replace('@id', id))
  const title = document.createElement('h1');

  title.innerHTML = newsContent.title;

  content.appendChild(title);
});

for(let i = 0; i < 10; i++) {
  const div = document.createElement('div');

  div.innerHTML =  `
    <li>
      <a href="#${newsFeed[i].id}">
        ${newsFeed[i].title} (${newsFeed[i].comments_count})
      </a>
    </li>
  `;

  ul.appendChild(div.firstElementChild);
}

//HTML의 root 아래 ul과 div를 만듬
container.appendChild(ul);
container.appendChild(content);