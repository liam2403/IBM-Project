// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getDatabase, ref, onValue, child, push, update } from "firebase/database";

//const database = getDatabase();

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

// Listen for the courses 
const db = getDatabase();
const coursesRef = ref(db, 'courses/');
onValue(coursesRef, (snapshot) => {
  const data = snapshot.val();
  updateStarCount(postElement, data);
});

// Listen for the user courses
const userCoursesRef = ref(db, 'userCourses/' + username);
onValue(userCoursesRef, (snapshot) => {
  const data = snapshot.val();
  updateStarCount(postElement, data);
});

// Listen for points of all users
const allPointsRef = ref(db, 'points/');
onValue(allPointsRef, (snapshot) => {
  const data = snapshot.val();
  updateStarCount(postElement, data);
});

// Listen for the users points
const pointsRef = ref(db, 'points/' + username);
onValue(pointsRef, (snapshot) => {
  const data = snapshot.val();
  updateStarCount(postElement, data);
});

// Update points (might want to use a set for this) 
function updatePoints(username, newPoints) {
  const db = getDatabase();

  // A post entry.
  const postData = {
    username: newPoints
  };

  // Get a key for a new Post.
  const newPostKey = push(child(ref(db), 'posts')).key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  return update(ref(db), updates);
}

// Update user's courses
function writeUserData(userId, name, email, imageUrl) {
  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}

// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('login.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
