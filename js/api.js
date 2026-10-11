
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MGMwYzcwZDZmYzk4MTY0MWI1OGQ1NWM0OWNkOGVkNSIsIm5iZiI6MTc5MTczMDMwOS4wMjEsInN1YiI6IjZhY2JhMjg1NzViMGI0NTg0N2YxMGVmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eW1eKLpIm03tDsEreblTMZcAVwvBoGFw376BfAGjwTU";

async function fetchFromAPI(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function getPopularMovies(page = 1) {
  return fetchFromAPI(`/movie/popular?language=en-US&page=${page}`);
}

export async function searchMovies(query, page = 1) {
  const params = new URLSearchParams({
    query,
    language: "en-US",
    page: String(page),
  });

  return fetchFromAPI(`/search/movie?${params}`);
}

export async function getMovieDetails(movieId) {
  return fetchFromAPI(
    `/movie/${movieId}?language=en-US&append_to_response=credits`
  );
}
