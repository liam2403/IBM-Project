
const username = "johnsmith";
const listTracker = {};

/* Function to load user's courses into HTML*/
async function LoadData (data) {
    const listTypes = Object.keys(data);
    for (const listType of listTypes) {
        const listElem = document.querySelector("#" + listType);
        const coursesInList = Object.entries(data[listType]);
        for ([id, progVal] of coursesInList) {
            listTracker[id] = listType;
            let response = await fetch("http://127.0.0.1:3000/courses/" + id);
            let course = await response.json();
            const title = course.Title;
            const topic = course.Topic;
            let imgsrc = "https://upload.wikimedia.org/wikipedia/commons/1/18/Grey_Square.svg";
            if (course.imgsrc) {
                imgsrc = course.imgsrc;
            }
            const template = `<div id="info-${id}" class="card h-100 shadow-sm text-decoration-none mb-2">
            <i class="fa-regular fa-circle-pause text-muted btn-action pause" id="pause${id}"></i>
            <i class="fa-regular fa-trash-can text-muted btn-action bin" id="bin${id}"></i>
            <div>
                <div id="bar${id}" data-orig="${listType}" class="rounded-0 rounded-top progress align-self-center" role="progressbar" aria-valuenow="${progVal}" aria-valuemin="0" aria-valuemax="100" style="height: 10px">
                    <div id="prog${id}" class="progress-bar progress-bar-striped" style="width:${progVal}%"></div>
                </div>
            </div>
            <a href="http://127.0.0.1:3000/views/course_info.html?id=${id}" class="text-decoration-none row align-items-center card-body pb-2">
                <div class="col-4 col-lg-12 col-xl-4 text-center">
                    <img src="${imgsrc}" class="thumbnail">
                </div>
                <div class="col-8 col-lg-12 col-xl-8">
                    <h6 class="text-emphasis fw-bold my-1">${title}</h6>
                </div>
                <small class="text-muted mt-1">${topic}</small>
            </a>
            <input id="input${id}" class="slider mt-1" type="range" min="0" max="100" step="1" value="${progVal}" />
            </div>`
            listElem.insertAdjacentHTML("beforeend", template);
        };
    };
};

/* Function to update appearance of progress bar and list */
function updateProgBar (e) {
    const courseId = e.target.id.slice(5);
    const elemProg = document.querySelector('#prog' + courseId);
    const elemBar = document.querySelector('#bar' + courseId);
    const newProgVal = e.target.value;
    elemProg.setAttribute('style', 'width: ' + newProgVal + '%');
    elemBar.setAttribute('aria-valuenow', newProgVal);
    elemBar.classList.add("changed");
    if (newProgVal == 0) {
        moveToList(courseId, "notStarted");
    } else if (newProgVal == 100) {
        moveToList(courseId, "completed");
    } else if (listTracker[courseId] != "inProgress") {
        moveToList(courseId, "inProgress");
    };
};

/* Function to move course to different list in HTML */
function moveToList (courseId, listName) {
    const elemList = document.querySelector("#" + listName);
    const elemCard = document.querySelector("#info-" + courseId);
    elemList.appendChild(elemCard);
    listTracker[courseId] = listName;
};

/* Function to get the bin/pause buttons to work */
function configActionBtns () {
    // Configure button to remove course from list
    const modal = new bootstrap.Modal('#deleteModal');
    const confirmationBtn = document.querySelector("#deleteConfirmBtn");
    document.querySelectorAll(".bin").forEach(btn => {
        btn.addEventListener('click', () => {
            const courseId = btn.id.slice(3);
            modal.show();
            confirmationBtn.onclick = function () {
                modal.hide();
                deleteCourse(courseId);
            };
        });
    });
    // Configure button to put course on hold
    document.querySelectorAll(".pause").forEach(btn => {
        btn.addEventListener('click', () => {
            const courseId = btn.id.slice(5);
            document.querySelector('#bar' + courseId).classList.add('changed')
            moveToList(courseId, "onHold");
        });
    });
};

/* Function to remove course in HTML and database*/
function deleteCourse (id) {
    const card = document.querySelector("#info-" + id);
    card.remove();
    const url = ["http://127.0.0.1:3000/userCourses", username, listTracker[id], id].join("/");
    console.log(url)
    fetch(url, { method: 'DELETE' })
        .then(res => res.json())
        .then(delete listTracker[id])
        .catch((error) => {
            console.log(error);
        });
};

/* Function to ask user to confirm they want to save list changes */
function showSaveModal () {
    const modal = new bootstrap.Modal('#saveModal');
    const confirmationBtn = document.querySelector("#saveConfirmBtn");
    modal.show();
    confirmationBtn.onclick = function () {
        modal.hide();
        saveChanges();
    };
};

/* Function to save user's course list changes*/
function saveChanges () {
    const arrChangedCourses = {"notStarted": {}, "inProgress": {}, "completed": {}, "onHold": {}};
    // Retrieve all elements that have been changed and add them to arrChangedCourses array
    document.querySelectorAll(".changed").forEach(function (elem) {
        const courseId = elem.id.slice(3);
        const listOrig = elem.getAttribute("data-orig");
        const listCurrent = listTracker[courseId];
        const courseProgressVal = Number(elem.getAttribute("aria-valuenow"));
        if (listOrig != listCurrent) {
            let url = ["http://127.0.0.1:3000/userCourses", username, listOrig, courseId].join("/");
            fetch(url, { method: 'DELETE' })
                .then(res => res.json())
                .then(arrChangedCourses[listCurrent][courseId] = courseProgressVal)
                .catch((error) => {
                    console.log(error);
                });
        } else if (listCurrent == "inProgress" || listCurrent == "onHold") {
            arrChangedCourses[listCurrent][courseId] = courseProgressVal;
        };
        elem.setAttribute("data-orig", listCurrent);
        elem.classList.remove("changed");
    });
    for (const list in arrChangedCourses) {
        if (Object.keys(arrChangedCourses[list]).length) {
            url = ["http://127.0.0.1:3000/addusercourse", username, list].join("/");
            fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(arrChangedCourses[list])
            })
                .then(res => res.json())
                .catch((error) => {
                    console.log(error);
                });
        };
    };
};

/* Main function */
window.addEventListener("load", async function (event) {
    event.preventDefault();
    try {
        let response = await fetch("http://127.0.0.1:3000/userCourses/" + username);
        let body = await response.json();
        console.log(body)
        LoadData(body)
            .then(() => {
                document.querySelectorAll(".slider").forEach(slider => {
                    slider.addEventListener('mouseup', updateProgBar);
                });
                configActionBtns();
            })
    } catch (error) {
        console.log(error);
        // Simulate an HTTP redirect:
        // window.location.replace("http://127.0.0.1:3000/views/404.html");
    }
});

/* Function to ask user if they want to save changes when exiting a page */
window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
});

