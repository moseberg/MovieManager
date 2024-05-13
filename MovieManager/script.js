const apiKey = "https://www.omdbapi.com/?i=tt3896198&apikey=5769c893";
const baseApiUrl = "http://img.omdbapi.com/?apikey=[5769c893]" + apiKey;
const crudApiUrl = "https://crudapi.co.uk/api/v1/";
const crudApiKey = "ayTep4yOMiyKX4U8qcDml9Doi6uqeI80-vDoR6WhZRcbpAVpyQ";

// Fetcher filmer fra OMDb API
async function fetchMovies(query) {
  const response = await fetch(`${baseApiUrl}&s=${query}`);
  const data = await response.json();
  return data.Search || [];
}

// Fetcher filmer detaljer fra OMDb API
async function fetchMovieDetails(id) {
  const response = await fetch(`${baseApiUrl}&i=${id}`);
  const data = await response.json();
  return data;
}

// Lagre favoritt film til CRUD API
async function saveFavoriteMovie(movie) {
  await fetch(crudApiUrl + "movies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${crudApiKey}`,
    },
    body: JSON.stringify(movie),
  });
}

// Get favorite filmer from CRUD API
async function getFavoriteMovies() {
  const response = await fetch(crudApiUrl + "movies", {
    headers: {
      Authorization: `Bearer ${crudApiKey}`,
    },
  });
  const data = await response.json();
  return data;
}

// Deleter favoritt filmer fra CRUD API
async function deleteFavoriteMovie(id) {
  await fetch(crudApiUrl + `movies/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${crudApiKey}`,
    },
  });
}

// Event listeners and DOM manipulation
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const movieList = document.getElementById("movie-list");
  const movieDetails = document.getElementById("movie-details");
  const saveFavoriteButton = document.getElementById("save-favorite");
  const favoritesList = document.getElementById("favorites-list");

  if (searchInput) {
    searchInput.addEventListener("input", async () => {
      const query = searchInput.value;
      const movies = await fetchMovies(query);
      movieList.innerHTML = "";
      movies.forEach((movie) => {
        const li = document.createElement("li");
        li.textContent = movie.Title;
        li.addEventListener("click", () => {
          localStorage.setItem("selectedMovieId", movie.imdbID);
          window.location.href = "details.html";
        });
        movieList.appendChild(li);
      });
    });
  }

  if (movieDetails) {
    const movieId = localStorage.getItem("selectedMovieId");
    fetchMovieDetails(movieId).then((movie) => {
      movieDetails.innerHTML = `
                <h2>${movie.Title}</h2>
                <p>${movie.Plot}</p>
                <img src="${movie.Poster}" alt="${movie.Title}">
            `;
      saveFavoriteButton.addEventListener("click", () => {
        saveFavoriteMovie(movie);
        alert("Movie saved to favorites");
      });
    });
  }

  if (favoritesList) {
    getFavoriteMovies().then((movies) => {
      favoritesList.innerHTML = "";
      movies.forEach((movie) => {
        const li = document.createElement("li");
        li.textContent = movie.Title;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
          deleteFavoriteMovie(movie._id);
          li.remove();
        });
        li.appendChild(deleteButton);
        favoritesList.appendChild(li);
      });
    });
  }
});
