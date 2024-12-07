import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RingLoader from 'react-spinners/ClipLoader';
import MovieCard from './MovieCard';

export default function MoviesFilterResults() {
  const { id } = useParams();
  const [moviesByGenre, setMoviesByGenre] = useState([]);
  const [genreName, setGenreName] = useState('Movies');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Ensure loader shows during new fetch
    axios
      .get(`http://localhost:8000/api/genres/${id}`)
      .then((response) => {
        console.log(response.data.data.movies);
        setMoviesByGenre(response.data.data.movies);
        setGenreName(response.data.data.genreName);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [id]); // Runs when `id` changes

  if (loading)
    return (
      <div
        className="spinner-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', // Adjust for better full-page experience
        }}
      >
        <RingLoader color="#007bff" loading={loading} size={100} />
      </div>
    );

  return (
    <div className="movies-list">
      <h2>{genreName}</h2>
      <br />
      <div className="grid-list">
        {moviesByGenre.length > 0 ? (
          moviesByGenre.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <p>No Movies Found!</p>
        )}
      </div>
    </div>
  );
}
