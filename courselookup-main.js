if (document.forms[0] && document.forms[0].name == 'InputForm') {
	const quarters = document.forms[0].termcode.innerHTML;
	fetch('https://raw.githubusercontent.com/cm090/rhit-moodle-tweaks/main/assets/courselookup-home').then(res => res.text().then(data => {
		document.querySelector('html').innerHTML = data;
		document.querySelector('#quarters').innerHTML = quarters;
	}));
}