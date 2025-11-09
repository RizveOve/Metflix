import './GenreSelector.css';

function GenreSelector({ onGenreSelect, selectedGenre }) {
  const genres = [
    { id: 'all', name: 'All' },
    { id: 'action', name: 'Action' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'horror', name: 'Horror' },
    { id: 'romance', name: 'Romance' },
    { id: 'scifi', name: 'Sci-Fi' },
    { id: 'animation', name: 'Animation' },
    { id: 'documentary', name: 'Documentary' },
  ];

  return (
    <div className="genreSelector">
      <h2>Browse by Genre</h2>
      <div className="genreSelector__buttons">
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`genreSelector__button ${
              selectedGenre === genre.id ? 'active' : ''
            }`}
            onClick={() => onGenreSelect(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GenreSelector;