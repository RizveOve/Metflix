import { useEffect, useState } from 'react';
import { getFeaturedMovie } from '../api/movieApi';
import './Banner.css';

function Banner() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMovie = async () => {
      try {
        const featuredMovie = await getFeaturedMovie();
        setMovie(featuredMovie);
      } catch (error) {
        console.error('Error fetching featured movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMovie();
  }, []);

  function truncate(string, n) {
    return string?.length > n ? string.substr(0, n - 1) + '...' : string;
  }

  return (
    <header
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: movie?.backdrop_path ? `url("${movie.backdrop_path}")` : `linear-gradient(45deg, #141414, #333333, #1a1a1a)`,
        backgroundPosition: "center center",
      }}
    >
      <div className="banner__contents">
        {loading ? (
          <div className="banner__loading">
            <h1>Loading...</h1>
          </div>
        ) : (
          <>
            <h1 className="banner__title">
              {movie?.title || movie?.name || movie?.original_name}
            </h1>
            <div className="banner__buttons">
              <button className="banner__button">Play</button>
              <button className="banner__button">My List</button>
            </div>
            <h1 className="banner__description">
              {truncate(
                `${movie?.overview}`,
                150
              )}
            </h1>
          </>
        )}
      </div>

      <div className="banner--fadeBottom" />
    </header>
  );
}

export default Banner;