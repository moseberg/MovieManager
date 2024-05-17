const apiKey = "5769c893"; // OMDb API Key
const baseApiUrl = `http://www.omdbapi.com/?apikey=${apiKey}`;
const crudApiUrl = "https://crudcrud.com/api/27d8e498a0f144a0a7f9a79d01952ce1";

// Elements
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search");
const movieList = document.querySelector("#movie-list");
const popularMovieList = document.querySelector("#popular-movie-list");
const searchHistoryList = document.querySelector("#search-history-list");
const saveFavoriteButton = document.querySelector("#save-favorite");
const loginButton = document.querySelector("#loginButton");
const logoutButton = document.querySelector("#logoutButton");
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const searchResults = document.querySelector("#search-results");
const tabs = document.querySelector("#tabs");
const popularMoviesSection = document.querySelector("#popular-movies");
const searchHistorySection = document.querySelector("#search-history");
let selectedMovieId = null;
let isLoggedIn = false;

// Mock user database
const users = [
    { username: "user1", password: "password1" },
    { username: "user2", password: "password2" }
];

// Authentication
const currentUser = localStorage.getItem("currentUser");
if (currentUser) {
    showLogoutButton();
} else {
    showLoginButton();
}

loginButton?.addEventListener("click", () => {
    const username = prompt("Enter username:");
    const password = prompt("Enter password:");
    authenticateUser(username, password);
});

logoutButton?.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.reload();
});

function authenticateUser(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        localStorage.setItem("currentUser", username);
        showLogoutButton();
        alert("Login successful!");
    } else {
        alert("Invalid credentials");
    }
}

function showLoginButton() {
    loginButton.style.display = "inline-block";
    logoutButton.style.display = "none";
}

function showLogoutButton() {
    loginButton.style.display = "none";
    logoutButton.style.display = "inline-block";
}

// Event listener for form submission
searchForm?.addEventListener("submit", function(event) {
    event.preventDefault();
    fetchMovies(searchInput.value).then(movies => {
        movieList.innerHTML = '';
        movies.forEach(movie => {
            const li = document.createElement('li');
            li.textContent = movie.Title;
            li.addEventListener('click', () => {
                localStorage.setItem('selectedMovieId', movie.imdbID);
                window.location.href = 'details.html';
            });
            movieList.appendChild(li);
        });
    });
});

// Function to fetch movies from OMDb API
async function fetchMovies(query) {
    const response = await fetch(`http://localhost:3000/movies?title=${query}`);
    const data = await response.json();
    if (data.Response === "True") {
        return data.Search;
    } else {
        console.error(data.Error);
        return [];
    }
}


// Fetch movie details and display
if (window.location.pathname.endsWith('details.html')) {
    const movieId = localStorage.getItem('selectedMovieId');
    fetchMovieDetails(movieId).then(movie => {
        displayMovieDetails(movie);
    });
}

async function fetchMovieDetails(movieId) {
    const response = await fetch(`${baseApiUrl}&i=${movieId}`);
    return await response.json();
}

function displayMovieDetails(movie) {
    movieDetails.innerHTML = `
        <h2>${movie.Title}</h2>
        <p>${movie.Plot}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Actors:</strong> ${movie.Actors}</p>
    `;
}

saveFavoriteButton?.addEventListener('click', () => {
    const movieId = localStorage.getItem('selectedMovieId');
    saveToFavorites(movieId);
});

function saveToFavorites(movieId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(movieId)) {
        favorites.push(movieId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Movie saved to favorites!')
    }}
