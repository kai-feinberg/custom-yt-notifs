// /components/SearchForm.js
"use client";
import { useState } from 'react';

const SearchForm = () => {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    setError('');
    setVideos([]);

    try {
      // Send a GET request to your API route with the search query
      const res = await fetch(`/api/youtube?q=${query}`);
      if (!res.ok) {
        throw new Error('Failed to fetch videos');
      }
      
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for YouTube videos"
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {videos.length > 0 && (
          <ul>
            {videos.map((video) => (
              <li key={video.id}>
                <h3>{video.title}</h3>
                <img src={video.thumbnail} alt={video.title} />
                <p>{video.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchForm;
