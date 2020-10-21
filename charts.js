
const LASTFM_BASE_URL = ' http://ws.audioscrobbler.com/2.0/';

const LASTFM_API_KEY = '';

let pages = 1;

const getTopArtists = async(e) => {
    try {
        let artistArray = [];
        for (let index = 1; index <= pages; index++) {
            let response = await axios.get(`${LASTFM_BASE_URL}?method=chart.gettopartists&page=${index}&api_key=${LASTFM_API_KEY}&format=json`);
            artistArray = [...artistArray, ...response.data.artists.artist];
        }
        artistArray = removeDuplicates(artistArray);
        clearMainScreen();
        showListDiv = document.querySelector('.list');
        addSelectButton(['Sort By','Sort By Playcount', 'Sort By Listeners'], showListDiv).addEventListener('change',function(e){getTopArtists(e);});
        if (e.target.value === '2') {
            addTopArtistsToDiv(artistArray.sort(function (a, b) {
                return b.listeners - a.listeners;}), showListDiv, 'listeners');
        } else {
            addTopArtistsToDiv(artistArray.sort(function (a, b) {
                return b.playcount - a.playcount;}), showListDiv,'playcount');
        }
        showMoreButton(showListDiv).addEventListener('click', function(){pages++; getTopArtists(e)})
    } catch (err) {
        console.log(err);
        clearMainScreen();
        displayError(err);
    };
};

const getTopTags = async(e) => {
    try {
        let response = await axios.get(`${LASTFM_BASE_URL}?method=chart.gettoptags&page=1&api_key=${LASTFM_API_KEY}&format=json`);
        let tagArray = response.data.tags.tag;
        clearMainScreen();
        showListDiv = document.querySelector('.list');
        addSelectButton(['Sort By','Sort By Taggings','Sort By Reach'], showListDiv).addEventListener('change', 
            function(e){getTopTags(e)});
        if (e.target.value === '2') {
            addTopTagsToDiv(tagArray.sort(function (a, b) {return b.reach - a.reach;}), showListDiv, 'reach')
        } else {
            addTopTagsToDiv(tagArray.sort(function (a, b) {return b.taggings - a.taggings;}), showListDiv, 'taggings')
        }
    } catch (err) {
        console.log(err);
        clearMainScreen();
        displayError(err);
    }
}

const getTopTracks = async(e) => {
    try {
        let tracksArray = [];
        for (let index = 1; index <= pages; index++) {
            let response = await axios.get(`${LASTFM_BASE_URL}?method=chart.gettoptracks&page=${index}&api_key=${LASTFM_API_KEY}&format=json`);
            tracksArray = [...tracksArray, ...response.data.tracks.track]
        }
        tracksArray = removeDuplicates(tracksArray);
        clearMainScreen();
        showListDiv = document.querySelector('.list');
        addSelectButton(['Sort By', 'Sort By Playcount', 'Sort By Listeners'], showListDiv).addEventListener('change',
        function(e){getTopTracks(e)});
        if (e.target.value === '2') {
            addTopTracksToDiv(tracksArray.sort(function (a, b) {return b.listeners - a.listeners;}), showListDiv,'listeners');
        } else {
            addTopTracksToDiv(tracksArray.sort(function (a, b) {return b.playcount - a.playcount;}), showListDiv,'playcount');
        }
        showMoreButton(showListDiv).addEventListener('click', function(){pages++; getTopTracks(e)})
    } catch (err) {
        console.log(err);
        clearMainScreen();
        displayError(err);
    }
}
function addTopArtistsToDiv(arrayOfArtists, theDivAddedTo, sortBy) {
    counter = 1;
    for (item of arrayOfArtists){
        let newItem = document.createElement('div');
        let number = document.createElement('p');
        let stats = document.createElement('p');
        let name = document.createElement('p');

        newItem.classList.add('rank');
        number.classList.add('num');
        stats.classList.add('stats');
        name.classList.add('artist');
        
        number.innerText = `${counter}`;
        if (sortBy === 'playcount') {
            stats.innerHTML = `Playcount: ${formatNumToCommas(item.playcount)} <br/> Listeners: ${formatNumToCommas(item .listeners)}`; 
        } else {
            stats.innerHTML = `Listeners: ${formatNumToCommas(item .listeners)} <br/> Playcount: ${formatNumToCommas(item.playcount)}`; 
        }
        name.innerHTML = item.name;

        newItem.appendChild(number);
        newItem.appendChild(name);
        newItem.appendChild(stats);
        theDivAddedTo.appendChild(newItem);

        counter++
    }
}

function addTopTagsToDiv (arrayOfTags, theDivToAddTo, sortBy) {
    for (let index = 0; index < arrayOfTags.length; index++) {
        let newItem = document.createElement('div');
        let number = document.createElement('p');
        let stats = document.createElement('p');
        let name = document.createElement('p');

        newItem.classList.add('rank');
        number.classList.add('num');
        stats.classList.add('stats');
        name.classList.add('name');

        number.innerText = `${index + 1}`;
        if (sortBy === 'taggings') {
            stats.innerHTML = `Taggings: ${formatNumToCommas(arrayOfTags[index].taggings)} <br/> Reach: ${formatNumToCommas(arrayOfTags[index].reach)}`; 
        } else {
            stats.innerHTML = `Reach: ${formatNumToCommas(arrayOfTags[index].reach)} <br/> Taggings: ${formatNumToCommas(arrayOfTags[index].taggings)}`; 
        }

        name.innerHTML = capitalize(arrayOfTags[index].name);

        newItem.appendChild(number);
        newItem.appendChild(name);
        newItem.appendChild(stats);
        theDivToAddTo.appendChild(newItem);
    }
}

function addTopTracksToDiv (arrayOfTracks, theDivToAddTo, sortBy) {
    for (let index = 0; index < arrayOfTracks.length; index++) {
        let newItem = document.createElement('div');
        let number = document.createElement('p');
        let stats = document.createElement('p');
        let name = document.createElement('p');
        let artist = document.createElement('p');

        newItem.classList.add('rank');
        number.classList.add('num');
        stats.classList.add('stats');
        name.classList.add('name');
        artist.classList.add('artist');

        number.innerText = `${index + 1}`;
        if (sortBy === 'playcount') {
            stats.innerHTML = `Playcount: ${formatNumToCommas(arrayOfTracks[index].playcount)} <br/> Listeners: ${formatNumToCommas(arrayOfTracks[index].listeners)}`; 
        } else {
            stats.innerHTML = `Listeners: ${formatNumToCommas(arrayOfTracks[index].listeners)} <br/> Playcount: ${formatNumToCommas(arrayOfTracks[index].playcount)}`; 
        }
        name.innerHTML = arrayOfTracks[index].name;
        artist.innerText = arrayOfTracks[index].artist.name;

        newItem.appendChild(number);
        newItem.appendChild(name);
        newItem.appendChild(artist);
        newItem.appendChild(stats);
        theDivToAddTo.appendChild(newItem);
    }
}

function displayError(err) {
    let message = document.createElement('p');
    message.innerText = `Oh No! We have a ${err.name}. Check your connection.`
    
    document.querySelector('.list').appendChild(message);
}

function clearMainScreen() {
    let mainDiv = document.querySelector('.list');
    while (mainDiv.firstChild) {
        mainDiv.removeChild(mainDiv.firstChild);
    }
}

function showMoreButton (divToAddButton){
    let showButton = document.createElement('button');
    showButton.innerText = 'Show More';
    divToAddButton.appendChild(showButton);
    return showButton
}

//returns that select button element
function addSelectButton(optionsArray, tag) {
    let select = document.createElement('select');
    for (let index = 0; index < optionsArray.length; index++) {
        let newOption = document.createElement('option');
        newOption.innerText = `${optionsArray[index]}`;
        newOption.value = index;
        select.appendChild(newOption);
    }
    tag.appendChild(select);
    return select
}

// https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript
function removeDuplicates(array){
    return array.filter((v,i,a)=>a.findIndex(t=>(JSON.stringify(t) === JSON.stringify(v)))===i)
}

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function formatNumToCommas (int) {
    return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// https://stackoverflow.com/questions/2332811/capitalize-words-in-string
const capitalize = (str, lower = false) => {
  return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
}


document.querySelector('#topArtists').addEventListener('click', function(e){pages=1; getTopArtists(e)});
document.querySelector('#topTags').addEventListener('click', getTopTags);
document.querySelector('#topTracks').addEventListener('click', function(e){pages=1;getTopTracks(e)});
