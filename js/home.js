
import { getPopularMovies, searchMovies } from "./api.js";

const movieGrid = document.querySelector("#movie-grid");
const resultsTitle = document.querySelector("#results-title");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const previousPageButton = document.querySelector("#previous-page");
const nextPageButton = document.querySelector("#next-page");
const currentPageElement = document.querySelector("#current-page");

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

let currentPage = 1;
let currentQuery = "";
let totalPages = 1;

async function loadMovies() {
  movieGrid.innerHTML = "<p>Loading movies...</p>";
  updatePagination();

  try {
    const data = currentQuery
      ? await searchMovies(currentQuery, currentPage)
      : await getPopularMovies(currentPage);

    totalPages = Math.min(data.total_pages, 500);

    renderMovies(data.results);

    resultsTitle.textContent = currentQuery
      ? `Search results for "${currentQuery}"`
      : "Popular Movies";

    updatePagination();
  } catch (error) {
    console.error(error);
    movieGrid.innerHTML =
      "<p>Unable to load movies. Please try again later.</p>";
    totalPages = 1;
    updatePagination();
  }
}

function renderMovies(movies) {
  if (!movies.length) {
    movieGrid.innerHTML = "<p>No movies found. Try another title.</p>";
    return;
  }

  movieGrid.innerHTML = movies
    .map((movie) => {
      const poster = movie.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : "";

      return `
        <a class="movie-card" href="movie.html?id=${movie.id}">
          <div class="movie-poster">
            ${
              poster
                ? `<img src="${poster}" alt="${movie.title} poster">`
                : "<div>No poster available</div>"
            }
            <span class="movie-rating">
              ★ ${movie.vote_average.toFixed(1)}
            </span>
          </div>

          <div class="movie-info">
            <h3>${movie.title}</h3>
            <p>${movie.release_date?.slice(0, 4) || "Year unknown"}</p>
          </div>
        </a>
      `;
    })
    .join("");
}

function updatePagination() {
  currentPageElement.textContent = currentPage;
  previousPageButton.disabled = currentPage <= 1;
  nextPageButton.disabled = currentPage >= totalPages;
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  currentQuery = searchInput.value.trim();
  currentPage = 1;

  loadMovies();
});

previousPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadMovies();
  }
});

nextPageButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    loadMovies();
  }
});

loadMovies();
