import { useEffect, useState } from 'react';
import { getMoviesByGenre } from '../api/movieApi';
import './MovieGrid.css';

function MovieGrid({ selectedGenre, onMovieClick }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching movies for genre: ${selectedGenre}`);
        const movieData = await getMoviesByGenre(selectedGenre);
        console.log(`Received ${movieData.data.results.length} movies for ${selectedGenre}`);
        setMovies(movieData.data.results);
      } catch (err) {
        console.error(`Error fetching movies for ${selectedGenre}:`, err);
        setError('Failed to load movies. Please try again.');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre]);

  const getGenreTitle = (genre) => {
    const titleMap = {
      'all': 'Popular Movies',
      'action': 'Action Movies',
      'comedy': 'Comedy Movies', 
      'horror': 'Horror Movies',
      'romance': 'Romance Movies',
      'scifi': 'Sci-Fi Movies',
      'animation': 'Animation Movies',
      'documentary': 'Documentary Movies'
    };
    return titleMap[genre] || 'Movies';
  };

  if (loading) {
    return (
      <div className="movieGrid">
        <h2 className="movieGrid__title">{getGenreTitle(selectedGenre)}</h2>
        <div className="movieGrid__loading">
          <div className="loading-spinner"></div>
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movieGrid">
        <h2 className="movieGrid__title">{getGenreTitle(selectedGenre)}</h2>
        <div className="movieGrid__error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movieGrid">
      <h2 className="movieGrid__title">{getGenreTitle(selectedGenre)}</h2>
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