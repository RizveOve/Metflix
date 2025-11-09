import { useEffect, useState } from 'react';
import { getContentBySection, getMoviesByGenre } from '../api/movieApi';
import { getMyList } from '../utils/myListStorage';
import './MovieGrid.css';

function MovieGrid({ selectedGenre, selectedSection, onMovieClick }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let movieData;
        
        if (selectedSection === 'my-list') {
          // Get movies from localStorage for My List
          const myListMovies = getMyList();
          movieData = { data: { results: myListMovies } };
        } else if (selectedSection) {
          // Fetch content based on navbar section
          movieData = await getContentBySection(selectedSection);
        } else {
          // Fetch content based on genre (existing functionality)
          movieData = await getMoviesByGenre(selectedGenre);
        }
        
        setMovies(movieData.data.results);
      } catch (err) {
        console.error(`Error fetching content:`, err);
        setError('Failed to load content. Please try again.');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre, selectedSection]);

  const getTitle = () => {
    if (selectedSection) {
      const sectionTitleMap = {
        'home': 'Home - Trending & Popular',
        'tv-shows': 'TV Shows',
        'movies': 'Movies',
        'new-popular': 'New & Popular',
        'my-list': 'My List'
      };
      return sectionTitleMap[selectedSection] || 'Content';
    }
    
    const genreTitleMap = {
      'all': 'Popular Movies',
      'action': 'Action Movies',
      'comedy': 'Comedy Movies', 
      'horror': 'Horror Movies',
      'romance': 'Romance Movies',
      'scifi': 'Sci-Fi Movies',
      'animation': 'Animation Movies',
      'documentary': 'Documentary Movies'
    };
    return genreTitleMap[selectedGenre] || 'Movies';
  };

  if (loading) {
    return (
      <div className="movieGrid">
        <h2 className="movieGrid__title">{getTitle()}</h2>
        <div className="movieGrid__loading">
          <div className="loading-spinner"></div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movieGrid">
        <h2 className="movieGrid__title">{getTitle()}</h2>
        <div className="movieGrid__error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (selectedSection === 'my-list' && movies.length === 0) {
    return (
      <div className="movieGrid">
        <h2 className="movieGrid__title">{getTitle()}</h2>
        <div className="movieGrid__empty">
          <p>Your list is empty. Add some movies and TV shows to see them here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movieGrid">
      <h2 className="movieGrid__title">{getTitle()}</h2>
      <div className="movieGrid__container">
        {movies.map((movie) => (
          <div 
            key={movie.id} 
            className="movieGrid__item"
            onClick={() => onMovieClick && onMovieClick(movie)}
          >
            <img
              className="movieGrid__poster"
              src={
                movie.poster_path || 
                movie.backdrop_path || 
                'https://images.unsplash.com/photo-1489599735734-79b4af9593ea?w=300&h=450&fit=crop'
              }
              alt={movie.title || movie.name || movie.original_name}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1489599735734-79b4af9593ea?w=300&h=450&fit=crop';
              }}
            />
            <div className="movieGrid__info">
              <h3 className="movieGrid__movieTitle">
                {movie.title || movie.name || movie.original_name}
              </h3>
              <div className="movieGrid__rating">
                ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieGrid;