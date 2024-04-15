// Add event listener for DOMContentLoaded to fetch data on page load
document.addEventListener('DOMContentLoaded', fetchData);

const searchInput = document.getElementById('searchBox');
const searchBtn = document.getElementById('searchButton');
const albumsContainer = document.getElementById('albums-container');
const topTracksList = document.getElementById('topTracksList');

// Function to fetch data from the API
async function fetchData(mbid) {
    fetch( "https://corsproxy.io/?" + `https://musicbrainz.org/ws/2/artist/${mbid}/release`,
    {
      method: "GET",
      contentType: "application/json",
    }  
  )
    .then(response => response.json())
      .then(data => {
        
        // Call function to display genres
        displayAlbums(data);
             })

      .catch(error => console.error(error));
  }

 // Function to search artists 
function searchArtists(q) {
    if (q === "" || q === null || q === undefined) {
      return;
    }

    const artistName = searchInput.value;

    fetch(
        "https://corsproxy.io/?" +
        `https://musicbrainz.org/ws/2/artist/?query=${artistName}&fmt=json`,
        { method: "GET", contentType: "application/json" }
      )
        .then((response) => response.json())
        .then(function (data) {
          console.log(data);
          displayAlbums(data.data);
        });
}
 
 // Search functionality
searchBtn.addEventListener("click", function () {
   console.log("search clicked");

   if (searchInput.value == "") return;
   searchArtists(searchInput.value)
  }); 

 // Function to display albums on the page
function displayAlbums(data) {

    // Looping through each album and creating a div item for it
    data.forEach(album => {
      const albumElement = document.createElement('div');
      albumElement.classList.add("album", "item");
      
    // Add image element (adjust 'imageUrl' property name based on your data)
    const albumImage = document.createElement('img');
    albumImage.src = album.imageUrl || 'No Image'; // Set default text if title is missing
    albumElement.appendChild(albumImage);

    // Add title element (adjust 'title' property name based on your data)
    const albumTitle = document.createElement('span');
    albumTitle.textContent = album.title || 'No Title'; // Set default text if title is missing
    albumElement.appendChild(albumTitle);

      // albumElement.addEventListener('click', () => displayAlbums(album));
      albumsContainer.appendChild(albumElement);
    });

    console.log(data);

  }

// Function to display top tracks information on right side of the page
function displayTopTracks(topTracksData) {
  topTracksList.innerHTML = "";

  //Looping through each top track and creating a list item for it
  topTracksData.forEach(topTrack => {

    const topTrackItem = document.createElement("li");

    // Adding classes and text content to list item
    topTrackItem.classList.add("topTrack", "item");
    topTrackItem.textContent = topTrack.title;

    topTrackItem.addEventListener("click", function () {
        displayTopTracks(topTracksData);
    });
  
    // Adding like button to like top tracks
    const likeButton = document.createElement("button");
    likeButton.textContent = "like";
    likeButton.classList.add("like-button");

    // Initial like state
    let isLiked = false;

    likeButton.addEventListener("click", function(event) {
              event.stopPropagation();

              // Update like state and button appearance
              isLiked = !isLiked; // Toggle like state
              likeButton.classList.toggle("liked"); // Apply or remove "liked" class
     });

    // Appending like button to the top track item
    topTrackItem.appendChild(likeButton);

    // Appending list item to top tracks list
    topTracksList.appendChild(topTrackItem);
  });

// console.log(films)

const topTracksData = [...];
displayTopTracks(topTracksData);

}