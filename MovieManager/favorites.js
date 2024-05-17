const apiKey = "5769c893"; // OMDb API Key
const baseApiUrl = `http://www.omdbapi.com/?apikey=${apiKey}`;
const crudApiUrl = "https://crudcrud.com/api/27d8e498a0f144a0a7f9a79d01952ce1";

// Elements
const favoritesList = document.querySelector("#favorites-list");

const currentUser = localStorage.getItem("currentUser");
if (currentUser) {
  loadFavorites();
}

async function loadFavorites() {
  const response = await fetch(`${crudApiUrl}/favorites-${currentUser}`);
  const data = await response.json();
  displayFavorites(data);
}

function displayFavorites(favorites) {
  favoritesList.innerHTML = "";
  const uniqueFavorites = Array.from(
    new Set(favorites.map((item) => item.movieId))
  );
  uniqueFavorites.forEach((movieId) => {
    fetchMovieDetails(movieId).then((details) => {
      const li = document.createElement("li");
      li.classList.add("movie-item");
      li.innerHTML = `
        <img src="${details.Poster}" alt="${details.Title}">
        <span>${details.Title} (${details.Year})</span>
        <button class="remove-favorite" data-id="${movieId}">Remove</button>
      `;
      favoritesList.appendChild(li);
    });
  });

  favoritesList.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-favorite")) {
      const movieId = e.target.getAttribute("data-id");
      removeFavorite(movieId);
    }
  });
}

async function fetchMovieDetails(movieId) {
  const response = await fetch(`${baseApiUrl}&i=${movieId}`);
  return await response.json();
}

async function removeFavorite(movieId) {
  const favorites =
    JSON.parse(localStorage.getItem(`favorites-${currentUser}`)) || [];
  const updatedFavorites = favorites.filter((id) => id !== movieId);
  localStorage.setItem(
    `favorites-${currentUser}`,
    JSON.stringify(updatedFavorites)
  );

  // Fetch favorite items from crudcrud API to get the ID to delete
  const response = await fetch(`${crudApiUrl}/favorites-${currentUser}`);
  const data = await response.json();
  const favoriteItem = data.find((item) => item.movieId === movieId);

  if (favoriteItem) {
    await fetch(`${crudApiUrl}/favorites-${currentUser}/${favoriteItem._id}`, {
      method: "DELETE",
    });

    loadFavorites();
  } else {
    console.error("Failed to remove favorite movie");
  }
}
