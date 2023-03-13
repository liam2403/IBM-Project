// Retrieve info key-values from db entry and display text on page
function ShowInfoText (s) {
    // Get all elems to display items
    const infoElems = document.querySelectorAll(".info-text");
    infoElems.forEach((elem) => {
        const dataKey = elem.getAttribute("data-key");
        if (dataKey in s) {
            elem.innerHTML = s[dataKey];
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
        if (dataKey in s) {
            elem.setAttribute("href", s[dataKey]);
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
    // Get key-value pair
    const [key, value] = section;

    // Append section title to nav element
    const navElem = document.createElement("a");
    navElem.setAttribute("href", "#" + elemID);
    navElem.classList.add("nav-link");
    navElem.innerHTML = key;
    navList.appendChild(navElem);

    // Append section content to div element
    const divElem = document.createElement("div");
    divElem.setAttribute("id", elemID);
    const divHeading = document.createElement("h4");
    divHeading.innerHTML = key; // title
    const divPara = document.createElement("p");
    divPara.innerHTML = value.replace(/\n/g, "<br>"); // content (replaces \n with newlines)
    divElem.appendChild(divHeading);
    divElem.appendChild(divPara);
    divList.appendChild(divElem);
};

// Main function: Load details from database onto webpage
function LoadData (body) {
    document.title = body["Title"];
    // Load general text/links from db entry
    ShowInfoText(body);
    ShowInfoLinks(body);
    // Display rating from db entry
    if ("Rating" in body) {
        ShowRating(body["Rating"])
    } else {
        document.querySelector("#info-rating").innerHTML = "No ratings";
    }
    // Display badge from db entry
    if ("Badge" in body) {
        document.querySelector("#info-badge").innerHTML = "IBM Credly Badge";
    } else {
        document.querySelector("#info-badge").innerHTML = "No badge";
    }
    // Display longer content from db entry
    if ("Content" in body) {
        let counter = 0;
        const [navList, divList] = createLongElems();
        Object.entries(body["Content"]).forEach((section) => {
            ShowLongContent(section, counter, navList, divList);
            counter++;
        });
        document.querySelector("#long-content-nav").appendChild(navList);
        document.querySelector("#long-content-div").appendChild(divList);
        // refresh the scrollspy
        const dataSpyEl = document.querySelector('#long-content-div');
        bootstrap.ScrollSpy.getOrCreateInstance(dataSpyEl).refresh();
        // const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
        // console.log(dropdownElementList)
        // const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl));
    } else {
        document.querySelector("#bottom-section").remove();
    }
};

window.addEventListener('load', async function (event) {
    event.preventDefault();
    const params = new URLSearchParams(document.location.search);
    const pageID = params.get("id");
    try {
        let response = await fetch("http://127.0.0.1:3000/courses/" + pageID);
        let body = await response.json();
        LoadData(body);
    } catch (error) {
        // Simulate an HTTP redirect:
        window.location.replace("http://127.0.0.1:3000/views/404.html");
    }
});