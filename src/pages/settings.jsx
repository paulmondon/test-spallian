import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { fetchCountries, fetchGenres } from '../api/moviesApi';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import "../styles/settings.css"

function Settings() {
    const navigate = useNavigate();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    const [criteria, setCriteria] = useState({
        selectedGenres: [],
        release_gte: "1986-01-01",
        relese_lte: formattedDate,
        platforms: [],
        country: "FR",
        contentType: 'movie'
    });

    const { data: countries, isLoading: countriesLoading, isError: countriesError } = useQuery('countries', fetchCountries);
    const { data: genres, isLoading: genresLoading, isError: genresError } = useQuery('genres', fetchGenres);

    const handleReleaseRangeChange = (values) => {
        const [releaseGte, releaseLte] = values;
        const formattedGte = `${releaseGte}-01-01`;
        const formattedLte = `${releaseLte}-12-31`;

        setCriteria((prevCriteria) => ({
            ...prevCriteria,
            release_gte: formattedGte,
            release_lte: formattedLte,
        }));
    };
    const handleInputChange = (e) => {
        const { name, value, type, checked, options } = e.target;

        const inputValue = type === 'checkbox' ? (checked ? value : criteria[name].filter(val => val !== value)) : value;
        const updatedCriteria = {
            ...criteria,
            [name]: type === 'select-multiple' ? Array.from(options).filter(option => option.selected).map(option => option.value) : inputValue,
        };

        setCriteria(updatedCriteria);
    };
    const handlePlatformChange = (e, platform) => {
        const isChecked = e.target.checked;

        setCriteria((prevCriteria) => ({
            ...prevCriteria,
            platforms: isChecked
                ? [...prevCriteria.platforms, platform]
                : prevCriteria.platforms.filter((p) => p !== platform),
        }));
    };

    const handleGenreChange = (e, selectedGenre) => {
        const isChecked = e.target.checked;

        setCriteria((prevCriteria) => ({
            ...prevCriteria,
            selectedGenres: isChecked
                ? [...prevCriteria.selectedGenres, selectedGenre]
                : prevCriteria.selectedGenres.filter((p) => p !== selectedGenre),
        }));
    };

    const handleToggleChange = (contentType) => {
        setCriteria((prevCriteria) => ({
            ...prevCriteria,
            contentType,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('criteria', JSON.stringify(criteria));
        navigate("/random")
        window.location.reload();
    };


    if (countriesLoading) return <p>Loading countries...</p>;
    if (countriesError) return <p>Error fetching countries</p>;

    if (genresLoading) return <p>Loading genres...</p>;
    if (genresError) return <p>Error fetching genres</p>;

    return (
        <div>
            <Header></Header>
            <div className='settings-container'>
                <h2 className='section-title'>On regarde quoi ce soir ?</h2>
                <form className='section-form' onSubmit={handleSubmit}>
                    <div className='section'>
                        <h3 className='section-title'>Pays</h3>
                        <div className='card'>
                            <select
                                id="country"
                                name="country"
                                value={criteria.country}
                                onChange={handleInputChange}
                                className='input-select'
                            >
                                {countries
                                    .slice()
                                    .sort((a, b) => a.native_name.localeCompare(b.native_name))
                                    .map((country) => (
                                        <option key={country.iso_3166_1} value={country.iso_3166_1}>
                                            {country.native_name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>



                    <div className='section'>
                        <h3 className='section-title'>Plateformes</h3>
                        <div className='checkbox-list'>
                            <label className='checkbox-label'>
                                <input
                                    className='checkbox-input'
                                    type="checkbox"
                                    name="platforms"
                                    value="8"
                                    checked={criteria.platforms.includes('8')}
                                    onChange={(e) => handlePlatformChange(e, '8')}
                                />
                                Netflix
                            </label>
                            <label className='checkbox-label'>
                                <input
                                    className='checkbox-input'
                                    type="checkbox"
                                    name="platforms"
                                    value="119"
                                    checked={criteria.platforms.includes('119')}
                                    onChange={(e) => handlePlatformChange(e, '119')}
                                />
                                Amazon Prime Video
                            </label>
                            <label className='checkbox-label'>
                                <input
                                    className='checkbox-input'
                                    type="checkbox"
                                    name="platforms"
                                    value="337"
                                    checked={criteria.platforms.includes('337')}
                                    onChange={(e) => handlePlatformChange(e, '337')}
                                />
                                Disney+
                            </label>
                        </div>
                    </div>



                    <div className='section'>
                        <h3 className='section-title'>Séries/Film</h3>
                        <div>
                            <button
                                type="button"
                                className={`toggle-button ${criteria.contentType === 'tv' ? 'active' : ''}`}
                                onClick={() => handleToggleChange('tv')}
                            >
                                Séries
                            </button>
                            <button
                                type="button"
                                className={`toggle-button ${criteria.contentType === 'movie' ? 'active' : ''}`}
                                onClick={() => handleToggleChange('movie')}
                            >
                                Film
                            </button>

                        </div>
                    </div>


                    <div className="section">
                        <h3 className='section-title'>Date de sortie</h3>
                        <div className='card'>
                            <Slider range
                                min={1953}
                                max={year}
                                marks={{ 1953: '1953', [year]: year }}
                                value={[
                                    criteria.release_gte ? new Date(criteria.release_gte).getFullYear() : 1953,
                                    criteria.release_lte ? new Date(criteria.release_lte).getFullYear() : year
                                ]}
                                onChange={handleReleaseRangeChange}
                                trackStyle={[{ backgroundColor: '#ccc' }]}
                                handleStyle={[{ backgroundColor: '#ab1313', borderColor: '#ab1313' }, { backgroundColor: '#ab1313', borderColor: '#ab1313' }]}
                            />
                            <div className="slider-values">
                                <span className="slider-value">{criteria.release_gte ? new Date(criteria.release_gte).getFullYear() : '1900'}-</span>
                                <span className="slider-value">{criteria.release_lte ? new Date(criteria.release_lte).getFullYear() : year}</span>
                            </div>
                        </div>
                    </div>

                    <div className='section'>
                        <h3 className='section-title'>Genre</h3>
                        <div className='checkbox-list'>
                            {genres.map((genre) => (
                                <label className='checkbox-label'>
                                    <input
                                        className='checkbox-input'
                                        type="checkbox"
                                        name="selectedGenres"
                                        value={genre.id}
                                        checked={criteria.selectedGenres.includes(genre.id)}
                                        onChange={(e) => handleGenreChange(e, genre.id)}
                                    />
                                    {genre.name}
                                </label>
                            ))}
                        </div>
                    </div>




                    <button className='submit-button' type="submit">C'est parti !</button>
                </form>
            </div>
        </div>
    );
}

export default Settings;
