import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

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
const analytics = getAnalytics(app);

// Listen for the courses
const db = getDatabase();

// Retrieve info key-values from db entry and display text on page
function ShowInfoText (s) {
    // Get all elems to display items
    const infoElems = document.querySelectorAll(".info-text");
    infoElems.forEach((elem) => {
        const dataKey = elem.getAttribute("data-key");
        if (s.child(dataKey).exists()) {
            elem.innerHTML = s.val()[dataKey];
        } else {
            elem.innerHTML = "Unknown";
        };
    });
};

// Retrieve link key-values from db entry and change href values on page
function ShowInfoLinks (s) {
    // Get all elems to display items
    const infoElems = document.querySelectorAll(".info-link");
    infoElems.forEach((elem) => {
        const dataKey = elem.getAttribute("data-key");
        if (s.child(dataKey).exists()) {
            elem.setAttribute("href", s.val()[dataKey]);
        } else {
            elem.innerHTML = "Unknown";
        };
    });
};

// Display stars in rating field
function ShowRating (rating) {
    // Calculate number of each type of star icon to display
    const starMap = new Map();
    let temp1 = Math.floor(rating / 1);
    let temp2 = 5 - temp1;
    starMap.set("<i class='fa-solid fa-star'></i>", temp1);
    temp1 = (rating % 1) ? 1 : 0;
    temp2 -= temp1;
    starMap.set("<i class='fa-regular fa-star-half-stroke'></i>", temp1);
    starMap.set("<i class='fa-regular fa-star'></i>", temp2);
    // Join to create required inner HTML
    let html = "";
    for (const [key, value] of starMap) {
        for (let i = 0; i < value; i++) {
            html += key;
        };
    };
    html = [html.slice(0, -6), " me-2", html.slice(-6)].join("");
    html = [html, rating].join("");
    // Change inner HTML on page
    document.querySelector("#info-rating").innerHTML = html;
};

function setAttributes (elem, options) {
    Object.keys(options).forEach((attr) => {
        elem.setAttribute(attr, options[attr]);
    });
}

function createLongElems () {
    const navList = document.createElement("nav");
    setAttributes(navList, {
        class: "nav nav-pills h-100 flex-column align-items-stretch pe-4 border-end",
        role: "tablist"
    });
    const divList = document.createElement("div");
    setAttributes(divList, {
        class: "scrollbar-container",
        "data-bs-spy": "scroll",
        "data-bs-target": "#long-content-nav",
        "data-bs-smooth-scroll": "true",
        tabindex: "0"
    });
    return [navList, divList];
};

// Load longer content onto webpage
function ShowLongContent (section, counter, navList, divList) {
    // Get current item number (for scrollspy to work)
    const elemID = "item-" + counter;

    // Append section title to nav element
    const navElem = document.createElement("a");
    navElem.setAttribute("href", "#" + elemID);
    navElem.classList.add("nav-link");
    navElem.innerHTML = section.key;
    navList.appendChild(navElem);

    // Append section content to div element
    const divElem = document.createElement("div");
    divElem.setAttribute("id", elemID);
    const divHeading = document.createElement("h4");
    divHeading.innerHTML = section.key; // title
    const divPara = document.createElement("p");
    divPara.innerHTML = section.val().replace("\n", "<br>"); // content (replaces \n with newlines)
    divElem.appendChild(divHeading);
    divElem.appendChild(divPara);
    divList.appendChild(divElem);
};

// Main function: Load details from database onto webpage
function LoadData () {
    // Return ID parameter from URL
    const params = new URLSearchParams(document.location.search);
    const pageID = params.get("id");

    // Check if ID exists in database before loading details
    const dbref = ref(db);
    get(child(dbref, "courses/" + pageID))
        .then((snapshot) => {
            if (snapshot.exists()) {
                document.title = snapshot.val().Title;
                // Load general text/links from db entry
                ShowInfoText(snapshot);
                ShowInfoLinks(snapshot);
                // Display rating from db entry
                if (snapshot.child("Rating").exists()) {
                    ShowRating(snapshot.val().Rating);
                } else {
                    document.querySelector("#info-rating").innerHTML = "No ratings";
                }
                // Display badge from db entry
                if (snapshot.child("Badge").exists()) {
                    document.querySelector("#info-badge").innerHTML = "IBM Credly Badge";
                } else {
                    document.querySelector("#info-badge").innerHTML = "No badge";
                }
                // Display longer content from db entry
                if (snapshot.child("Content").exists()) {
                    let counter = 0;
                    const [navList, divList] = createLongElems();
                    snapshot.child("Content").forEach((section) => {
                        ShowLongContent(section, counter, navList, divList);
                        counter++;
                    });
                    document.querySelector("#long-content-nav").appendChild(navList);
                    document.querySelector("#long-content-div").appendChild(divList);
                } else {
                    document.querySelector("#bottom-section").remove();
                }
            } else {
                console.log("Course does not exist.");
            }
        })
        .catch((error) => {
            alert(error);
        });
};

// Do on page load
document.addEventListener("DOMContentLoaded", function () {
    LoadData();
});
