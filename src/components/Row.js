import { useEffect, useState } from "react";
import { getMoviesByGenreLegacy } from "../api/movieApi";
import "./Row.css";

function Row({
  title,
  genre,
  isLargeRow = false,
  onMovieClick,
  movies: propMovies,
}) {
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
      setLoading(true);
      try {
        const movieData = await getMoviesByGenreLegacy(genre || "trending");
        setMovies(movieData.data.results);
      } catch (error) {
        console.error(`Error fetching movies for ${title}:`, error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [title, genre, propMovies]);

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
                    ? movie.poster_path ||
                      movie.backdrop_path ||
                      `https://images.unsplash.com/photo-1489599735734-79b4af9593ea?w=300&h=450&fit=crop`
                    : movie.backdrop_path ||
                      movie.poster_path ||
                      `https://images.unsplash.com/photo-1489599735734-79b4af9593ea?w=800&h=450&fit=crop`
                }
                alt={movie.title || movie.name || movie.original_name}
                onClick={() => onMovieClick && onMovieClick(movie)}
                onError={(e) => {
                  e.target.src = `https://images.unsplash.com/photo-1489599735734-79b4af9593ea?w=${
                    isLargeRow ? "300" : "800"
                  }&h=450&fit=crop`;
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
