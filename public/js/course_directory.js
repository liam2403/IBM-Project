// GLOBAL
// 01 - Course Data API (Json)
const api = "https://ibm-education-app-default-rtdb.europe-west1.firebasedatabase.app/.json";
// 02 - Available Tag Categories
const CAT = ["Pace", "Topic", "Difficulty", "Cost"];
// 03 - Server Address
const addr = "127.0.0.1:3000"

// Function 00 - Init Instance
function initPageInstance() {
    var app = new Vue({
        el: '#content',
        data: {
            // course data info ALL
            all: ["None"],
            // course data info CURRENT
            courses: ["None"],
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

// Function 02 - Construct Data - Done - Change with DB
function constructFunc(course_data) {
    let Courses = [];
    let rawCourses = course_data.courses;
    for (course in rawCourses) {
        // construct individual course data
        newCourse = {};
        // ESSENTIAL
        newCourse.name = rawCourses[course].Title;
        newCourse.imgsrc = rawCourses[course].imgsrc;
        newCourse.description = rawCourses[course].Description;
        newCourse.link = "/views/course_info.html?id=" + course;
        newCourse.tags = [];
        newCourse.rating = 0;
        newCourse.rated = 0;
        // None Essential : Check before use.
        for (attr in rawCourses[course]) {
            this_attr = rawCourses[course][attr];
            // is it a tag?
            if (CAT.includes(attr)){
                newCourse.tags.push(this_attr);
            };
            // is it rating?
            if (attr == "rating") {
                newCourse.rating = rawCourses[course].rating;
                newCourse.rated = rawCourses[course].rated;
            };
        };
        // Finish
        Courses.push(newCourse);
    }
    return Courses;
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
            app.courses = allCourse;
            app.all = allCourse;
            return allCourse;
        })
    })
}

// Function 06 - Update Filter - Done
function updateFilter() {
    // Tickbox Function
    let newFilter = [];
    for (i in x) {
        for (var j = 0; j < x[i].length; j++) {
            if (x[i][j].checked) {
                newFilter.push(x[i][j].value);
            }
        }
    }
    app.filtered = newFilter;
    // Filter Function
    let newContent = [];
    if (newFilter.length == 0) {
        // show all
        newContent = app.all;
        app.searched = "";
    }
    else {
        // filter
        // for each course
        for (i in app.all) {
            // for each tags selected
            let fit = 1;
            for (j in newFilter) {
                if (app.all[i].tags.includes(newFilter[j]) == false) {
                    fit = 0;
                }
            }
            // fit?
            if (fit == 1) {
                newContent.push(app.all[i]);
            }
        }
        // construct info sentence
        app.searched = "Showing " + newContent.length + " Results of filtered tags."
    }
    // update
    app.courses = newContent;
}

// Function 07 - Remove Filter - Done
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

// Function 08 - Clear All Filter - Done
function clearAll() {
    // Reset Instance
    app.filtered = [];
    app.searched = "";
    app.courses = app.all;
    // Reset HTML
    for (i in x) {
        for (var j = 0; j < x[i].length; j++) {
            x[i][j].checked = false;
        }
    }
}

// Function 09 - Search
function search() {
    // get Input
    let searched = document.getElementById("searchbar").value.toLowerCase();
    let newContent = [];
    // for every courses
    for (i in app.all) {
        // if name or decription contents substring
        if (app.all[i].name.toLowerCase().includes(searched) == true || app.all[i].description.toLowerCase().includes(searched) == true) {
            newContent.push(app.all[i]);
        }
    }
    // reset filter, generate message, set instance value
    // clearAll();
    app.searched = "Showing " + newContent.length + " Results including '" + searched + "' .";
    app.courses = newContent;
}

// MAIN
document.addEventListener('DOMContentLoaded', function () {
    // Init Page Instance
    app = initPageInstance();
    // Update Tickbox Element
    var field = document.getElementsByName("field");
    var level = document.getElementsByName("level");
    var feature = document.getElementsByName("feature");
    var rating = document.getElementsByName("rating");
    var price = document.getElementsByName("price");
    x = [field, level, feature, rating, price];
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