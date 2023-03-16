const username = "johnsmith";

/* Mount splides */
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
        }).mount();
    };
};

/* Function to load in progress courses into splide */
async function loadCourses (courseList) {
    const listElem = document.querySelector(".splide__list");
    for (id of courseList) {
        try {
            let response = await fetch("http://127.0.0.1:3000/courses/" + id);
            let course = await response.json();
            const title = course.Title;
            const topic = course.Topic;
            const difficulty = course.Difficulty;
            const template = `<div class="splide__slide">
            <a href="http://127.0.0.1:3000/views/course_info.html?id=${id}" class="card h-100 shadow-sm card-button text-decoration-none">
                <div class="card-body">
                    <h6 class="card-title text-emphasis fw-bold">${title}</h6>
                    <small class="text-muted">${topic}</small>
                    <p class="card-text mt-2"><span class="badge text-bg-info"><i class="fa-solid fa-signal me-1"></i>${difficulty}</span></p>
                </div>
            </a>
            </div>`
            listElem.insertAdjacentHTML("beforeend", template);
        } catch (error) {
            console.log(error);
        }
    };
};


/* Main function when page loads */
window.addEventListener("load", async function (event) {
    fetch("http://127.0.0.1:3000/userCourses/" + username + "/inProgress")
        .then(res => res.json())
        .then(courseArr => loadCourses(Object.keys(courseArr)))
        .then(() => mountSplides())
        .catch((error) => {
            console.log(error);
        });
});