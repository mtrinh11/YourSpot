
const LASTFM_BASE_URL = ' http://ws.audioscrobbler.com/2.0/';

const LASTFM_API_KEY = '';
const LASTFM_SECRET = '';

//add a show more button?
const getTopArtists = async() => {
    try {
        let response = await axios.get(`${LASTFM_BASE_URL}?method=chart.gettopartists&page=1&api_key=${LASTFM_API_KEY}&format=json`);
        // let selectButton = 
        // console.log(response)
        //add sort by playcount or listiners button?
        let artistArray = response.data.artists.artist;
        clearMainScreen();
        addArtistsToDiv(artistArray.sort(function (a, b) {
            return b.playcount - a.playcount;
          }), document.querySelector('.list'))
    } catch (err) {
        console.log(err);
    };
};

const getTopTags = async() => {
    try {
        let response = await axios.get(`${LASTFM_BASE_URL}?method=chart.gettoptags&page=1&api_key=${LASTFM_API_KEY}&format=json`);
        let tagArray = response.data.tags.tag
        clearMainScreen();
        // console.log(tagArray)
    } catch (err) {
        console.log(err);
    }
}

const getTopTracks = async() => {
    try {
        let response = await axios.get(`${LASTFM_BASE_URL}?method=chart.gettoptracks&page=1&api_key=${LASTFM_API_KEY}&format=json`);
        let tracksArray = response.data.tracks.track;
        clearMainScreen();
        console.log(tracksArray)
    } catch (err) {
        console.log(err);
    }
}
function addArtistsToDiv(arrayOfArtists, theDivAddedTo) {
    counter = 1;
    for (item of arrayOfArtists){
        let newItem = document.createElement('div');
        let number = document.createElement('p');
        let stats = document.createElement('p');
        let name = document.createElement('p');

        newItem.classList.add('artist');
        number.classList.add('num');
        stats.classList.add('stats');
        
        number.innerText = `${counter}`;
        stats.innerHTML = `Playcount: ${formatNumToCommas(item.playcount)} <br/> Listeners: ${formatNumToCommas( item .listeners)}`; 
        name.innerHTML = item.name

        newItem.appendChild(number);
        newItem.appendChild(stats);
        newItem.appendChild(name);
        theDivAddedTo.appendChild(newItem);

        counter++
    }
}

function formatNumToCommas (int) {
    return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function clearMainScreen() {
    let mainDiv = document.querySelector('.list');
    while (mainDiv.firstChild) {
        mainDiv.removeChild(mainDiv.firstChild);
    }
}

document.querySelector('#topArtists').addEventListener('click', getTopArtists);
document.querySelector('#topTags').addEventListener('click', getTopTags);
document.querySelector('#topTracks').addEventListener('click', getTopTracks);
