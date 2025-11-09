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

// Get popular movies (for "All" genre)
export const getPopularMovies = async () => {
  try {
    const response = await tmdbApi.get('/movie/popular');
    return {
      data: {
        results: response.data.results.map(formatMovieData)
      }
    };
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return { data: { results: [] } };
  }
};

// Get movies by genre with proper TMDB genre IDs
export const getMoviesByGenre = async (genreType) => {
  try {
    // TMDB Genre ID mapping
    const genreMap = {
      'all': () => getPopularMovies(),
      'action': () => tmdbApi.get('/discover/movie', { params: { with_genres: 28, sort_by: 'popularity.desc' } }),
      'comedy': () => tmdbApi.get('/discover/movie', { params: { with_genres: 35, sort_by: 'popularity.desc' } }),
      'horror': () => tmdbApi.get('/discover/movie', { params: { with_genres: 27, sort_by: 'popularity.desc' } }),
      'romance': () => tmdbApi.get('/discover/movie', { params: { with_genres: 10749, sort_by: 'popularity.desc' } }),
      'scifi': () => tmdbApi.get('/discover/movie', { params: { with_genres: 878, sort_by: 'popularity.desc' } }),
      'animation': () => tmdbApi.get('/discover/movie', { params: { with_genres: 16, sort_by: 'popularity.desc' } }),
      'documentary': () => tmdbApi.get('/discover/movie', { params: { with_genres: 99, sort_by: 'popularity.desc' } })
    };

    const fetchFunction = genreMap[genreType];
    if (!fetchFunction) {
      return await getPopularMovies();
    }

    // Handle special case for "all"
    if (genreType === 'all') {
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

// Legacy function for backward compatibility (used by existing rows)
export const getMoviesByGenreLegacy = async (genreType) => {
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

// Get TV shows
export const getTVShows = async () => {
  try {
    const response = await tmdbApi.get('/tv/popular');
    return {
      data: {
        results: response.data.results.map(formatMovieData)
      }
    };
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return { data: { results: [] } };
  }
};

// Get now playing movies
export const getNowPlayingMovies = async () => {
  try {
    const response = await tmdbApi.get('/movie/now_playing');
    return {
      data: {
        results: response.data.results.map(formatMovieData)
      }
    };
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    return { data: { results: [] } };
  }
};

// Get airing today TV shows
export const getAiringTodayTV = async () => {
  try {
    const response = await tmdbApi.get('/tv/airing_today');
    return {
      data: {
        results: response.data.results.map(formatMovieData)
      }
    };
  } catch (error) {
    console.error('Error fetching airing today TV:', error);
    return { data: { results: [] } };
  }
};

// Get daily trending
export const getDailyTrending = async () => {
  try {
    const response = await tmdbApi.get('/trending/all/day');
    return {
      data: {
        results: response.data.results.map(formatMovieData)
      }
    };
  } catch (error) {
    console.error('Error fetching daily trending:', error);
    return { data: { results: [] } };
  }
};

// Get content by navbar section
export const getContentBySection = async (section) => {
  try {
    switch (section) {
      case 'home':
        // Combine trending and popular for home
        const [trending, popular] = await Promise.all([
          getTrendingMovies(),
          getPopularMovies()
        ]);
        return {
          data: {
            results: [...trending.data.results.slice(0, 10), ...popular.data.results.slice(0, 10)]
          }
        };
      
      case 'tv-shows':
        return await getTVShows();
      
      case 'movies':
        return await getPopularMovies();
      
      case 'new-popular':
        // Combine daily trending, now playing, and airing today
        const [dailyTrending, nowPlaying, airingToday] = await Promise.all([
          getDailyTrending(),
          getNowPlayingMovies(),
          getAiringTodayTV()
        ]);
        return {
          data: {
            results: [
              ...dailyTrending.data.results.slice(0, 8),
              ...nowPlaying.data.results.slice(0, 6),
              ...airingToday.data.results.slice(0, 6)
            ]
          }
        };
      
      default:
        return await getPopularMovies();
    }
  } catch (error) {
    console.error(`Error fetching content for ${section}:`, error);
    return { data: { results: [] } };
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