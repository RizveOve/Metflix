import { useState } from 'react';
import { searchMovies } from '../api/movieApi';
import './SearchBar.css';

function SearchBar({ onSearchResults }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await searchMovies(query.trim());
      onSearchResults(results.data.results, query.trim());
    } catch (error) {
      console.error('Search error:', error);
      onSearchResults([], query.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="searchBar">
      <form onSubmit={handleSearch} className="searchBar__form">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="searchBar__input"
        />
        <button type="submit" disabled={loading} className="searchBar__button">
          {loading ? '...' : '🔍'}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;