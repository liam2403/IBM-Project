import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app)

// Listen for the courses 
const db = getDatabase();

function LoadData() {
    // TO CHANGE: GET ID FROM URL??
    // var pageID = document.querySelectorAll("#pageID")
    var pageID="AI Foundations";
    document.querySelector("#TEST1").innerHTML = pageID;
    console.log("we made it folks")

    const dbref = ref(db);

    get(child(dbref, "courses/" + pageID))
    .then((snapshot)=>{
        if (snapshot.exists()) {

            // create variables for html elements where info will be displayed
            var breadcrumbTitle = document.querySelector("#TEST2");

            // show elems in html
            breadcrumbTitle.innerHTML = snapshot.val().Title;
        }
    })
    .catch((error)=> {
        alert(error);
    })
}

// Do on page load
document.addEventListener('DOMContentLoaded', function() {
    LoadData();
});