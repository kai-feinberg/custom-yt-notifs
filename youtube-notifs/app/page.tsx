// /components/SearchForm.js
"use client";
import { useState } from 'react';

const SearchForm = () => {
  const [query, setQuery] = useState('');
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();

    setError('');
    setChannels([]);

    try {
      // Send a GET request to your API route with the search query
      const res = await fetch(`/api/youtube/channels?q=${query}`);
      if (!res.ok) {
        throw new Error('Failed to fetch channels');
      }

      const data = await res.json();
      setChannels(data);
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
          placeholder="Search for YouTube channels"
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {channels.length > 0 && (
          <ul>
            {channels.map((channel) => (
              <li key={channel.id}>
                <h3>{channel.title}</h3>
                <p> {channel.id}</p>
                <img src={channel.thumbnail} alt={channel.title} />
                <p>{channel.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchForm;
