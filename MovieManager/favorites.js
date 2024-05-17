const apiKey = "5769c893"; // This is the OMDb API Key.
const baseApiUrl = `http://www.omdbapi.com/?apikey=${apiKey}`; // This is the base URL for OMDb API.
const crudApiUrl = "https://crudcrud.com/api/27d8e498a0f144a0a7f9a79d01952ce1"; // This is the base URL for CRUD CRUD API.

// Elements - Querying DOM elements for further use.
const favoritesList = document.querySelector("#favorites-list");

const currentUser = localStorage.getItem("currentUser"); // Get the current user from localStorage.
if (currentUser) {
  loadFavorites(); // Loads favorites if the user is logged in.
}

// Function to load the favorite movies for the "current user".
async function loadFavorites() {
  const response = await fetch(`${crudApiUrl}/favorites-${currentUser}`); // Fetch "favorite movies" from "CRUD API".
  const data = await response.json();
  displayFavorites(data); // Display the fetched favorite movies.
}

// Function to display favorite movies in the favorites list.
function displayFavorites(favorites) {
  favoritesList.innerHTML = ""; // This clears the current list.
  const uniqueFavorites = Array.from(
    new Set(favorites.map((item) => item.movieId))
  ); // This is to get unique favorite movie IDs.
  uniqueFavorites.forEach((movieId) => {
    fetchMovieDetails(movieId).then((details) => {
      const li = document.createElement("li");
      li.classList.add("movie-item");
      li.innerHTML = `
        <img src="${details.Poster}" alt="${details.Title}">
        <span>${details.Title} (${details.Year})</span>
        <button class="remove-favorite" data-id="${movieId}">Remove</button>
      `;
      favoritesList.appendChild(li); // Adds the movie to the list.
    });
  });

  // This is an event listener to handle removing favorite movies.
  favoritesList.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-favorite")) {
      const movieId = e.target.getAttribute("data-id");
      removeFavorite(movieId); // Removes the movie from "favorites".
    }
  });
}

// Function to fetch the movie details by movie ID from OMDb API.
async function fetchMovieDetails(movieId) {
  const response = await fetch(`${baseApiUrl}&i=${movieId}`);
  return await response.json();
}

// Function to remove a favorite movie
async function removeFavorite(movieId) {
  const favorites =
    JSON.parse(localStorage.getItem(`favorites-${currentUser}`)) || [];
  const updatedFavorites = favorites.filter((id) => id !== movieId);
  localStorage.setItem(
    `favorites-${currentUser}`,
    JSON.stringify(updatedFavorites)
  ); // Update localStorage

  // Fetch the favorite items from CRUD API to get the ID to delete.
  const response = await fetch(`${crudApiUrl}/favorites-${currentUser}`);
  const data = await response.json();
  const favoriteItem = data.find((item) => item.movieId === movieId);

  if (favoriteItem) {
    await fetch(`${crudApiUrl}/favorites-${currentUser}/${favoriteItem._id}`, {
      method: "DELETE",
    });

    loadFavorites(); // This reloads the favorites list after removal.
  } else {
    console.error("Failed to remove favorite movie");
  }
}
