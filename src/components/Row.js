import { useEffect, useState } from 'react';
import { getMoviesByGenre } from '../api/movieApi';
import './Row.css';

function Row({ title, fetchUrl, isLargeRow = false, onMovieClick, movies: propMovies }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If movies are passed as props (for search results), use them directly
    if (propMovies) {
      setMovies(propMovies);
      setLoading(false);
      return;
    }

    const fetchMovies = async () => {
      try {
        console.log(`Fetching movies for: ${title}`);
        let movieData;
        
        if (title.includes('NETFLIX ORIGINALS')) {
          movieData = await getMoviesByGenre('netflix');
        } else if (title.includes('Trending')) {
          movieData = await getMoviesByGenre('trending');
        } else if (title.includes('Top Rated')) {
          movieData = await getMoviesByGenre('toprated');
        } else if (title.includes('Action')) {
          movieData = await getMoviesByGenre('action');
        } else if (title.includes('Comedy')) {
          movieData = await getMoviesByGenre('comedy');
        } else if (title.includes('Horror')) {
          movieData = await getMoviesByGenre('horror');
        } else if (title.includes('Romance')) {
          movieData = await getMoviesByGenre('romance');
        } else if (title.includes('Sci-Fi')) {
          movieData = await getMoviesByGenre('scifi');
        } else if (title.includes('Animation')) {
          movieData = await getMoviesByGenre('animation');
        } else if (title.includes('Documentaries')) {
          movieData = await getMoviesByGenre('documentary');
        } else {
          movieData = await getMoviesByGenre('trending');
        }
        
        console.log(`Received ${movieData.data.results.length} movies for ${title}:`, movieData.data.results);
        setMovies(movieData.data.results);
      } catch (error) {
        console.error(`Error fetching movies for ${title}:`, error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [title, propMovies]);

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row__posters">
        {loading ? (
          <div className="row__loading">Loading movies...</div>
        ) : (
          movies.map((movie) => (
            <div key={movie.id} className="row__posterContainer">
              <img
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                src={
                  isLargeRow 
                    ? (movie.poster_path || movie.backdrop_path || `https://images.unsplash.com/photo-1489599735734-79b4af9593ea?w=300&h=450&fit=crop`)
                    : (movie.backdrop_path || movie.poster_path || `https://images.unsplash.com/photo-1489599735734-79b4af9593ea?w=800&h=450&fit=crop`)
                }
                alt={movie.title || movie.name || movie.original_name}
                onClick={() => onMovieClick && onMovieClick(movie)}
                onError={(e) => {
                  e.target.src = `https://images.unsplash.com/photo-1489599735734-79b4af9593ea?w=${isLargeRow ? '300' : '800'}&h=450&fit=crop`;
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Row;