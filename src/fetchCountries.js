import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v2/name';

async function fetchCountries(name) {
  const response = await axios.get(`${BASE_URL}${name}?fields=name,flags.svg,capital,population,languages`);
  return response.data;
}

export { fetchCountries };