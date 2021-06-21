const body = document.querySelector("body");
const night = document.querySelectorAll("button.btn");

function testFunction() {
}

function chageInnerText(element) {
    if (element.innerText === "Night") {
        element.innerText = "Day";
    } else {
        element.innerText = "Night";
    }
}

function addClassNight() {
    body.classList.toggle("night");
    night.forEach(element => chageInnerText(element))
}

night.forEach(element => element.addEventListener("click", addClassNight))


function callNavList(file) {
    fetch(file).then(function (response) {
        response.text().then(function (text) {
            document.querySelector('article').innerHTML = text;

        })
    })
}

if (location.hash) {
    callNavList(location.hash.substring(2));
} else {
    callNavList('welcome');
}

fetch('list').then(function (response) {
    response.text().then(function (text) {
        const list = text.split(',');
        const nav = document.querySelector('.nav ol');
        for (i = 0; i < list.length; i++) {
            let li = `<li><a href="#!${list[i]}" onclick="callNavList('${list[i]}')">${list[i]}</a></li>`
            nav.innerHTML = nav.innerHTML + li;
        }
    })
})