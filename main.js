const version = '2022.12.16';

document.getElementsByTagName("head")[0].insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="https://raw.githubusercontent.com/cm090/rhit-moodle-tweaks/main/assets/main.css" />');

const checkForUpdates = () => {
    const d = new Date();
    if (localStorage.getItem('lastCheck') == `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`) return;
    fetch('https://raw.githubusercontent.com/cm090/rhit-moodle-tweaks/main/main.js').then(res => {
        return res.text();
    }).then(data => {
        let globalVersion = data.split("const version = '")[1].substring(0, 10);
        if (version != globalVersion) {
            const element = document.querySelector("#nav-drawer > nav:nth-child(1) > ul > li:nth-child(1)").cloneNode(true);
            element.querySelector('a').classList.remove('active');
            element.querySelector('a').href = 'https://github.com/cm090/rhit-moodle-tweaks';
            element.querySelector('a').target = '_blank';
            element.querySelector('.media-body').innerText = 'Update available!';
            element.querySelector('.icon').classList = 'icon fa fa-info fa-fw';
            document.querySelector("#nav-drawer > nav > ul").prepend(element);
        }
    });
    localStorage.setItem('lastCheck', `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`);
}
const cleanSideMenu = () => {
    let quarter = localStorage.getItem('filterQuarter');
    let start = false;
    const activeCourse = (document.querySelector('[data-key="coursehome"] .media-body')) ? document.querySelector('[data-key="coursehome"] .media-body').innerText : '';
    document.querySelectorAll("#nav-drawer > nav.list-group > ul > li").forEach(item => {
        item.style.display = '';
        let text = item.querySelector('.media-body').innerText;
        if (!start) {
            if (text == 'My courses') {
                start = true;
                item.onclick = () => {
                    let newQuarter = prompt('Select a quarter (Ex: 2223F):');
                    newQuarter = parseInt(newQuarter.substring(0, 4)) + newQuarter.charAt(4);
                    localStorage.setItem('filterQuarter', newQuarter);
                    cleanSideMenu();
                }
                return;
            } else if (item.querySelector('a').href == window.location.href)
                item.querySelector('a').classList.add('active');
        } else if (start && !text.includes(quarter))
            item.style.display = 'none';
        else if (text == activeCourse)
            item.querySelector('a').classList.add('active');
    });
}
const modifyURL = () => {
    if ((window.location.pathname.length < 2 || window.location.href.includes('enrol')) && !window.location.hash.includes('bypass'))
        window.location.pathname = '/my';
    document.querySelectorAll('a').forEach((link) => {
        if (link.href.includes('?forcedownload=1')) {
            link.href = link.href.split('?forcedownload')[0];
            link.target = '_blank';
        }
    });
}
const addButtons = () => {
    if (window.location.pathname != '/my/') return;
    fetch('https://raw.githubusercontent.com/cm090/rhit-moodle-tweaks/main/assets/header-buttons').then(res => {
        return res.text();
    }).then(data => {
        let element = document.querySelector("#page-header > div > div > div > div.d-flex.flex-wrap")
        element.innerHTML = data + element.innerHTML;
    });
}
checkForUpdates();
cleanSideMenu();
modifyURL();
addButtons();