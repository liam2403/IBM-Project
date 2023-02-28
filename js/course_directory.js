// GLOBAL
// 01 - Course Data API (Json)
const api = "http://raw.githubusercontent.com/SilverDragon-RY/nothing_here/main/sample";

// Function 00 - Init Instance
function initPageInstance() {
    var app = new Vue({
        el: '#content',
        data: {
            // course data info
            all: ["None"],
            // Filter, course table style
            isFilterShowing: true,
            courseCol_FilterShown: ['col-lg-9', 'col-md-8', 'col-sm-7'],
            courseCol_FilterHidden: ['col-xl-12', 'col-lg-12', 'col-md-12', 'col-sm-12'],
            courseGrid_FilterShown: ['row-cols-md-2', 'row-cols-lg-3'],
            courseGrid_FilterHidden: ['row-cols-sm-2', 'row-cols-md-3', 'row-cols-lg-4'],
            // Badges Main
            badgesMain: {
                "Badge": "text-bg-warning",
                "Beginner": "text-bg-info",
                "Free": "text-bg-success",
                "Self-paced": "text-bg-secondary",
                "Intermediate": "text-bg-info",
                "Paid": "text-bg-success",
                "Self-paced with labs": "text-bg-secondary"
            },
            // Badges Secndary
            badgesSecond: {
                "Badge": "fa-certificate",
                "Beginner": "fa-signal",
                "Free": "fa-tag",
                "Self-paced": "fa-chalkboard-user",
                "Intermediate": "fa-signal",
                "Paid": "fa-tag",
                "Self-paced with labs": "fa-chalkboard-user"
            },
            // Searched Content Placer - Modify with Function
            searched: " ",
            // Filtered Content Placer - Modify with Function
            filtered: []
        },
        // Helper Functions
        methods: {
            removefilter: function (iD) {
                removeFilter(iD);
            }
        }
    });
    return app;
}
// Function 01 - Theme Switch - Done
function toggleDarkMode() {
    var elem = document.body;
    if (elem.dataset.bsTheme == 'light') {
        elem.dataset.bsTheme = 'dark';
        document.getElementById('btn_toggle_light').hidden = false;
        document.getElementById('btn_toggle_dark').hidden = true;

        document.getElementById('img_ibm_logo').src = '../img/IBM_logo_blue.svg';
        document.getElementById('img_se_logo').src = '../img/skills_enablement_logo_blue.svg';

        document.documentElement.className = 'dark';
    } else {
        elem.dataset.bsTheme = 'light';
        document.getElementById('btn_toggle_light').hidden = true;
        document.getElementById('btn_toggle_dark').hidden = false;

        document.getElementById('img_ibm_logo').src = '../img/IBM_logo_black.svg';
        document.getElementById('img_se_logo').src = '../img/skills_enablement_logo.svg';

        document.documentElement.className = 'light';
    }
}

// Function 02 - Construct Data - TBD
function constructFunc(course_data) {
    // Not usefull for now
    return course_data;
}

// Function 03 - Hide Filter - Done
function hideFilters() {
    app.isFilterShowing = false;
}

// Function 04 - Show Filter - Done
function showFilters() {
    app.isFilterShowing = true;
}

// Function 05 - Fetch Course Data and Update - Done
function fetchCourseData(app){
    var courses_all = fetch(api);
    courses_all.then((response) => {
        courses_ALL = response.json();
        courses_ALL.then((data) => {
            var allCourse = constructFunc(data);
            app.all = allCourse;
            return allCourse;
        })
    })
}

// Function 06 - Update Filter - TBD
function updateFilter() {
    var newFilter = [];
    for (i in x) {
        for (var j = 0; j < x[i].length; j++) {
            if (x[i][j].checked) {
                newFilter.push(x[i][j].value);
            }
        }
    }
    // TBD - Filter function
    app.filtered = newFilter;
}

// Function 07 - Remove Filter - TBD
function removeFilter(t) {
    // Untick
    for (i in x) {
        for (var j = 0; j < x[i].length; j++) {
            if (x[i][j].value == t) {
                x[i][j].click()
            }
        }
    }
    // Since Update Filter is called automatically, no need to manual update
}

// MAIN
document.addEventListener('DOMContentLoaded', function () {
    // Init Page Instance
    app = initPageInstance();
    // Update Tick Box
    var field = document.getElementsByName("field");
    var level = document.getElementsByName("level");
    var feature = document.getElementsByName("feature");
    var rating = document.getElementsByName("rating");
    x = [field, level, feature, rating];
    // Fetch Course Data
    allCourse = fetchCourseData(app);
    // apply splide
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