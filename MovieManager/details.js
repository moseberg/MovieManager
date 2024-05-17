const apiKey = "5769c893"; // OMDb API Key
const baseApiUrl = `http://www.omdbapi.com/?apikey=${apiKey}`;
const crudApiUrl = "https://crudcrud.com/api/27d8e498a0f144a0a7f9a79d01952ce1";

// Elements
const movieDetailsElement = document.querySelector("#movie-details");
const movieTrailerElement = document.querySelector("#movie-trailer");
const saveFavoriteButton = document.querySelector("#save-favorite");

let selectedMovieId = localStorage.getItem("selectedMovieId");

if (selectedMovieId) {
  fetchMovieDetails(selectedMovieId).then((movie) => {
    displayMovieDetails(movie);
    fetchMovieTrailer(movie.Title);
  });
}

async function fetchMovieDetails(movieId) {
  const response = await fetch(`${baseApiUrl}&i=${movieId}`);
  return await response.json();
}

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
        `;
  }
}

async function fetchMovieTrailer(movieTitle) {
  const response = await fetch(
    `${youtubeApiUrl}?part=snippet&q=${encodeURIComponent(
      movieTitle + " trailer"
    )}&key=${youtubeApiKey}`
  );
  const data = await response.json();
  if (data.items && data.items.length > 0) {
    const trailer = data.items[0];
    displayMovieTrailer(trailer);
  } else {
    movieTrailerElement.innerHTML = "<p>Trailer not available</p>";
  }
}

function displayMovieTrailer(trailer) {
  if (movieTrailerElement) {
    movieTrailerElement.innerHTML = `
            <h3>Trailer</h3>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailer.id.videoId}" frameborder="0" allowfullscreen></iframe>
        `;
  }
}

// Save movie to favorites in CRUD CRUD API
saveFavoriteButton.addEventListener("click", () => {
  const movieId = selectedMovieId;
  if (movieId) {
    saveToFavorites(movieId);
  }
});

async function saveToFavorites(movieId) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.includes(movieId)) {
    favorites.push(movieId);
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Save to CRUD CRUD API
    const response = await fetch(
      `https://crudcrud.com/api/YOUR_UNIQUE_ENDPOINT/favorites`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId }),
      }
    );
    if (response.ok) {
      alert("Movie saved to favorites!");
    } else {
      console.error("Failed to save favorite movie");
    }
  }
}
