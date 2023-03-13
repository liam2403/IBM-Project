
const currentlist = {};

function configSliders () {
    console.log(document.getElementsByClassName(".slider"))
    document.querySelectorAll(".slider").forEach(function (slider) {
        currentlist[slider.id.slice(5)] = slider.getAttribute('data-orig');
        console.log(currentlist);
        slider.addEventListener('mouseup', update);
    })
}

function update (e) {
    const val = e.target.value;
    e.target.classList.add("changed");
    console.log(val);
    const style = 'width: ' + val + '%'
    const num = e.target.id.slice(5);
    console.log(num);
    const prog = document.querySelector('#prog' + num);
    const bar = document.querySelector('#bar' + num);
    bar.setAttribute('aria-valuenow', val);
    prog.setAttribute('style', style);
    if (val == 0) {
        movetolist(num, "notStarted");
    } else if (val == 100) {
        movetolist(num, "completed");
    } else if (currentlist[num] != "inProgress") {
        movetolist(num, "inProgress");
    }
}

function movetolist (num, listID) {
    const list = document.querySelector("#" + listID);
    const card = document.querySelector("#info-" + num);
    list.appendChild(card);
    currentlist[num] = listID;
}

async function LoadData (data) {
    const listPresets = {"notStarted": 0, "completed": 100};
    for (const listType in data) {
        if (data.hasOwnProperty(listType)) {
            const listData = data[listType];
            const listElem = document.querySelector("#" + listType);
            for (const course in listData) {
                if (listData.hasOwnProperty(course)) {
                    let progval;
                    if (listType in listPresets) {
                        progval = listPresets[listType];
                    } else {
                        progval = listData[course];
                    }
                    const key = course;
                    let response = await fetch("http://127.0.0.1:3000/courses/" + key);
                    let body = await response.json();
                    const imgsrc = body.imgsrc;
                    const topic = body.Topic;
                    const title = body.Title;
                    const template = `<div id="info-${key}" class="card h-100 shadow-sm text-decoration-none mb-2">
                    <div>
                        <div id="bar${key}" class="rounded-0 rounded-top progress align-self-center" role="progressbar" aria-valuenow="${progval}" aria-valuemin="0" aria-valuemax="100" style="height: 10px">
                            <div id="prog${key}" class="progress-bar progress-bar-striped" style="width:${progval}%"></div>
                        </div>
                    </div>
                    <a href="http://127.0.0.1:3000/views/course_info.html?id=${key}" class="text-decoration-none row align-items-center card-body pb-2">
                        <div class="col-4 col-lg-12 col-xl-4 text-center">
                            <img src="${imgsrc}" class="thumbnail">
                        </div>
                        <div class="col-8 col-lg-12 col-xl-8">
                            <h6 class="text-emphasis fw-bold my-1">${title}</h6>
                        </div>
                        <small class="text-muted mt-1">${topic}</small>
                    </a>
                    <input id="input${key}" data-orig="${listType}" class="slider mt-1" type="range" min="0" max="100" step="1" value="${progval}" />
                    </div>`
                    listElem.insertAdjacentHTML("beforeend", template);
                }
            }
        }
    }
};

function saveChanges () {
    document.querySelectorAll(".changed").forEach(function (slider) {
        // Retrieve ID from this.id
        // Retrieve original list from data-orig attribute
        // Retrieve current list from currentlist[ID]
        // Delete entry from user/OrigList
        // If currentlist == notStarted, save ID, notStarted, true
        // if currentlist == completed, save ID, completed, true
        // otherwise, currentlist = inProgress
            // Retrieve current value from value attribute
            // save ID, inProgress, value

    })
}

window.addEventListener('load', async function (event) {
    event.preventDefault();
    const username = "johnsmith";
    try {
        let response = await fetch("http://127.0.0.1:3000/userCourses/" + username);
        let body = await response.json();
        LoadData(body)
            .then(() => {
                configSliders();
            })
    } catch (error) {
        console.log(error);
        // Simulate an HTTP redirect:
        window.location.replace("http://127.0.0.1:3000/views/404.html");
    }
});