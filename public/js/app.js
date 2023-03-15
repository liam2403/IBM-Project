// Initialise dark mode on page load
function checkDarkMode() {
    var elem = document.body;
    if (localStorage.getItem('theme') == null) {
        localStorage.setItem('theme', 'light');
    } else if (localStorage.getItem('theme') == 'dark') {
        elem.dataset.bsTheme = 'dark';
        document.getElementById('btn_toggle_light').hidden = false;
        document.getElementById('btn_toggle_dark').hidden = true;
        document.getElementById('img_ibm_logo').src = '../img/IBM_logo_blue.svg';
        document.getElementById('img_se_logo').src = '../img/skills_enablement_logo_blue.svg';
        document.documentElement.className = 'dark';
    };
};

// Function to toggle additional dark mode elements
function toggleDarkMode() {
    var elem = document.body;
    if (localStorage.getItem('theme') == 'light') {
        localStorage.setItem('theme', 'dark');
        elem.dataset.bsTheme = 'dark';
        document.getElementById('btn_toggle_light').hidden = false;
        document.getElementById('btn_toggle_dark').hidden = true;
        document.getElementById('img_ibm_logo').src = '../img/IBM_logo_blue.svg';
        document.getElementById('img_se_logo').src = '../img/skills_enablement_logo_blue.svg';
        document.documentElement.className = 'dark';
    } else if (localStorage.getItem('theme') == 'dark') {
        localStorage.setItem('theme', 'light');
        elem.dataset.bsTheme = 'light';
        document.getElementById('btn_toggle_light').hidden = true;
        document.getElementById('btn_toggle_dark').hidden = false;
        document.getElementById('img_ibm_logo').src = '../img/IBM_logo_black.svg';
        document.getElementById('img_se_logo').src = '../img/skills_enablement_logo.svg';
        document.documentElement.className = 'light';
    };
};

document.addEventListener('DOMContentLoaded', function () {
    checkDarkMode();
});