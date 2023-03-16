'use strict';

// Setting up the server
const express = require('express')
const app = express()
const port = 3000

// Firebase SDK import code
const { initializeApp } = require ('firebase/app');
const { getDatabase, ref, get, child } = require('firebase/database');
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

// Set up the server
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    return res.redirect('http://127.0.0.1:3000/views/index.html');
});

// GET courses
app.get('/courses', async (req, res) => {
    const coursesRef = ref(db)
    await get(child(coursesRef, "courses"))
        .then((snapshot) => {
            if (snapshot.exists()) {
                res.status(200).json(snapshot.val());
            } else {
                return res.sendStatus(400);
            }
        })
        .catch((err) => {
            console.log(err);
        })
});

// GET CourseRef
app.get('/all', async (req, res) => {
    const coursesRef = ref(db)
    await get(coursesRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                res.status(200).json(snapshot.val());
            } else {
                return res.sendStatus(400);
            }
        })
        .catch((err) => {
            console.log(err);
        })
});

// GET course ID
app.get('/courses/:id', async (req, res) => {
    const id = req.params.id
    const coursesRef = ref(db)
    await get(child(coursesRef, "courses/" + id))
        .then((snapshot) => {
            if (snapshot.exists()) {
                res.status(200).json(snapshot.val());
            } else {
                return res.sendStatus(400);
            }
        })
        .catch((err) => {
            console.log(err);
        })
});

// Deploy server
app.listen(port, () => {
    console.log(`Web app listening on port ${port}`);
});
