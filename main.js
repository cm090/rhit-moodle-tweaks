const version = '2023.01.06';

let courseData = [];
const checkForUpdates = () => {
    const d = new Date();
    if (localStorage.getItem('lastCheck') == `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`) return Promise.resolve(false);
    return fetch('https://raw.githubusercontent.com/cm090/rhit-moodle-tweaks/main/main.js').then(res => {
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
    }).then(() => {
        localStorage.setItem('lastCheck', `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);
        return Promise.resolve(true);
    });
}

const setStyle = () => {
    const d = new Date();
    return fetch(`https://raw.githubusercontent.com/cm090/rhit-moodle-tweaks/main/assets/main.css?${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`).then(res => {
        return res.text();
    }).then(data => {
        var s = document.createElement("style");
        s.innerHTML = data;
        document.getElementsByTagName("head")[0].appendChild(s);
    }).then(() => Promise.resolve());
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
        } else {
            courseData.push([text, item.querySelector('a').href]);
            if (start && !text.includes(quarter))
                item.style.display = 'none';
            else if (text == activeCourse)
                item.querySelector('a').classList.add('active');
        }
    });
    return Promise.resolve();
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
    return Promise.resolve();
}

const addButtons = () => {
    if (window.location.pathname != '/my/') return Promise.resolve(false);
    if (document.querySelector("#page-header > div > div > div").clientWidth <= 833) return Promise.resolve();
    const d = new Date();
    return fetch(`https://raw.githubusercontent.com/cm090/rhit-moodle-tweaks/main/assets/header-buttons?${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`).then(res => {
        return res.text();
    }).then(data => {
        let element = document.querySelector("#page-header > div > div > div > div.d-flex.flex-wrap")
        element.innerHTML = data + element.innerHTML;
        onresize = () => checkButtons();
        checkButtons();
    }).then(() => Promise.resolve(true));
}

const checkButtons = () => {
    document.querySelector('#rmtButtons').style.display = (document.querySelector("#page-header > div > div > div").clientWidth <= 833) ? 'none' : 'flex';
}

const searchListener = () => {
    document.getElementById('rmtSearch').addEventListener('shown.bs.modal', () => document.querySelector('#rmtSearch .modal-body input').focus());
    let pos = 1;
    document.getElementById('rmtSearchInput').addEventListener('keydown', e => {
        if (e.key == 'ArrowDown') {
            e.preventDefault();
            if (pos < document.querySelectorAll('#rmtSearch #rmtResultList div').length) {
                document.querySelector(`#rmtSearch #rmtResultList div:nth-child(${pos})`).classList.remove('active');
                pos++;
                document.querySelector(`#rmtSearch #rmtResultList div:nth-child(${pos})`).classList.add('active');
            }
        } else if (e.key == 'ArrowUp') {
            e.preventDefault();
            if (pos > 1) {
                document.querySelector(`#rmtSearch #rmtResultList div:nth-child(${pos})`).classList.remove('active');
                pos--;
                document.querySelector(`#rmtSearch #rmtResultList div:nth-child(${pos})`).classList.add('active');
            }
        } else if (event.key == 'Enter') {
            document.querySelector(`#rmtSearch #rmtResultList div:nth-child(${pos})`).click();
        }
    });
    const createList = e => {
        pos = 1;
        let i = 0;
        document.getElementById('rmtResultList').innerHTML = '';
        courseData.forEach(item => {
            if (item[0].toLowerCase().includes(e.target.value.toLowerCase()) && i < 5) {
                document.getElementById('rmtResultList').innerHTML += `<div style="margin:0" onclick="window.location='${item[1]}'">${item[0]}</div>`;
                i++;
            }
        });
        if (i == 0)
            document.getElementById('rmtResultList').innerHTML += `<div style="margin:0" onclick="window.location='https://moodle.rose-hulman.edu/search/index.php?q=${document.getElementById('rmtSearchInput').value}'">More results</div><p style="color:lightgray; font-size:12px; margin-top:5px; margin-bottom:0;">Courses older than 1 year might not show up in this list</p>`;
        document.querySelector('#rmtSearch #rmtResultList div:first-child').classList.add('active');
    }
    document.getElementById('rmtSearchInput').addEventListener('input', createList);
    createList({ target: { value: '' } });
    document.addEventListener('keydown', e => {
        if (!e.repeat && (e.ctrlKey || e.metaKey) && e.key == 'k') {
            e.preventDefault();
            $('#rmtSearch').modal('show');
        }
    });
    return Promise.resolve();
}

const searchCode = () => {
    const d = new Date();
    return fetch(`https://raw.githubusercontent.com/cm090/rhit-moodle-tweaks/main/assets/search-modal?${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`).then(res => {
        return res.text();
    }).then(data => {
        document.body.innerHTML += data;
        searchListener();
    }).then(() => Promise.resolve(true));
}

const start = () => {
    console.log('RMT > RHIT Moodle Tweaks by cm090\nhttps://github.com/cm090/rhit-moodle-tweaks');
    checkForUpdates().then(res => {
        if (res) console.log('RMT > Successfully checked for updates');
        else console.log('RMT > Skipped update check');
        setStyle();
    }).then(() => {
        console.log('RMT > Custom styles activated');
        cleanSideMenu();
    }).then(() => {
        console.log('RMT > Side menu modified, click "My courses" to change');
        searchCode();
    }).then(() => {
        console.log('RMT > Search program ready, press Ctrl+K to use');
        modifyURL();
    }).then(() => {
        console.log('RMT > Finished URL check');
        addButtons().then(res => {
            if (res) console.log('RMT > Added custom buttons');
            else console.log('RMT > Skipped custom buttons');
            console.log('RMT > Done!');
        });
    });
}

start();