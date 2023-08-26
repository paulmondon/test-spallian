import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getRandomWatch, getWatchDetails, fetchWatchProviders } from '../api/moviesApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTimes } from '@fortawesome/free-solid-svg-icons';
import ModalDetails from "../components/modalDetails"
import AnimationLoading from '../components/AnimationLoading';
import Header from '../components/Header';
import "../styles/randomMovie.css"

function RandomMovie() {
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [isDisliking, setIsDisliking] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [movieDetails, setMovieDetails] = useState(null);

    const storedCriteria = JSON.parse(localStorage.getItem('criteria')) || {};
    const handleAddToWatchlist = async (movie) => {
        const existingWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        const updatedWatchlist = [...existingWatchlist, movie];
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));

        queryClient.invalidateQueries('watchlist');
        refetch();
    };

    useEffect(() => {
        localStorage.setItem('criteria', JSON.stringify(storedCriteria));
    }, [storedCriteria]);


    const isInLocalStorageWatchlist = (movie) => {
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        return watchlist.some((item) => item.id === movie.id);
    };

    const handleDislike = () => {
        refetch();
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const { data: movie, isLoading, isError, refetch, isFetching } = useQuery('randomMovie', () => getRandomWatch(storedCriteria), {
        staleTime: 30000000,
    });

    const handleCardClick = async () => {
        const details = await getWatchDetails(storedCriteria, movie.id);
        details.platforms = await fetchWatchProviders(storedCriteria, movie.id);
        setMovieDetails(details);
        setShowModal(true);
    };

    if (isLoading) return <AnimationLoading></AnimationLoading>;
    if (isError) return <p>Error fetching data</p>;

    return (
        <div className="random-movie">
            <Header />
            {isFetching ? (
                <AnimationLoading />
            ) : (
                <div className="movie-details">
                    {movie ? (
                        <div className="movie-card" >
                            <div className="movie-image" onClick={handleCardClick}>
                                <div className="image-overlay"></div>
                                <div className='details'>
                                    <div className="details-card">
                                        <p>Année : {movie?.release_date?.substring(0, 4) || movie?.first_air_date?.substring(0, 4)}</p>
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
                            <div className="add-to-watchlist">
                                {isInLocalStorageWatchlist(movie) ? (
                                    <div>
                                        <span>Ajouté</span>
                                    </div>
                                ) : (
                                    <div>
                                        <button onClick={handleDislike} disabled={isDisliking} className="dislike-button circle-button">
                                            <FontAwesomeIcon icon={faTimes} className="icon dislike-icon" />
                                        </button>
                                        <button onClick={() => handleAddToWatchlist(movie)} disabled={isAdding} className="like-button circle-button">
                                            <FontAwesomeIcon icon={faHeart} className="icon like-icon" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>Pas de film avec ces paramètres.</p>
                    )}
                </div>
            )}
            {showModal && <ModalDetails movie={movieDetails} onClose={handleCloseModal} />}
        </div>
    );
}

export default RandomMovie;
