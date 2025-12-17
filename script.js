const navs = document.getElementById('navContent');
const navIcon = document.getElementById('navIcon');
setTimeout(() => {
    navIcon.classList.toggle('rotate');
    navs.classList.toggle('appear');
}, 10);

navIcon.addEventListener('click', (event) => {
    event.target.classList.toggle('rotate');
    navs.classList.toggle('appear');
});

const activeNavs = document.querySelectorAll('nav li');
const activePages = document.querySelectorAll('body div.page');
for(let i = 0; i < activeNavs.length; i++){
    const nav = activeNavs[i];
    const page = activePages[i];
    //This is for rendering different tabs
    nav.addEventListener('click', (e) => {
        activeNavs.forEach(nav => {
            nav.classList.remove('active')
        });
        e.target.classList.add('active')


        activePages.forEach(p => {
            p.classList.remove('active');
        });
        page.classList.add('active')
            
    });
};