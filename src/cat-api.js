import axios from 'axios';
import SlimSelect from 'slim-select';

axios.defaults.headers.common['x-api-key'] = 'live_Sy5hTS1EvLC8YWNuUazALtkmMhoTHrJz4s3MEKVhoLs3fMcKHurML2TCnvqJky3h';

export const fetchBreeds = () => {
  return axios.get('https://api.thecatapi.com/v1/breeds')
    .then(response => {
      return response.data.map(breed => ({
        id: breed.id,
        name: breed.name,
      }));
    })
    .catch(error => {
      console.error('Error fetching cat breeds:', error);
      throw error;
    });
};

export const fetchCatByBreed = (breedId) => {
  const url = `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`;
  return axios.get(url)
    .then(response => {
      return response.data[0];
    })
    .catch(error => {
      throw error;
    });
};

const breedSelect = document.querySelector('.breed-select');
const catInfoDiv = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const errorDiv = document.querySelector('.error');

const populateBreeds = () => {
  loader.style.display = 'block';
  errorDiv.style.display = 'none';

  fetchBreeds()
    .then(breeds => {
      breeds.forEach(breed => {
        breedSelect.innerHTML += `<option value="${breed.id}">${breed.name}</option>`;
      });
      new SlimSelect('.breed-select');
      errorDiv.style.display = 'none'; // Ukrycie komunikatu błędu
    })
    .catch(error => {
      errorDiv.style.display = 'block'; // Wyświetlenie komunikatu błędu
      console.error('Error fetching cat breeds:', error);
    })
    .finally(() => {
      loader.style.display = 'none';
    });
};

const displayCatInfo = (breedId) => {
  loader.style.display = 'block';
  errorDiv.style.display = 'none';

  fetchCatByBreed(breedId)
    .then(cat => {
      catInfoDiv.innerHTML = `
        <img src="${cat.url}" alt="${cat.breeds[0].name}" />
        <p>Nazwa rasy: ${cat.breeds[0].name}</p>
        <p>Opis: ${cat.breeds[0].description}</p>
        <p>Temperament: ${cat.breeds[0].temperament}</p>
      `;
      catInfoDiv.style.display = 'block'; // Wyświetlenie informacji o kocie
      errorDiv.style.display = 'none'; // Ukrycie komunikatu błędu
    })
    .catch(error => {
      catInfoDiv.style.display = 'none';
      breedSelect.style.display = 'block'; // Zmiana na block, aby select był widoczny
      errorDiv.style.display = 'block'; // Wyświetlenie komunikatu błędu
      console.error('Error fetching cat info:', error);
    })
    .finally(() => {
      loader.style.display = 'none';
    });
};

breedSelect.addEventListener('change', (event) => {
  const selectedBreedId = event.target.value;
  displayCatInfo(selectedBreedId);
});

populateBreeds();