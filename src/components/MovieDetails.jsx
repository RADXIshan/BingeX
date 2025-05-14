import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../services/api';
import { connectToStream } from '../services/streaming';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streamUrl, setStreamUrl] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    getMovieDetails(id).then(data => {
      setMovie(data);
      setLoading(false);
    });
    return () => {
      if (ws) ws.close();
    };
  }, [id]);

  const handleWatchNow = () => {
    const websocket = connectToStream((data) => {
      if (data.type === 'video') {
        setStreamUrl(data.url);
      }
    });
    setWs(websocket);
  };

  if (loading) return <div>Loading...</div>;
  if (!movie) return <div>Movie not found.</div>;

  return (
    <div className="movie-details">
      <div className="movie-details-left">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        <h2>{movie.title}</h2>
      </div>
      <div className="movie-details-right">
        <p>{movie.overview}</p>
        <button onClick={handleWatchNow}>Watch Now</button>
        {streamUrl && (
          <video src={streamUrl} controls autoPlay style={{ width: '100%', marginTop: '1rem' }} />
        )}
      </div>
    </div>
  );
}

export default MovieDetails;