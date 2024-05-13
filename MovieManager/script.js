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
