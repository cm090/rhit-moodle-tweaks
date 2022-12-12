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
cleanSideMenu();
modifyURL();