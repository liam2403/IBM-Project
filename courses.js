// replace this API with actual API
const api = "http://raw.githubusercontent.com/SilverDragon-RY/nothing_here/main/sample";

function constructFunc(course_data) {
    var i = 0;
    var course_list = [];
    var row = [];

    for (let course in course_data) {
        if (i < 4) {
            row.push(course_data[course]);
            i += 1;
        }
        else {
            course_list.push(row);
            row = [course_data[course]];
            i = 0;
        }
    }
    course_list.push(row);
    return course_list;
}

var app = new Vue({
    el: '#content',
    data: {
        all: ["None"],
    }
});

// get all courses and update
var courses_all = fetch(api);
courses_all.then((response) => {
    courses_ALL = response.json();
    courses_ALL.then((data) => {
        app.all = constructFunc(data);
        console.log(data);
    })
})

