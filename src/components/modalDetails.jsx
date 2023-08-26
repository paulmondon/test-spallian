    import React from 'react';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faTimes } from '@fortawesome/free-solid-svg-icons';
    import platformLogos from './platformLogo';
    import StarRating from './starRating';
    import '../styles/modalDetails.css';

    function ModalDetails({ movie, onClose }) {
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <img src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`} alt={movie.title} className="modal-poster" />
                    <div className="modal-info">
                        <button className="close-button" onClick={onClose}>
                            <FontAwesomeIcon icon={faTimes} className="close-icon" />
                        </button>
                        <h2 className="modal-title">{movie.title || movie.name} ({(movie.release_date && movie.release_date.slice(0, 4) || (movie.first_air_date && movie.first_air_date.slice(0, 4)))})</h2>
                        <div className="star-rating">
                            <StarRating rating={movie.vote_average} />
                            <p className="score">{movie.vote_average}/10</p>
                        </div>
                        <div className="modal-platforms">
                            {movie.platforms?.map((platform) => (
                                <div
                                    key={platform.provider_id}
                                    className={`platform ${platform.provider_name.toLowerCase().replace(/\s+/g, '-')}-platform`}
                                >
                                    <img src={platformLogos[platform.provider_name]} alt={platform.provider_name} />
                                    <h3>{platform.provider_name}</h3>
                                </div>
                            ))}
                        </div>
                        <div className="modal-genres">
                            {movie.genres?.map((genre) => (
                                <div key={genre.id} className="genre">
                                    {genre.name}
                                </div>
                            ))}
                        </div>
                        <p className="modal-overview">{movie.overview}</p>
                    </div>
                </div>
            </div>
        );
    }

    export default ModalDetails;