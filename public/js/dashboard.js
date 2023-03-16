// Progress slider
const currentlist = {};
document.querySelectorAll(".slider").forEach(function (slider) {
    currentlist[slider.id.slice(5)] = slider.getAttribute('data-orig');
    slider.addEventListener('mouseup', update);
})

// Updates the list the course goes into depending on the progress
function update (e) {
    const val = e.target.value;
    const style = 'width: ' + val + '%'
    const num = e.target.id.slice(5);
    console.log(num);
    const prog = document.querySelector('#prog' + num);
    const bar = document.querySelector('#bar' + num);
    bar.setAttribute('aria-valuenow', val);
    prog.setAttribute('style', style);
    if (val == 0) {
        movetolist(num, "list-0");
    } else if (val == 100) {
        movetolist(num, "list-2");
    } else if (currentlist[num] != "list-1") {
        movetolist(num, "list-1");
    }
}

// Moves the course pannel 
function movetolist (num, listID) {
    const list = document.querySelector("#" + listID);
    const card = document.querySelector("#info-" + num);
    list.appendChild(card);
    currentlist[num] = listID;
}
