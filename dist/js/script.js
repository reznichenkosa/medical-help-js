let isLogin = localStorage.getItem('isLogin') || null;
let loginUser = localStorage.getItem('login') || null;

const getData = async () => {
  return await fetch('db.json').then(data => data.json());
}

function Header() {
  const html = `
    <div class="container">
        <div class="header__wrapper">
            <a href="#/" class="header__logo">
                <img src="images/logo.svg" alt="logo">
            </a>
            <a href="#/contacts" class="header__contacts">Контакты</a>
            ${!isLogin ? '<button class="header__btn">Войти</button>' : 
                          '<button class="header__btn">Выйти</button>'}
        </div>
    </div>
  `;
  
  document.querySelector('.header').innerHTML = html;

  if (isLogin) {
    document.querySelector('.header__btn').addEventListener('click', singOut);
  } else {
    document.querySelector('.header__btn').addEventListener('click', Modal);
  }
}

function Home() {

  const html = `
    <section class="home">
      <div class="container">
          <div class="home__wrapper">
              <h1 class="home__title title">Место для получения медицинской помощи</h1>
              <div class="home__btns">
                  ${!isLogin ? '<button class="home__btn btn btn_primary" data-btn-open>Войти</button>' : 
                  '<a href="#/cabinet" class="home__btn btn btn_primary">Кабинет</a>'}
                  <a href="#/contacts" class="home__btn btn">Контакты</a>
              </div>
              <div class="home__services">
                  <div class="home__service">
                      <div class="home__service-icon">
                          <img src="icons/heart.svg" alt="heart">
                      </div>
                      <h5 class="home__service-title">Онлайн-прием</h5>
                      <span class="home__service-desc">Рыба текст</span>
                  </div>
                  <div class="home__service">
                      <div class="home__service-icon">
                          <img src="icons/headphones.svg" alt="headphones">
                      </div>
                      <h5 class="home__service-title">Экстренный Случай</h5>
                      <span class="home__service-desc">Рыба текст</span>
                  </div>
                  <div class="home__service">
                      <div class="home__service-icon">
                          <img src="icons/history.svg" alt="history">
                      </div>
                      <h5 class="home__service-title">Лечение рака</h5>
                      <span class="home__service-desc">Рыба текст</span>
                  </div>
              </div>
          </div>
      </div>
    </section>
  `;

  document.querySelector("#main").innerHTML = html;

  if (!isLogin) {
    document.querySelector('[data-btn-open]').addEventListener('click', Modal);
  }
}

async function Cabinet() {

  let name = '';
  if (loginUser) {
    await getData().then(data => {name = data[loginUser].name});
  }

  const html = `
    <section class="cabinet">
      <div class="container">
          <div class="cabinet__wrapper">
              <h2 class="cabinet__title title">Привет, ${name}</h2>
              <div class="cabinet__btns">
                  <button class="cabinet__btn btn btn_primary">Выйти из аккаунта</button>
                  <a href="#/contacts" class="cabinet__btn btn">Перейти в контакты</a>
              </div>
          </div>
      </div>
    </section>
  `;
    
  document.querySelector("#main").innerHTML = html;

  document.querySelector('.cabinet__btn').addEventListener('click', singOut);
}

function Contacts() {

  const html = `
    <section class="contacts">
      <div class="container">
          <div class="contacts__wrapper">
              <h2 class="contacts__title title">Контакты</h2>
          </div>
      </div>
    </section>
  `;

  document.querySelector("#main").innerHTML = html;
}

function NotFound() {
  const html = `
    <section class="contacts">
      <div class="container">
          <div class="contacts__wrapper">
              <h2 class="contacts__title title">Not Found 404</h2>
          </div>
      </div>
    </section>
  `;
  document.querySelector("#main").innerHTML = html;
}

function Modal() {
  const html = `
    <div class=popup data-modal>
      <div class=popup__dialog>
          <div class=popup__content>
              <span class=popup__close>&times;</span>
              <form action="">
                  <label>
                      Логин:
                      <input minlength="3" required type="text" name="login">
                  </label>
                  <label>
                      Пароль:
                      <input minlength="8" required type="password" name="password">
                  </label>
                  <div data-message></div>
                  <button class="popup__btn btn">Войти</button>
              </form>
          </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  document.querySelector('.popup__close').addEventListener('click', () => {
    document.querySelector('[data-modal]').remove();
  })

  const form = document.querySelector('form');
  const login = form.querySelector('input[name="login"]');
  const password = form.querySelector('input[name="password"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    getData().then(data => {
      if (data[login.value] && data[login.value].password === password.value) {
        isLogin = true;
        loginUser = login.value;
        localStorage.setItem('isLogin', true);
        localStorage.setItem('login', login.value);
        window.location.hash = "#/cabinet";
        document.querySelector('[data-modal]').remove();
        Header();
      } else {
        const formMessage = document.querySelector('[data-message]');
        
        formMessage.textContent = 'Не верные данные';
        setTimeout(() => {
          formMessage.textContent = '';
        }, 3000);
      }
    })
  }) 
}

function singOut() {
  isLogin = false;
  loginUser = null;
  localStorage.removeItem('isLogin');
  localStorage.removeItem('login');
  if (window.location.hash === "#/") {
    Home();
  } else {
    window.location.hash = "#/";
  }
  Header();
};

Header();

const pageTitle = "Медицинская помощь";
const routes = {
  '/': {
    component: Home,
    title: 'Главная | ' + pageTitle,
    description: 'Главная',
  },
  '/cabinet': {
    component: Cabinet,
    title: 'Кабинет | ' + pageTitle,
    description: 'Кабинет',
  },
  '/contacts': {
    component: Contacts,
    title: 'Контакты | ' + pageTitle,
    description: 'Контакты',
  },
  '404': {
    component: NotFound,
    title: '404 | ' + pageTitle,
    description: '404',
  }
}

function router() {
  const location = window.location.hash.replace('#','');

  if (location === '/cabinet' && !isLogin) {
    window.location.hash = "#/";
  }

  const path =  location.length === 0 ? '/' : location;
  const route = routes[path] || routes['404'];

  route.component();
  document.title = route.title;
  document.querySelector('meta[name="description"]').setAttribute("content", route.description);
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
