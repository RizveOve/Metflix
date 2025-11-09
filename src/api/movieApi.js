import axios from 'axios';

// TMDB API Configuration
const TMDB_API_KEY = 'cd341abbf453afe939f9b124c3c3a1e4';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Create axios instance with default config
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US'
  }
});

// Helper function to format movie data
const formatMovieData = (movie) => ({
  id: movie.id,
  title: movie.title || movie.name,
  name: movie.name || movie.title,
  original_name: movie.original_name || movie.original_title,
  overview: movie.overview,
  backdrop_path: movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}` : null,
  poster_path: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
  vote_average: movie.vote_average,
  release_date: movie.release_date || movie.first_air_date,
  genre_ids: movie.genre_ids,
  popularity: movie.popularity,
  adult: movie.adult
});

// Get trending movies
export const getTrendingMovies = async () => {
  try {
    const response = await tmdbApi.get('/trending/all/week');
    return {
      data: {
        results: response.data.results.map(formatMovieData)
      }
    };
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return { data: { results: [] } };
  }
};

// Get Netflix Originals (TV shows from Netflix)
export const getNetflixOriginals = async () => {
  try {
    const response = await tmdbApi.get('/discover/tv', {
      params: {
        with_networks: 213 // Netflix network ID
      }
    });
    return {
      data: {
        results: response.data.results.map(formatMovieData)
      }
    };
  } catch (error) {
    console.error('Error fetching Netflix originals:', error);
    return { data: { results: [] } };
  }
};

// Get top rated movies
export const getTopRatedMovies = async () => {
  try {
    const response = await tmdbApi.get('/movie/top_rated');
    return {
      data: {
        results: response.data.results.map(formatMovieData)
      }
    };
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return { data: { results: [] } };
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genreType) => {
  try {
    const genreMap = {
      'trending': () => getTrendingMovies(),
      'netflix': () => getNetflixOriginals(),
      'toprated': () => getTopRatedMovies(),
      'action': () => tmdbApi.get('/discover/movie', { params: { with_genres: 28 } }),
      'comedy': () => tmdbApi.get('/discover/movie', { params: { with_genres: 35 } }),
      'horror': () => tmdbApi.get('/discover/movie', { params: { with_genres: 27 } }),
      'romance': () => tmdbApi.get('/discover/movie', { params: { with_genres: 10749 } }),
      'scifi': () => tmdbApi.get('/discover/movie', { params: { with_genres: 878 } }),
      'animation': () => tmdbApi.get('/discover/movie', { params: { with_genres: 16 } }),
      'documentary': () => tmdbApi.get('/discover/movie', { params: { with_genres: 99 } })
    };

    const fetchFunction = genreMap[genreType];
    if (!fetchFunction) {
      return await getTrendingMovies();
    }

    // Handle special cases that return formatted data
    if (['trending', 'netflix', 'toprated'].includes(genreType)) {
      return await fetchFunction();
    }

    // Handle genre-based queries
    const response = await fetchFunction();
    return {
      data: {
        results: response.data.results.map(formatMovieData)
      }
    };
  } catch (error) {
    console.error(`Error fetching ${genreType} movies:`, error);
    return { data: { results: [] } };
  }
};

// Search movies
export const searchMovies = async (query) => {
  try {
    if (!query.trim()) {
      return { data: { results: [] } };
    }

    const response = await tmdbApi.get('/search/multi', {
      params: {
        query: query.trim()
      }
    });

    return {
      data: {
        results: response.data.results.map(formatMovieData)
      }
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    return { data: { results: [] } };
  }
};

// Get featured movie for banner
export const getFeaturedMovie = async () => {
  try {
    const trendingMovies = await getTrendingMovies();
    const movies = trendingMovies.data.results;
    
    if (movies.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * Math.min(movies.length, 10));
    return movies[randomIndex];
  } catch (error) {
    console.error('Error fetching featured movie:', error);
    return null;
  }
};

// Get movie details by ID
export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos'
      }
    });

    const movie = response.data;
    return {
      ...formatMovieData(movie),
      runtime: movie.runtime,
      genres: movie.genres,
      credits: movie.credits,
      videos: movie.videos,
      tagline: movie.tagline,
      budget: movie.budget,
      revenue: movie.revenue
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};