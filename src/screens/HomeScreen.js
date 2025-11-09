import { useState } from 'react';
import Banner from '../components/Banner';
import GenreSelector from '../components/GenreSelector';
import MovieGrid from '../components/MovieGrid';
import MovieModal from '../components/MovieModal';
import Nav from '../components/Nav';
import Row from '../components/Row';
import SearchBar from '../components/SearchBar';
import './HomeScreen.css';

function HomeScreen({ user, onLogout }) {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getAllRows = () => [
    { title: "METFLIX ORIGINALS", genre: 'netflix', isLargeRow: true },
    { title: "Trending Now", genre: 'trending' },
    { title: "Top Rated", genre: 'toprated' },
    { title: "Action Movies", genre: 'action' },
    { title: "Comedy Movies", genre: 'comedy' },
    { title: "Horror Movies", genre: 'horror' },
    { title: "Romance Movies", genre: 'romance' },
    { title: "Sci-Fi Movies", genre: 'scifi' },
    { title: "Animation", genre: 'animation' },
    { title: "Documentaries", genre: 'documentary' },
  ];

  const handleSearchResults = (results, query) => {
    setSearchResults(results);
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchResults(null);
    setSearchQuery('');
  };

  return (
    <div className="homeScreen">
      <Nav user={user} onLogout={onLogout} />
      <Banner />
      <SearchBar onSearchResults={handleSearchResults} />
      
      {searchResults ? (
        <div className="homeScreen__searchResults">
          <div className="searchResults__header">
            <h2>Search Results for "{searchQuery}"</h2>
            <button onClick={clearSearch} className="searchResults__clear">
              ← Back to Browse
            </button>
          </div>
          <Row
            title={`Found ${searchResults.length} results`}
            movies={searchResults}
            isLargeRow={false}
            onMovieClick={setSelectedMovie}
          />
        </div>
      ) : (
        <>
          <GenreSelector 
            onGenreSelect={setSelectedGenre} 
            selectedGenre={selectedGenre} 
          />
          
          {selectedGenre === 'all' ? (
            // Show all rows when "All" is selected
            getAllRows().map((row, index) => (
              <Row
                key={`${row.genre}-${index}`}
                title={row.title}
                genre={row.genre}
                isLargeRow={row.isLargeRow}
                onMovieClick={setSelectedMovie}
              />
            ))
          ) : (
            // Show filtered movie grid when specific genre is selected
            <MovieGrid 
              selectedGenre={selectedGenre}
              onMovieClick={setSelectedMovie}
            />
          )}
        </>
      )}
      
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
}

export default HomeScreen;