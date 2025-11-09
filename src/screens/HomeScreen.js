import { useState } from 'react';
import Banner from '../components/Banner';
import GenreSelector from '../components/GenreSelector';
import MovieModal from '../components/MovieModal';
import Nav from '../components/Nav';
import Row from '../components/Row';
import SearchBar from '../components/SearchBar';
import requests from '../Requests';
import './HomeScreen.css';

function HomeScreen({ user, onLogout }) {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getGenreRows = () => {
    const allRows = [
      { title: "NETFLIX ORIGINALS", fetchUrl: requests.fetchNetflixOriginals, isLargeRow: true },
      { title: "Trending Now", fetchUrl: requests.fetchTrending },
      { title: "Top Rated", fetchUrl: requests.fetchTopRated },
      { title: "Action Movies", fetchUrl: requests.fetchActionMovies, genre: 'action' },
      { title: "Comedy Movies", fetchUrl: requests.fetchComedyMovies, genre: 'comedy' },
      { title: "Horror Movies", fetchUrl: requests.fetchHorrorMovies, genre: 'horror' },
      { title: "Romance Movies", fetchUrl: requests.fetchRomanceMovies, genre: 'romance' },
      { title: "Sci-Fi Movies", fetchUrl: requests.fetchSciFiMovies, genre: 'scifi' },
      { title: "Animation", fetchUrl: requests.fetchAnimationMovies, genre: 'animation' },
      { title: "Documentaries", fetchUrl: requests.fetchDocumentaries, genre: 'documentary' },
    ];

    if (selectedGenre === 'all') {
      return allRows;
    }

    return allRows.filter(row => 
      !row.genre || row.genre === selectedGenre || 
      row.title === "NETFLIX ORIGINALS" || 
      row.title === "Trending Now"
    );
  };

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
          
          {getGenreRows().map((row, index) => (
            <Row
              key={index}
              title={row.title}
              fetchUrl={row.fetchUrl}
              isLargeRow={row.isLargeRow}
              onMovieClick={setSelectedMovie}
            />
          ))}
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