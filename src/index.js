import Notiflix from "notiflix";
import './css/styles.css';
import debounce from 'lodash.debounce';



const inputRef = document.querySelector("#search-box");
const countryListRef = document.querySelector(".country-list");
const countryInfoRef = document.querySelector(".country-info");


function renderCountryList(countryList) {
  countryListRef.innerHTML = "";
  if (countryList.length > 10) {
    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
  } else if (countryList.length >= 2 && countryList.length <= 10) {
    countryList.forEach((country) => {
      const countryItem = document.createElement("div");
      countryItem.classList.add("country-list__item");
      countryItem.innerHTML = `
        <img class="country-list__flag" src="${country.flag}" alt="Flag of ${country.name}">
        <p class="country-list__name">${country.name}</p>
      `;
      countryItem.addEventListener("click", () => {
        fetchCountryInfo(country.name);
      });
      countryListRef.appendChild(countryItem);
    });
  } else if (countryList.length === 1) {
    const country = countryList[0];
    const countryInfo = `
      <div class="country-info__flag-container">
        <img class="country-info__flag" src="${country.flag}" alt="Flag of ${country.name}">
      </div>
      <div class="country-info__text-container">
        <h2 class="country-info__name">${country.name}</h2>
        <p><span class="country-info__label">Capital:</span> ${country.capital}</p>
        <p><span class="country-info__label">Population:</span> ${country.population.toLocaleString()}</p>
        <p><span class="country-info__label">Languages:</span> ${country.languages.map(lang => lang.name).join(", ")}</p>
      </div>
    `;
    countryInfoRef.innerHTML = countryInfo;
  }
}

function fetchCountries(searchQuery) {
  return fetch(`https://restcountries.com/v2/name/${searchQuery}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
}

function fetchCountryInfo(countryName) {
  return fetch(`https://restcountries.com/v2/name/${countryName}?fullText=true`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then((countryList) => {
      renderCountryList(countryList);
    })
    .catch((error) => {
      Notiflix.Notify.failure("Oops, there is no country with that name");
      console.log(error);
    });
}

function handleSearch() {
  const searchQuery = inputRef.value.trim();
  if (searchQuery.length === 0) {
    countryListRef.innerHTML = "";
    countryInfoRef.innerHTML = "";
    return;
  }
  fetchCountries(searchQuery)
    .then((countryList) => {
      renderCountryList(countryList);
    })
      .catch((error) => {
        if (error.message === "404") {
          Notiflix.Notify.failure("Oops, there is no country with that name");
        } else {
          Notiflix.Notify.failure("Oops, something went wrong");
        }
        console.log(error);
      });
  }

inputRef.addEventListener("input", debounce(handleSearch, 500));

