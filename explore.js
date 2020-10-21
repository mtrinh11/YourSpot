
const LASTFM_BASE_URL = ' http://ws.audioscrobbler.com/2.0/';

const LASTFM_API_KEY = '';

const searchArtistsPopUp = () => {
    showListDiv = document.querySelector('.list');
    clearMainScreen();
    searchFieldforArtists(showListDiv, 'Search for Artists Related to...').addEventListener('keypress', function(e){getSimilarArtists(e)});
}

const searchFieldforArtists = (div, placeholderText) => {
    let newDiv = document.createElement('div');
    let searchField = document.createElement('input');

    searchField.type = 'search';
    searchField.placeholder = placeholderText;
    searchField.style.width = '300px';
    searchField.style.margin = '10px';

    newDiv.appendChild(searchField);
    div.appendChild(newDiv);
    return searchField;
}

const getSimilarArtists = async(e) => {
    if (e.key === 'Enter'){
        try {
            let artist = e.target.value.trim();
            let response = await axios.get(`${LASTFM_BASE_URL}?method=artist.getsimilar&artist=${artist}&api_key=${LASTFM_API_KEY}&format=json`);
            console.log(response);
            let resultsArray = response.data.similarartists.artist;
            displayArtistResults(resultsArray);
        } catch (err) {
            //have to address if no results are return aka artist is undefined
            console.log(err)
            displayError(err)
        }
    }
}

const displayArtistResults = (arr) => {
    for (let artist of arr) {
        //have Text that says Search Results For:....
        let newDiv = document.createElement('div');
        let name = document.createElement('p');

        name.innerText = `${artist.name}`;

        newDiv.appendChild(name);
        document.querySelector('.list').appendChild(newDiv);
    }
}

const searchTracksPopUp = async() => {
    showListDiv = document.querySelector('.list');
    clearMainScreen();
    searchFieldForTracks();
}

const searchFieldForTracks = () => {
    let newDiv = document.createElement('div');
    let titleField = document.createElement('input');
    let artistField = document.createElement('input');
    let submit = document.createElement('button');

    titleField.type = 'search';
    titleField.placeholder = `What's the name of the song?`;
    titleField.style.width = '240px';
    titleField.style.margin = '10px';
    titleField.id = 'trackTitle';
    artistField.type = 'search';
    artistField.placeholder = `Who's the song by?`;
    artistField.style.margin = '10px';
    artistField.id = 'trackByArtist';
    submit.innerText = 'Search';
    submit.addEventListener('click', getSimilarTracks);
    submit.style.margin = '10px';

    newDiv.appendChild(titleField);
    newDiv.appendChild(artistField);
    newDiv.appendChild(submit);
    document.querySelector('.list').appendChild(newDiv);
    return newDiv;
}

const displayTrackResults = (arr) => {
    for (let item of arr) {
        let newDiv = document.createElement('div');
        let songName = document.createElement('p');
        let artist = document.createElement('p');
        let ranking = document.createElement('p');

        newDiv.classList.add('rank');
        songName.innerText = `${item.name}`;
        artist.innerText = `${item.artist.name}`;
        ranking.innerText =`${item.match * 100}%`;

        newDiv.appendChild(songName);
        newDiv.appendChild(artist);
        newDiv.appendChild(ranking);
        document.querySelector('.list').appendChild(newDiv);
    };
}

const getSimilarTracks = async() => {
    try {
        let track = document.querySelector('#trackTitle').value.trim();
        let artist = document.querySelector('#trackByArtist').value.trim();
        let response = await axios.get(`${LASTFM_BASE_URL}?method=track.getsimilar&artist=${artist}&track=${track}&api_key=${LASTFM_API_KEY}&format=json`);
        console.log(response);
        let resultsArray = response.data.similartracks.track;
        console.log(resultsArray)
        displayTrackResults(resultsArray);
    } catch (err) {
        displayError(err)
        console.log(err)
    }
}

function displayError(err) {
    let message = document.createElement('p');
    message.innerText = `Oh No! We have a ${err.name}. Check the spelling of your search.`
    
    document.querySelector('.list').appendChild(message);
}

function clearMainScreen() {
    let mainDiv = document.querySelector('.list');
    while (mainDiv.firstChild) {
        mainDiv.removeChild(mainDiv.firstChild);
    }
}

function clearMainScreenExeceptFirstNChildren(n) {
    let mainDiv = document.querySelector('.list');
    while (mainDiv.children.length > n) {
        mainDiv.removeChild(mainDiv.lastChild);
    }
}

document.querySelector('#similarArtists').addEventListener('click', function(){searchArtistsPopUp();});
document.querySelector('#similarTrack').addEventListener('click', function(){searchTracksPopUp();});
