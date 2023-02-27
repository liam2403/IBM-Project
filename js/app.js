function toggleDarkMode() {
    var elem = document.body;
    // elem.dataset.bsTheme =
    //     elem.dataset.bsTheme == "light" ? "dark" : "light";
    if (elem.dataset.bsTheme == 'light') {
        elem.dataset.bsTheme = 'dark';
        document.getElementById('btn_toggle_light').hidden = false;
        document.getElementById('btn_toggle_dark').hidden = true;

        document.getElementById('img_ibm_logo').src = '../img/IBM_logo_blue.svg';
        document.getElementById('img_se_logo').src = '../img/skills_enablement_logo_blue.svg';

        // const bluebuttons = document.getElementsByClassName('btn-blue-light');
        // for (let i = 0; i < bluebuttons.length; i++) {
        //     bluebuttons[i].classList.add('btn-blue-dark');
        //     bluebuttons[i].classList.remove('btn-blue-light');
        // }
        document.documentElement.className = 'dark';
    } else {
        elem.dataset.bsTheme = 'light';
        document.getElementById('btn_toggle_light').hidden = true;
        document.getElementById('btn_toggle_dark').hidden = false;

        document.getElementById('img_ibm_logo').src = '../img/IBM_logo_black.svg';
        document.getElementById('img_se_logo').src = '../img/skills_enablement_logo.svg';

        // const bluebuttons = document.getElementsByClassName('btn-blue-dark');
        // for (let i = 0; i < bluebuttons.length; i++) {
        //     bluebuttons[i].classList.add('btn-blue-light');
        //     bluebuttons[i].classList.remove('btn-blue-dark');
        // }
        document.documentElement.className = 'light';
    }
}

// COURSE DIRECTORY

function hideFilters() {
    document.getElementById('column_show_filters').hidden = false;
    document.getElementById('filters-column').hidden = true;
    document.getElementById('courses-column').classList.remove('col-lg-9', 'col-md-8', 'col-sm-7');
    document.getElementById('courses-column').classList.add('col-xl-12', 'col-lg-12', 'col-md-12', 'col-sm-12');
    document.getElementById('courses-grid').classList.remove('row-cols-md-2', 'row-cols-lg-3');
    document.getElementById('courses-grid').classList.add('row-cols-sm-2','row-cols-md-3', 'row-cols-lg-4');
}

function showFilters() {
    document.getElementById('column_show_filters').hidden = true;
    document.getElementById('filters-column').hidden = false;
    document.getElementById('courses-column').classList.add('col-lg-9', 'col-md-8', 'col-sm-7');
    document.getElementById('courses-column').classList.remove('col-xl-12', 'col-lg-12', 'col-md-12', 'col-sm-12');
    document.getElementById('courses-grid').classList.add('row-cols-md-2', 'row-cols-lg-3');
    document.getElementById('courses-grid').classList.remove('row-cols-sm-2','row-cols-md-3', 'row-cols-lg-4');
}

// HOMEPAGE


document.addEventListener( 'DOMContentLoaded', function () {
    mountSplides();
} );

function mountSplides() {
    var elms = document.getElementsByClassName('splide');
    
    for ( var i = 0; i < elms.length; i++ ) {
      new Splide( elms[i] , {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '1rem',
        drag: 'free',
        snap: true,
        pagination: false,
        breakpoints: {
            800: {
                perPage: 2,
                gap: '0.7rem',
            },
            480: {
                perPage: 1,
                gap: '0.7rem',
            }
        }
      }
        ).mount();
    }
}