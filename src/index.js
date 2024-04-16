// Add event listener for DOMContentLoaded to fetch data on page load
document.addEventListener('DOMContentLoaded', fetchGenres);

const searchInput = document.getElementById('searchBox');
const searchBtn = document.getElementById('searchButton');
const albumsContainer = document.getElementById('albums-container');

// Function to fetch genre data from the API
async function fetchGenres() {
    const url = "https://binaryjazz.us/wp-json/genrenator/v1/genre/10/";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const genres = await response.json();
        displayGenres(genres);
    } catch (error) {
        console.error("Failed to fetch genres:", error);
        document.getElementById('genre-section').innerHTML = 'Failed to load genres.';
    }
}

// function to display genres
function displayGenres(genres) {
    const container = document.getElementById('genre-section');
    container.innerHTML = ''; // Clear previous content

    const list = document.createElement('ul');
    genres.forEach(genre => {
        const item = document.createElement('li');
        item.className = 'genre-item'; // adding a class for styling purposes
        item.textContent = genre;

        // Create like button for each genre item
        const likeButton = document.createElement('button');
        likeButton.textContent = 'Like';
        likeButton.classList.add('like-btn');

        // initial like state
        let isLiked = false;

        likeButton.addEventListener('click', function (event) {
          console.log("Like button clicked");  
          event.stopPropagation();

            // Update like state and button appearance
            isLiked = !isLiked; // toggle like state
            likeButton.classList.toggle('liked'); // apply or remove "liked" class
            likeButton.textContent = isLiked ? 'Liked' : 'Like'; // update button text based on like state
        });

        // Append like button and genre item to list
        item.appendChild(likeButton);
        list.appendChild(item);
    });

    container.appendChild(list);
}

// Function to search songs
async function searchSongs(q) {
    if (!q) {
        alert("Please enter a song name to search."); // Display alert message
        return;
    }

    const songName = searchInput.value.trim();

    fetch(
        "https://saavn.dev/api/search/songs?query=" + songName,
        { method: "GET", contentType: "application/json" }
    )
    .then(response => response.json())
    .then(function (data) {
        console.log("Fetched Search Results:", data); // Log search results to console
        displaySongs(data);
    });

    document.getElementById('searchButton').addEventListener('click', function() {
        this.style.backgroundColor = '#ff4500';  // Changes to red when clicked
        this.style.color = '#ffffff';            // Text color set to white
    });
    
}

// Function to display songs and details
function displaySongs(data) {
    if (!data || !data.results || !Array.isArray(data.results)) {
        console.error("Invalid data:", data);
        return; // Exit if no data or data not structured as expected
    }

    const songList = document.createElement('ul');
    songList.classList.add('songs-list');
    albumsContainer.innerHTML = '';

    data.results.forEach(song => {
        const songItem = document.createElement('li');
        songItem.classList.add('song-item');
        songItem.dataset.songId = song.id;

        // Add song title and artist to list item
        songItem.innerHTML = `<b>${song.name}</b> - ${song.artists.primary[0].name}`;

        // Add click event listener to display song details
        songItem.addEventListener('click', () => showSongDetails(song));

        // Append song item to song list
        songList.appendChild(songItem);
    });

    albumsContainer.appendChild(songList);
}

// Function to show song details
function showSongDetails(song) {
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('song-details');
    detailsContainer.innerHTML = `
        <h2>${song.name}</h2>
        <p><b>Artist:</b> ${song.artists.primary[0].name}</p>
        <p><b>Year:</b> ${song.year}</p>
        <p><b>Duration:</b> ${song.duration} seconds</p>
        <p><b>Label:</b> ${song.label}</p>
    `;
    albumsContainer.appendChild(detailsContainer);
}

// Search functionality
searchBtn.addEventListener("click", () => {
    if (searchInput.value.trim() === "") {
        alert("Please enter some text to search.");
        return;
    }
    searchSongs(searchInput.value.trim());
});
