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
  const [selectedSection, setSelectedSection] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [myListUpdateTrigger, setMyListUpdateTrigger] = useState(0);

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

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    setSelectedGenre('all'); // Reset genre when switching sections
    clearSearch(); // Clear search when switching sections
  };

  const handleMyListUpdate = () => {
    // Trigger re-render of My List when items are added/removed
    setMyListUpdateTrigger(prev => prev + 1);
  };

  return (
    <div className="homeScreen">
      <Nav 
        user={user} 
        onLogout={onLogout} 
        activeSection={selectedSection}
        onSectionChange={handleSectionChange}
      />
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
          {selectedSection === 'home' ? (
            <>
              <GenreSelector 
                onGenreSelect={setSelectedGenre} 
                selectedGenre={selectedGenre} 
              />
              
              {selectedGenre === 'all' ? (
                // Show all rows when "All" is selected on Home
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
          ) : (
            // Show content based on navbar section
            <MovieGrid 
              selectedSection={selectedSection}
              onMovieClick={setSelectedMovie}
              key={`${selectedSection}-${myListUpdateTrigger}`} // Force re-render for My List updates
            />
          )}
        </>
      )}
      
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)}
          onMyListUpdate={handleMyListUpdate}
        />
      )}
    </div>
  );
}

export default HomeScreen;