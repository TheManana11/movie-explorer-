
import { getMovieDetails } from "./api.js";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

const moviePoster = document.querySelector("#movie-poster");
const movieTitle = document.querySelector("#movie-title");
const movieYear = document.querySelector("#movie-year");
const movieRuntime = document.querySelector("#movie-runtime");
const movieRating = document.querySelector("#movie-rating");
const movieGenres = document.querySelector("#movie-genres");
const movieOverview = document.querySelector("#movie-overview");
const movieDirector = document.querySelector("#movie-director");
const movieCast = document.querySelector("#movie-cast");
const movieCompanies = document.querySelector("#movie-companies");
const movieReleaseDate = document.querySelector("#movie-release-date");
const movieVoteCount = document.querySelector("#movie-vote-count");
const movieLanguage = document.querySelector("#movie-language");
const pageMessage = document.querySelector("#page-message");

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

async function loadMovieDetails() {
  if (!movieId || !/^\d+$/.test(movieId)) {
    showError("Invalid movie ID.");
    return;
  }

  try {
    pageMessage.textContent = "Loading movie details...";

    const movie = await getMovieDetails(movieId);

    renderMovie(movie);
    pageMessage.textContent = "";
  } catch (error) {
    console.error(error);
    showError("Unable to load movie details. Please try again later.");
  }
}

function renderMovie(movie) {
  document.title = `${movie.title} | Movie Explorer`;

  movieTitle.textContent = movie.title;
  movieYear.textContent = movie.release_date?.slice(0, 4) || "Year unknown";
  movieRuntime.textContent = movie.runtime
    ? `${movie.runtime} min`
    : "Runtime unavailable";
  movieRating.textContent = movie.vote_average
    ? `★ ${movie.vote_average.toFixed(1)} / 10`
    : "Not rated";

  movieOverview.textContent =
    movie.overview || "No overview is available for this movie.";

  movieReleaseDate.textContent = movie.release_date || "Unknown";
  movieVoteCount.textContent = movie.vote_count?.toLocaleString() || "0";
  movieLanguage.textContent =
    movie.original_language?.toUpperCase() || "Unknown";

  if (movie.poster_path) {
    moviePoster.src = `${IMAGE_BASE_URL}${movie.poster_path}`;
    moviePoster.alt = `${movie.title} poster`;
  } else {
    moviePoster.removeAttribute("src");
    moviePoster.alt = "No poster available";
  }

  if (movie.backdrop_path) {
    document.querySelector(".movie-hero").style.backgroundImage =
      `linear-gradient(90deg, #101116 15%, rgba(16,17,22,.82) 60%, rgba(16,17,22,.5)), url("${BACKDROP_BASE_URL}${movie.backdrop_path}")`;
  }

  movieGenres.innerHTML = movie.genres.length
    ? movie.genres
        .map((genre) => `<span class="genre-tag">${genre.name}</span>`)
        .join("")
    : "Genres unavailable";

  const director = movie.credits.crew.find(
    (person) => person.job === "Director"
  );

  movieDirector.textContent = director?.name || "Unknown";

  movieCast.textContent = movie.credits.cast
    .slice(0, 8)
    .map((person) => person.name)
    .join(", ") || "Cast information unavailable";

  movieCompanies.textContent = movie.production_companies
    .map((company) => company.name)
    .join(", ") || "Unknown";
}

function showError(message) {
  pageMessage.textContent = message;
}

loadMovieDetails();
