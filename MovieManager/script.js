const apiKey = "5769c893"; // OMDb API Key
const baseApiUrl = `http://www.omdbapi.com/?apikey=${apiKey}`;
const crudApiUrl = "https://crudcrud.com/api/27d8e498a0f144a0a7f9a79d01952ce1";

// Elements
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search");
const movieList = document.querySelector("#movie-list");
const popularMovieList = document.querySelector("#popular-movie-list");
const searchHistoryList = document.querySelector("#search-history-list");
const loginButton = document.querySelector("#loginButton");
const logoutButton = document.querySelector("#logoutButton");
const favoritesButton = document.querySelector("#favoritesButton");
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");
const searchResults = document.querySelector("#search-results");
const tabs = document.querySelector("#tabs");
const popularMoviesSection = document.querySelector("#popular-movies");
const searchHistorySection = document.querySelector("#search-history");
let selectedMovieId = null;

// Mock user database
const users = [
  { username: "user1", password: "password1" },
  { username: "user2", password: "password2" },
  { username: "user3", password: "password3" },
];

// Mock login/logout
loginButton.addEventListener("click", () => {
  showLoginModal();
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});

favoritesButton.addEventListener("click", () => {
  window.location.href = "favorites.html";
});

function showLoginModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">&times;</span>
      <h2>Login</h2>
      <form id="login-form">
        <input type="text" id="username" placeholder="Username" required />
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const closeButton = modal.querySelector(".close-button");
  const loginForm = modal.querySelector("#login-form");

  closeButton.addEventListener("click", () => {
    modal.remove();
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = loginForm.querySelector("#username").value;
    const password = loginForm.querySelector("#password").value;
    authenticateUser(username, password);
    modal.remove();
  });
}

function authenticateUser(username, password) {
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    localStorage.setItem("currentUser", username);
    showLogoutButton();
    alert("Login successful!");
    loadSearchHistory();
  } else {
    alert("Invalid credentials");
  }
}

function showLoginButton() {
  loginButton.style.display = "inline-block";
  logoutButton.style.display = "none";
  favoritesButton.style.display = "none";
}

function showLogoutButton() {
  loginButton.style.display = "none";
  logoutButton.style.display = "inline-block";
  favoritesButton.style.display = "inline-block";
}

if (localStorage.getItem("currentUser")) {
  showLogoutButton();
  loadSearchHistory();
} else {
  showLoginButton();
}

// Tab functionality
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.getAttribute("data-tab");
    tabContents.forEach((content) => {
      content.style.display = content.id === tab ? "block" : "none";
    });
    if (tab === "search-history") {
      loadSearchHistory();
    }
  });
});

// Event listener for search form submission
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    fetchMovies(query).then((movies) => {
      displayMovies(movies);
      if (localStorage.getItem("currentUser")) {
        saveSearchHistory(query);
      }
      searchResults.style.display = "block";
      tabs.style.display = "none";
      popularMoviesSection.style.display = "none";
      searchHistorySection.style.display = "none";
    });
  }
});

// Function to fetch movies from OMDb API
async function fetchMovies(query) {
  const response = await fetch(`${baseApiUrl}&s=${query}`);
  const data = await response.json();
  return data.Response === "True" ? data.Search : [];
}

// Function to display movies
function displayMovies(movies) {
  movieList.innerHTML = "";
  const uniqueMovies = Array.from(
    new Set(movies.map((movie) => movie.imdbID))
  ).map((id) => movies.find((movie) => movie.imdbID === id));

  uniqueMovies.forEach((movie) => {
    const li = document.createElement("li");
    li.classList.add("movie-item");
    li.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <span>${movie.Title} (${movie.Year})</span>
        `;
    li.addEventListener("click", () => {
      selectedMovieId = movie.imdbID;
      localStorage.setItem("selectedMovieId", movie.imdbID);
      window.location.href = "details.html";
    });
    movieList.appendChild(li);
  });
}

// Function to save search history
async function saveSearchHistory(query) {
  const movie = await fetchMovieDetailsByTitle(query);
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return;

  const response = await fetch(`${crudApiUrl}/search-history-${currentUser}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imdbID: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
    }),
  });

  if (response.ok) {
    loadSearchHistory();
  } else {
    console.error("Failed to save search history");
  }
}

// Function to load search history
async function loadSearchHistory() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return;

  const response = await fetch(`${crudApiUrl}/search-history-${currentUser}`);
  const data = await response.json();
  displaySearchHistory(data);
}

// Function to display search history
function displaySearchHistory(history) {
  searchHistoryList.innerHTML = "";
  const uniqueHistory = Array.from(
    new Set(history.map((item) => item.imdbID))
  ).map((id) => history.find((item) => item.imdbID === id));
  uniqueHistory.forEach((movie) => {
    const li = document.createElement("li");
    li.classList.add("movie-item");
    li.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}">
            <span>${movie.title} (${movie.year})</span>
        `;
    li.addEventListener("click", () => {
      selectedMovieId = movie.imdbID;
      localStorage.setItem("selectedMovieId", movie.imdbID);
      window.location.href = "details.html";
    });
    searchHistoryList.appendChild(li);
  });
}

// Function to fetch movie details by title
async function fetchMovieDetailsByTitle(title) {
  const response = await fetch(`${baseApiUrl}&t=${title}`);
  return await response.json();
}

// Function to update popular movies
async function updatePopularMovies(query) {
  const response = await fetch(`${crudApiUrl}/popular-movies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (response.ok) {
    loadPopularMovies();
  } else {
    console.error("Failed to update popular movies");
  }
}

// Function to load popular movies
async function loadPopularMovies() {
  const response = await fetch(`${crudApiUrl}/popular-movies`);
  const data = await response.json();
  displayPopularMovies(data);
}

// Function to display popular movies
function displayPopularMovies(movies) {
  popularMovieList.innerHTML = "";
  const uniqueMovies = Array.from(new Set(movies.map((movie) => movie.query)));
  uniqueMovies.forEach((movie) => {
    fetchMovieDetailsByTitle(movie).then((details) => {
      const li = document.createElement("li");
      li.classList.add("movie-item");
      li.innerHTML = `
                <img src="${details.Poster}" alt="${details.Title}">
                <span>${details.Title} (${details.Year})</span>
            `;
      li.addEventListener("click", () => {
        selectedMovieId = details.imdbID;
        localStorage.setItem("selectedMovieId", details.imdbID);
        window.location.href = "details.html";
      });
      popularMovieList.appendChild(li);
    });
  });
}

// Save movie to favorites in CRUD CRUD API
const saveFavoriteButton = document.querySelector("#save-favorite");
saveFavoriteButton?.addEventListener("click", () => {
  const movieId = localStorage.getItem("selectedMovieId");
  if (movieId) {
    saveToFavorites(movieId);
  }
});

async function saveToFavorites(movieId) {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return;

  const favorites = JSON.parse(localStorage.getItem(`favorites-${currentUser}`)) || [];
  if (!favorites.includes(movieId)) {
    favorites.push(movieId);
    localStorage.setItem(`favorites-${currentUser}`, JSON.stringify(favorites));

    const response = await fetch(`${crudApiUrl}/favorites-${currentUser}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieId }),
    });

    if (response.ok) {
      alert("Movie saved to favorites!");
    } else {
      console.error("Failed to save favorite movie");
    }
  }
}

// Fetch movie details and display on details.html
if (window.location.pathname.endsWith("details.html")) {
  const movieId = localStorage.getItem("selectedMovieId");
  fetchMovieDetails(movieId).then((movie) => {
    displayMovieDetails(movie);
  });
}

async function fetchMovieDetails(movieId) {
  const response = await fetch(`${baseApiUrl}&i=${movieId}`);
  return await response.json();
}

function displayMovieDetails(movie) {
  const movieDetails = document.querySelector("#movie-details");
  if (movieDetails) {
    movieDetails.innerHTML = `
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

// Load popular movies on page load
loadPopularMovies();
