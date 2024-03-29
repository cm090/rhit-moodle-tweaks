const printListener = () => {
	document.addEventListener('keydown', e => {
		if (!e.repeat && (e.ctrlKey || e.metaKey) && e.key == 'p') {
			e.preventDefault();
			window.location += '#print';
			location.reload();
		}
	});
}

const runApp = allowPrint => {
	if (window.location.hash == '#print' && allowPrint) {
		window.print();
		window.history.back();
		runApp(false);
		return;
	}
	printListener();
	if (document.forms[0] && document.querySelector("body > form > table > tbody > tr:nth-child(4) > td:nth-child(1)") && document.querySelector("body > form > table > tbody > tr:nth-child(4) > td:nth-child(1)").innerText.includes('ID')) {
		const quarters = document.forms[0].termcode.innerHTML;
		fetch('https://raw.githubusercontent.com/cm090/rhit-moodle-tweaks/main/assets/courselookup-home').then(res => res.text().then(data => {
			document.querySelector('html').innerHTML = data;
			document.querySelector('#quarters').innerHTML = quarters;
		}));
	} else if (document.title.includes('Course Matrix View'))
		fetch('https://raw.githubusercontent.com/cm090/rhit-moodle-tweaks/main/assets/courselookup-matrix').then(res => res.text()).then(data => document.querySelector('body').innerHTML = data + document.querySelector('body').innerHTML);
	else if (document.querySelectorAll('table').length > 1)
		fetch('https://raw.githubusercontent.com/cm090/rhit-moodle-tweaks/main/assets/courselookup-detail').then(res => res.text()).then(data => document.querySelector('body').innerHTML = data + document.querySelector('body').innerHTML);
	else if (document.title.includes('Schedule Options'))
		fetch('https://raw.githubusercontent.com/cm090/rhit-moodle-tweaks/main/assets/courselookup-schedule').then(res => res.text()).then(data => document.querySelector('body').innerHTML = data + document.querySelector('body').innerHTML);
}

runApp(true);