import axios from 'axios';

const API_KEY = '2167f010e51bd41148fc7f5b893ce70b';
const BASE_URL = 'https://api.themoviedb.org/3';

export async function getRandomWatch(criteria) {
  try {
    const response = await axios.get(`${BASE_URL}/discover/${criteria.contentType}`, {
      params: {
        api_key: API_KEY,
        language: 'fr-FR',
        page: Math.floor(Math.random() * 500) + 1,
        with_genres: criteria.selectedGenres ? criteria.selectedGenres.join('|') : null,
        "vote_average.gte": criteria.vote_gte ? criteria.vote_gte : null,
        "primary_release_date.gte": criteria.release_gte,
        "primary_release_date.lte": criteria.release_lte,
        watch_region: criteria.country,
        with_watch_providers: criteria.platforms ? criteria.platforms.join("|") : null,
      },
    });

    let totalPages = response.data.total_pages;
    if (totalPages > 500) {
      totalPages = 500;
    }

    while (true) {
      const randomPage = Math.floor(Math.random() * totalPages) + 1;
      const response = await axios.get(`${BASE_URL}/discover/${criteria.contentType}`, {
        params: {
          api_key: API_KEY,
          language: 'fr-FR',
          page: randomPage,
          with_genres: criteria.selectedGenres ? criteria.selectedGenres.join('|') : null,
          "vote_average.gte": criteria.vote_gte ? criteria.vote_gte : null,
          "primary_release_date.gte": criteria.release_gte,
          "primary_release_date.lte": criteria.release_lte,
          watch_region: criteria.country,
          with_watch_providers: criteria.platforms ? criteria.platforms.join("|") : null,
        },
      });

      if (response.data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * response.data.results.length);
        const randomMovie = response.data.results[randomIndex];
        return randomMovie;
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching random movie:', error);
    return null;
  }
}



export async function getWatchDetails(criteria, id) {
  try {
    const response = await axios.get(`${BASE_URL}/${criteria.contentType}/${id}`, {
      params: {
        api_key: API_KEY,
        language: 'fr-FR',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

export async function fetchWatchProviders(criteria, id) {
  try {
    const response = await axios.get(`${BASE_URL}/${criteria.contentType}/${id}/watch/providers`, {
      params: {
        api_key: API_KEY,
      },
    });
    const platforms = [];
    const countryData = response.data.results[criteria.country];

    if (countryData) {
      const netflix = countryData.flatrate.find(provider => provider.provider_name === 'Netflix');
      const amazonPrime = countryData.flatrate.find(provider => provider.provider_name === 'Amazon Prime Video');
      const disneyPlus = countryData.flatrate.find(provider => provider.provider_name === 'Disney Plus');

      if (netflix) platforms.push(netflix);
      if (amazonPrime) platforms.push(amazonPrime);
      if (disneyPlus) platforms.push(disneyPlus);
  }

    return platforms;
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return null;
  }
}

export async function fetchGenres() {
  try {
    const response = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`, {
      params: {
        api_key: API_KEY,
        language: 'fr-FR',
      },
    });
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return null;
  }
};

export async function fetchCountries() {
  try {
    const response = await axios.get(`${BASE_URL}/watch/providers/regions`, {
      params: {
        api_key: API_KEY,
        language: 'fr-FR',
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return null;
  }
};