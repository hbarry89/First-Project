//search button click calls getImage function
var searchButton = document.getElementById('searchBtn');
searchButton.addEventListener('click', getImage);

//dog fact button calls getFact function
var factButton = document.getElementById('dogFactBtn');
factButton.addEventListener('click', getFact);

//container to store previous searches
var historyContainer = document.getElementById('searchHistory');

//when history buttons is clicked, gets name of button and searches for new image
document.getElementById('searchHistory')
    .addEventListener('click', event => {
        if (event.target.className.split(' ')[0] === 'historyButton') {
            var searchBar = document.getElementById('searchBar');
            var buttonValue = event.target.name;
            searchBar.value = buttonValue;
            searchButton.click();
        }
    })

//fetches image url from API and creates image element
function getImage() {
    var userInput = document.getElementById('searchBar').value;
    var requestUrl = 'https://dog.ceo/api/breed/' + userInput + '/images/random';
    var imageContainer = document.getElementById('image-container');
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            imageContainer.textContent = "";
            var dogImageUrl = data.message;
            var img = document.createElement('img');
            img.src = dogImageUrl;
            img.classList.add('imgStyle');
            imageContainer.appendChild(img);
        });

    //gets and adds to search history in local storage
    var searchHistory = JSON.parse(localStorage.getItem("History")) || [];
    searchHistory.push(userInput);
    localStorage.setItem("History", JSON.stringify(searchHistory));

    //removes duplicates from searchHistory array
    var searchHistory = [...new Set(searchHistory)];
    console.log(searchHistory);

    //creates button for each item in searchHistory array
    function renderSearch() {
        historyContainer.innerHTML = "";
        for (var index = 0; index < searchHistory.length; index++) {
            historyContainer.innerHTML += '<button class="historyButton button is-responsive" type="button" name="' + searchHistory[index] + '">' + searchHistory[index] + '</button>';
        }
    }
    renderSearch();
}

//fetches dog fact from API and displays it in fact container
function getFact() {
    var factContainer = document.getElementById("dogFactDisplay");
    var factUrl = 'https://cors-anywhere.herokuapp.com/http://dog-api.kinduff.com/api/facts?number=1'
    fetch(factUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            factContainer.textContent = "";
            var fact = data.facts[0];
            factContainer.append(fact);
        });
}

//creates history buttons when page loads
var searchHistory = JSON.parse(localStorage.getItem("History")) || [];
var uniqueHistory = [...new Set(searchHistory)];
window.onload = function () {
    for (let index = 0; index < uniqueHistory.length; index++) {
        var listItem = document.createElement('button');
        listItem.textContent = uniqueHistory[index];
        listItem.classList.add('historyButton');
        listItem.classList.add("button");
        listItem.classList.add("is-responsive");
        historyContainer.append(listItem);
    }
}

//clears history container and local storage
var clearButton = document.getElementById('clearSearch');
clearButton.addEventListener('click', clearHistory);
function clearHistory() {
    localStorage.clear();
    location.reload();
}