const apiKey = "5769c893"; // This is the OMDb API Key.
const baseApiUrl = `http://www.omdbapi.com/?apikey=${apiKey}`; // This is the base URL for OMDb API.
const crudApiUrl = "https://crudcrud.com/api/27d8e498a0f144a0a7f9a79d01952ce1"; // This is the base URL for CRUD CRUD API.

// Elements - Querying DOM elements for further use
const movieDetailsElement = document.querySelector("#movie-details");
const saveFavoriteButton = document.querySelector("#save-favorite");

let selectedMovieId = localStorage.getItem("selectedMovieId"); // Get the selected movie ID from localStorage.

if (selectedMovieId) {
  fetchMovieDetails(selectedMovieId).then((movie) => {
    displayMovieDetails(movie); // Fetch and display the movie details.
  });
}

// Function to fetch movie details by movie ID from OMDb API.
async function fetchMovieDetails(movieId) {
  const response = await fetch(`${baseApiUrl}&i=${movieId}`);
  return await response.json();
}

// Function to display movie details on the details page.
function displayMovieDetails(movie) {
  if (movieDetailsElement) {
    movieDetailsElement.innerHTML = `
      <h2>${movie.Title}</h2>
      <img src="${movie.Poster}" alt="${movie.Title}">
      <p>${movie.Plot}</p>
      <p><strong>Director:</strong> ${movie.Director}</p>
      <p><strong>Actors:</strong> ${movie.Actors}</p>
      <p><strong>Year:</strong> ${movie.Year}</p>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Rating:</strong> ${movie.imdbRating}</p>
    `; // Display movie details in the "DOM" (The Document Object Model).
  }
}

// This is an event listener to handle saving the movie to favorites.
saveFavoriteButton.addEventListener("click", () => {
  const movieId = selectedMovieId;
  if (movieId) {
    saveToFavorites(movieId); // Save the movie to "favorites".
  }
});

// Function to save a movie to the favorites list.
async function saveToFavorites(movieId) {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return;

  const favorites =
    JSON.parse(localStorage.getItem(`favorites-${currentUser}`)) || [];
  if (!favorites.includes(movieId)) {
    favorites.push(movieId);
    localStorage.setItem(`favorites-${currentUser}`, JSON.stringify(favorites)); // Update localStorage.

    // Save to CRUD CRUD API
    const response = await fetch(`${crudApiUrl}/favorites-${currentUser}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieId }), // Sends favorite movie data to CRUD API.
    });

    if (response.ok) {
      alert("Movie saved to favorites!");
      window.location.href = "favorites.html"; // Redirects to the favorites page.
    } else {
      console.error("Failed to save favorite movie");
    }
  }
}
