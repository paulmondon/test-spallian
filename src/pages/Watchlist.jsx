import React, { useState } from 'react';
import Header from '../components/Header';
import { getWatchDetails, fetchWatchProviders } from '../api/moviesApi';
import ModalDetails from "../components/modalDetails"
import "../styles/watchlist.css"


function Watchlist() {
  const [showModal, setShowModal] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);

  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  const storedCriteria = JSON.parse(localStorage.getItem('criteria')) || {};

  const handleRemoveFromWatchlist = (movieId) => {
    const updatedWatchlist = watchlist.filter((movie) => movie.id !== movieId);
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
    window.location.reload();
  };

  const handleCardClick = async (id) => {
    const details = await getWatchDetails(storedCriteria, id);
    details.platforms = await fetchWatchProviders(storedCriteria, id);
    setMovieDetails(details);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="watchlist">
      <Header></Header>
      <h2>Vos Likes</h2>
      <div className="watchlist-movies">
        {watchlist.map((movie) => (
            <div className="watchlist-movie-card" >
              <div className="movie-image" onClick={() => handleCardClick(movie.id)}>
                <div className="image-overlay"></div>
                <div className='details'>
                  <div className="details-card">
                    <p>Année : {movie?.release_date?.substring(0, 4)}</p>
                  </div>
                  <div className="details-card">
                    <p>Note : {movie?.vote_average}/10</p>
                  </div>
                </div>
                <div className="title">
                  <h3>{movie.title || movie.name}</h3>
                </div>
                <div className='overview'>
                  <p>{movie.overview.substring(0, 60)}...</p>
                </div>
                <img src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`} alt={movie.title || movie.name} />
              </div>
              <button onClick={() => handleRemoveFromWatchlist(movie.id)}>Supprimer</button>
            </div>
        ))}
      </div>
      {showModal && <ModalDetails movie={movieDetails} onClose={handleCloseModal} />}
    </div>
  );
}

export default Watchlist;
