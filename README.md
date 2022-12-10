# Moodle Tweaks
CSS and JS files that add functionality to Moodle

Note: This code was designed for Rose-Hulman's Moodle site


## Getting Started
1. Download a code injector plugin for your browser. I'm using [Injector for Chrome](https://chrome.google.com/webstore/detail/injector/bfdonckegflhbiamlmidciapolfccmmb).
2. Create new CSS and JS snippets for the website domain. Copy and paste the code from `main.css` and  `main.js`.
3. Click save and reload your Moodle page

## Features
### JavaScript
CleanSideMenu:
- Removes old courses from the sidebar. Click on "My courses" to set up

ModifyURL:
- Redirects to dashboard when on site home and course enrollment pages. Add `#bypass` to the end of the URL to avoid redirect.
- Removes forcedownload attributes from file links. Useful for images and PDFs.

### CSS
A modern interface design with darker colors

Screenshots:

![Dashboard screen](screenshots/dashboard.png)