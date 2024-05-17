const apiKey = "5769c893"; // This is the OMDb API Key.
const baseApiUrl = `http://www.omdbapi.com/?apikey=${apiKey}`; // And here's the base URL for OMDb API.
const crudApiUrl = "https://crudcrud.com/api/27d8e498a0f144a0a7f9a79d01952ce1"; // This is the base URL for CRUD CRUD API.

// Elements - Querying DOM elements for further use.
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
let selectedMovieId = null; // Variable to store the selected movie ID.

// Here's a list of some popular movie titles that is displaying on the main page.
const popularMovies = [
  "The Godfather", "Shrek", "Lilo & Stitch", "The Dark Knight", "Inception", 
  "Fight Club", "Pulp Fiction", "The Matrix", "Forrest Gump", 
  "The Lord of the Rings: The Return of the King", "The Shawshank Redemption", 
  "Interstellar", "Gladiator", "Saving Private Ryan", "Titanic", 
  "Jurassic Park", "The Lion King", "Back to the Future", "Star Wars", 
  "Avengers: Endgame",
];

// Mock login/logout events
loginButton.addEventListener("click", () => {
  showLoginModal(); // Shows the "login modal" when "login button" is clicked.
});

registerButton.addEventListener("click", () => {
  showRegisterModal(); // Shows the "register modal" when "register button" is clicked.
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("currentUser"); // Remove current user from "localStorage".
  window.location.href = "index.html"; // Redirects to the "main page"
});

favoritesButton.addEventListener("click", () => {
  window.location.href = "favorites.html"; // Redirects to the "favorites" page.
});

// Function to show the "login modal".
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

  // Closes the "modal" when the close button is clicked.
  closeButton.addEventListener("click", () => {
    modal.remove();
  });

  // Handle login form submission.
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevents "default" form submission.
    const username = loginForm.querySelector("#username").value;
    const password = loginForm.querySelector("#password").value;
    authenticateUser(username, password); // Authenticates the user.
    modal.remove();
  });
}

// Function to show the register modal.
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

  // Close the modal when the close button is clicked.
  closeButton.addEventListener("click", () => {
    modal.remove();
  });

  // Handle register form submission.
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevents default form submission.
    const username = registerForm.querySelector("#new-username").value;
    const password = registerForm.querySelector("#new-password").value;
    registerUser(username, password); // Registers the user.
    modal.remove();
  });
}

// Function to register a new user.
async function registerUser(username, password) {
  const response = await fetch(`${crudApiUrl}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }), // Sends the user data to CRUD API.
  });

  if (response.ok) {
    alert("Registration successful! Please login.");
  } else {
    alert("Registration failed. Please try again.");
  }
}

// Function to authenticate a user.
async function authenticateUser(username, password) {
  const response = await fetch(`${crudApiUrl}/users`);
  const users = await response.json();

  // Find user in the response data.
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    localStorage.setItem("currentUser", username); // Saves the current user in localStorage.
    showLogoutButton(); // Shows the logout button if authentication is successful.
    alert("Login successful!");
    window.location.href = "favorites.html"; // Redirects to the favorites page.
  } else {
    alert("Invalid credentials");
  }
}

// Function to show login button and hide logout button.
function showLoginButton() {
  loginButton.style.display = "inline-block";
  registerButton.style.display = "inline-block";
  logoutButton.style.display = "none";
  favoritesButton.style.display = "none";
}

// Function to show logout button and hide login button.
function showLogoutButton() {
  loginButton.style.display = "none";
  registerButton.style.display = "none";
  logoutButton.style.display = "inline-block";
  favoritesButton.style.display = "inline-block";
}

// Check if a user is logged in on page load
if (localStorage.getItem("currentUser")) {
  showLogoutButton(); // Shows the logout button if a user is logged in.
  loadSearchHistory(); // Loads the search history for the logged-in user.
} else {
  showLoginButton(); // Shows the login button if no user is logged in.
}

// Tab functionality to switch between tabs.
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.getAttribute("data-tab");
    tabContents.forEach((content) => {
      content.style.display = content.id === tab ? "block" : "none";
    });
    if (tab === "search-history") {
      loadSearchHistory(); // Loads search history when the "Search History" tab is clicked.
    }
  });
});

// Event listener for search form submission.
searchForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission.
  const query = searchInput.value.trim();
  if (query) {
    fetchMovies(query).then((movies) => {
      displayMovies(movies); // Displays the fetched movies.
      if (localStorage.getItem("currentUser")) {
        saveSearchHistory(query); // Saves the search history for logged-in user.
      }
      searchResults.style.display = "block";
      popularMoviesSection.style.display = "none";
      searchHistorySection.style.display = "none";
    });
  }
});

// Function to fetch movies from OMDb API based on search query.
async function fetchMovies(query) {
  const response = await fetch(`${baseApiUrl}&s=${query}`);
  const data = await response.json();
  if (data.Response === "True") {
    return data.Search; // Return array of movies if the response is successful.
  } else {
    return [];
  }
}

// Function to display movies in the search results.
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
      localStorage.setItem("selectedMovieId", movie.imdbID); // This saves the selected movie ID in localStorage.
      window.location.href = "details.html"; // This redirects to the details page.
    });
    movieList.appendChild(li);
  });

  // This is to Create a "Back to Main Page" button if it doesn't exist.
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

// Function to save search history.
async function saveSearchHistory(query) {
  const movie = await fetchMovieDetailsByTitle(query); // This is to fetch movie details by title.
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
    loadSearchHistory(); // Reload search history if the response is successful.
  } else {
    console.error("Failed to save search history");
  }
}

// Function to load search history for the current user
async function loadSearchHistory() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return;

  const response = await fetch(`${crudApiUrl}/search-history-${currentUser}`);
  const data = await response.json();
  displaySearchHistory(data); // This is to display the search history.
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
      localStorage.setItem("selectedMovieId", movie.imdbID); // Save selected movie ID in localStorage.
      window.location.href = "details.html"; // This is to redirect to the details page.
    });
    searchHistoryList.appendChild(li);
  });
}

// Function to fetch movie details by title from OMDb API.
async function fetchMovieDetailsByTitle(title) {
  const response = await fetch(`${baseApiUrl}&t=${title}`);
  return await response.json();
}

// Function to fetch movie details by IMDb ID from OMDb API.
async function fetchMovieDetailsById(imdbID) {
  const response = await fetch(`${baseApiUrl}&i=${imdbID}`);
  return await response.json();
}

// Function to load popular movies on the main page.
async function loadPopularMovies() {
  for (const title of popularMovies) {
    const details = await fetchMovieDetailsByTitle(title); // This is to fetch details for each popular movie.
    displayPopularMovie(details); // This is to display each popular movie.
  }
}

// Function to display popular movies on the main page.
function displayPopularMovie(movie) {
  const li = document.createElement("li");
  li.classList.add("movie-item");
  li.innerHTML = `
    <img src="${movie.Poster}" alt="${movie.Title}">
    <span>${movie.Title} (${movie.Year})</span>
  `;
  li.addEventListener("click", () => {
    selectedMovieId = movie.imdbID;
    localStorage.setItem("selectedMovieId", movie.imdbID); // Here you Save selected movie ID in localStorage.
    window.location.href = "details.html"; // This will redirect to the details page.
  });
  popularMovieList.appendChild(li);
}

// This is to Save movies to favorites in CRUD CRUD API.
const saveFavoriteButton = document.querySelector("#save-favorite");
saveFavoriteButton?.addEventListener("click", () => {
  const movieId = localStorage.getItem("selectedMovieId");
  if (movieId) {
    saveToFavorites(movieId); // Save movie to favorites
  }
});

// Function to save a movie to the favorites list
async function saveToFavorites(movieId) {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return;

  const favorites =
    JSON.parse(localStorage.getItem(`favorites-${currentUser}`)) || [];
  if (!favorites.includes(movieId)) {
    favorites.push(movieId);
    localStorage.setItem(`favorites-${currentUser}`, JSON.stringify(favorites)); // Update local storage

    const response = await fetch(`${crudApiUrl}/favorites-${currentUser}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieId }), // Send favorite movie data to CRUD API
    });

    if (response.ok) {
      alert("Movie saved to favorites!");
      window.location.href = "favorites.html"; // Redirect to favorites page
    } else {
      console.error("Failed to save favorite movie");
    }
  }
}

// Fetch movie details and display on details.html
if (window.location.pathname.endsWith("details.html")) {
  const movieId = localStorage.getItem("selectedMovieId");
  fetchMovieDetailsById(movieId).then((movie) => {
    displayMovieDetails(movie); // Display movie details
  });
}

// Function to fetch movie details by IMDb ID from OMDb API
async function fetchMovieDetailsById(movieId) {
  const response = await fetch(`${baseApiUrl}&i=${movieId}`);
  return await response.json();
}

// Function to display movie details on the details page
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
loadPopularMovies(); // Initial load of popular movies
