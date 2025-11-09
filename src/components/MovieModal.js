import { useEffect, useState } from 'react';
import { addToMyList, isInMyList, removeFromMyList } from '../utils/myListStorage';
import './MovieModal.css';

function MovieModal({ movie, onClose, onMyListUpdate }) {
  const [inMyList, setInMyList] = useState(false);

  useEffect(() => {
    if (movie) {
      setInMyList(isInMyList(movie.id));
    }
  }, [movie]);

  const handleMyListToggle = () => {
    if (inMyList) {
      removeFromMyList(movie.id);
      setInMyList(false);
    } else {
      addToMyList(movie);
      setInMyList(true);
    }
    
    // Notify parent component about My List update
    if (onMyListUpdate) {
      onMyListUpdate();
    }
  };
  if (!movie) return null;

  return (
    <div className="movieModal" onClick={onClose}>
      <div className="movieModal__content" onClick={(e) => e.stopPropagation()}>
        <button className="movieModal__close" onClick={onClose}>
          ✕
        </button>
        
        <div className="movieModal__header">
          <img
            className="movieModal__backdrop"
            src={movie.backdrop_path || movie.poster_path || 'https://images.unsplash.com/photo-1489599735734-79b4af9593ea?w=800&h=450&fit=crop'}
            alt={movie.title || movie.name}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1489599735734-79b4af9593ea?w=800&h=450&fit=crop';
            }}
          />
          <div className="movieModal__headerContent">
            <h1 className="movieModal__title">
              {movie.title || movie.name || movie.original_name}
            </h1>
            <div className="movieModal__buttons">
              <button className="movieModal__playButton">
                ▶ Play
              </button>
              <button 
                className={`movieModal__addButton ${inMyList ? 'movieModal__addButton--added' : ''}`}
                onClick={handleMyListToggle}
              >
                {inMyList ? '✓ In My List' : '+ My List'}
              </button>
            </div>
          </div>
        </div>

        <div className="movieModal__info">
          <div className="movieModal__details">
            <div className="movieModal__rating">
              ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10
            </div>
            {movie.release_date && (
              <div className="movieModal__year">
                {new Date(movie.release_date).getFullYear()}
              </div>
            )}
            {movie.popularity && (
              <div className="movieModal__popularity">
                Popularity: {Math.round(movie.popularity)}
              </div>
            )}
          </div>
          
          <div className="movieModal__overview">
            <h3>Overview</h3>
            <p>{movie.overview}</p>
          </div>

          <div className="movieModal__cast">
            <h3>Cast & Crew</h3>
            {movie.director && <p><strong>Director:</strong> {movie.director}</p>}
            {movie.actors && <p><strong>Starring:</strong> {movie.actors}</p>}
            {movie.runtime && <p><strong>Runtime:</strong> {movie.runtime}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;