'use strict';

const express = require('express')
const app = express()
const port = 3000

const { initializeApp } = require ('firebase/app');
const { getDatabase, ref, get, child, remove, update } = require('firebase/database');
const firebaseConfig = {
    apiKey: "AIzaSyB84MzTaUpIFBf1Lc4Gm5nMcvvJjU5vg8s",
    authDomain: "ibm-education-app.firebaseapp.com",
    databaseURL: "https://ibm-education-app-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ibm-education-app",
    storageBucket: "ibm-education-app.appspot.com",
    messagingSenderId: "241018868660",
    appId: "1:241018868660:web:28446bb2812ac94e77d8e1",
    measurementId: "G-QQ7MFLR0TT"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Listen for the courses
const db = getDatabase();

app.use(express.static('public'));
app.use(express.json());

/* Redirect to index when no url specified */
app.get('/', (req, res) => {
    return res.redirect('http://127.0.0.1:3000/views/index.html');
});

/* Get list of all courses */
app.get('/courses', async (req, res) => {
    const coursesRef = ref(db)
    await get(child(coursesRef, "courses"))
        .then((snapshot) => {
            if (snapshot.exists()) {
                res.status(200).json(snapshot.val());
            } else {
                return res.sendStatus(200);
            }
        })
        .catch((err) => {
            console.log(err);
        })
});

/* Get entire database*/
app.get('/all', async (req, res) => {
    const coursesRef = ref(db)
    await get(coursesRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                res.status(200).json(snapshot.val());
            } else {
                return res.sendStatus(200);
            }
        })
        .catch((err) => {
            console.log(err);
        })
});

/* Get individual course*/
app.get('/courses/:id', async (req, res) => {
    const id = req.params.id
    const coursesRef = ref(db)
    await get(child(coursesRef, "courses/" + id))
        .then((snapshot) => {
            if (snapshot.exists()) {
                res.status(200).json(snapshot.val());
            } else {
                return res.sendStatus(404);
            }
        })
        .catch((err) => {
            console.log(err);
        })
});

/* Get course lists of particular user */
app.get('/userCourses/:id', async (req, res) => {
    const id = req.params.id
    const coursesRef = ref(db)
    await get(child(coursesRef, "userCourses/" + id))
        .then((snapshot) => {
            if (snapshot.exists()) {
                res.status(200).json(snapshot.val());
            } else {
                return res.sendStatus(404);
            }
        })
        .catch((err) => {
            console.log(err);
        })
});

/* Delete course from user list */
app.delete('/userCourses/:userId/:listName/:courseId', async (req, res) => {
    const params = req.params;
    const url = ["userCourses", params['userId'], params['listName'], params['courseId']].join("/");
    const coursesRef = ref(db, url)
    remove(coursesRef)
        .then(()=>{
            console.log("Data deleted successfully");
            return res.status(200);
        })
        .catch((error)=>{
            alert(error);
        });
    }
)

/* Add courses to user course without overwriting all */
app.post('/addusercourse/:userId/:listName/', async (req, res) => {
    const params = req.params;
    const url = ["userCourses", params['userId'], params['listName']].join("/");
    const coursesRef = ref(db, url)
    update(coursesRef, req.body)
        .then(()=>{
            console.log("Data added successfully");
            res.status(201);
        })
        .catch((error)=>{
            alert(error);
        });
    }
)

/* Listen for port */
app.listen(port, () => {
    console.log(`Web app listening on port ${port} at http://127.0.0.1:${port}/`);
});