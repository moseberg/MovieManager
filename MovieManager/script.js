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
const registerButton = document.querySelector("#registerButton");
const logoutButton = document.querySelector("#logoutButton");
const favoritesButton = document.querySelector("#favoritesButton");
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");
const searchResults = document.querySelector("#search-results");
const tabs = document.querySelector("#tabs");
const popularMoviesSection = document.querySelector("#popular-movies");
const searchHistorySection = document.querySelector("#search-history");
const backToMainButton = document.querySelector("#back-to-main");
let selectedMovieId = null;

// Predefined list of popular movie titles
const popularMovies = [
  "The Godfather",
  "Shrek",
  "Lilo & Stitch",
  "The Dark Knight",
  "Inception",
  "Fight Club",
  "Pulp Fiction",
  "The Matrix",
  "Forrest Gump",
  "The Lord of the Rings: The Return of the King",
  "The Shawshank Redemption",
  "Interstellar",
  "Gladiator",
  "Saving Private Ryan",
  "Titanic",
  "Jurassic Park",
  "The Lion King",
  "Back to the Future",
  "Star Wars",
  "Avengers: Endgame",
];

// Mock login/logout
loginButton.addEventListener("click", () => {
  showLoginModal();
});

registerButton.addEventListener("click", () => {
  showRegisterModal();
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

function showRegisterModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">&times;</span>
      <h2>Register</h2>
      <form id="register-form">
        <input type="text" id="new-username" placeholder="Username" required />
        <input type="password" id="new-password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const closeButton = modal.querySelector(".close-button");
  const registerForm = modal.querySelector("#register-form");

  closeButton.addEventListener("click", () => {
    modal.remove();
  });

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = registerForm.querySelector("#new-username").value;
    const password = registerForm.querySelector("#new-password").value;
    registerUser(username, password);
    modal.remove();
  });
}

async function registerUser(username, password) {
  const response = await fetch(`${crudApiUrl}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    alert("Registration successful! Please login.");
  } else {
    alert("Registration failed. Please try again.");
  }
}

async function authenticateUser(username, password) {
  const response = await fetch(`${crudApiUrl}/users`);
  const users = await response.json();

  const user = users.find((user) => user.username === username && user.password === password);
  if (user) {
    localStorage.setItem("currentUser", username);
    showLogoutButton();
    alert("Login successful!");
    window.location.href = "favorites.html";
  } else {
    alert("Invalid credentials");
  }
}

function showLoginButton() {
  loginButton.style.display = "inline-block";
  registerButton.style.display = "inline-block";
  logoutButton.style.display = "none";
  favoritesButton.style.display = "none";
}

function showLogoutButton() {
  loginButton.style.display = "none";
  registerButton.style.display = "none";
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
      popularMoviesSection.style.display = "none";
      searchHistorySection.style.display = "none";
    });
  }
});

// Function to fetch movies from OMDb API
async function fetchMovies(query) {
  const response = await fetch(`${baseApiUrl}&s=${query}`);
  const data = await response.json();
  if (data.Response === "True") {
    return data.Search;
  } else {
    return [];
  }
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

  if (!document.querySelector("#back-to-main")) {
    const backToMainButton = document.createElement("button");
    backToMainButton.id = "back-to-main";
    backToMainButton.classList.add("search-button");
    backToMainButton.textContent = "Back to Main Page";
    backToMainButton.addEventListener("click", () => {
      searchResults.style.display = "none";
      tabs.style.display = "block";
      popularMoviesSection.style.display = "block";
      searchHistorySection.style.display = "none";
    });
    searchResults.appendChild(backToMainButton);
  }
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

// Function to fetch movie details by IMDb ID
async function fetchMovieDetailsById(imdbID) {
  const response = await fetch(`${baseApiUrl}&i=${imdbID}`);
  return await response.json();
}

// Function to load popular movies
async function loadPopularMovies() {
  for (const title of popularMovies) {
    const details = await fetchMovieDetailsByTitle(title);
    displayPopularMovie(details);
  }
}

// Function to display popular movies
function displayPopularMovie(movie) {
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
  popularMovieList.appendChild(li);
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

  const favorites =
    JSON.parse(localStorage.getItem(`favorites-${currentUser}`)) || [];
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
      window.location.href = "favorites.html";
    } else {
      console.error("Failed to save favorite movie");
    }
  }
}

// Fetch movie details and display on details.html
if (window.location.pathname.endsWith("details.html")) {
  const movieId = localStorage.getItem("selectedMovieId");
  fetchMovieDetailsById(movieId).then((movie) => {
    displayMovieDetails(movie);
  });
}

async function fetchMovieDetailsById(movieId) {
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