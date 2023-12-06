import SlimSelect from 'slim-select';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const breedSelect = document.querySelector('.breed-select');
const catInfoDiv = document.querySelector('.cat-info');

const populateBreeds = () => {
  breedSelect.style.display = 'none';
  catInfoDiv.style.display = 'none';
  const loader = document.querySelector('.loader');
  loader.style.display = 'block'; // Wyświetlenie p.loader
  document.querySelector('.error').style.display = 'none'; // Ukrycie komunikatu o błędzie

  fetchBreeds()
    .then(breeds => {
      breedSelect.style.display = 'block';
      loader.style.display = 'none'; // Ukrycie p.loader po zakończeniu żądania
      breeds.forEach(breed => {
        breedSelect.innerHTML += `<option value="${breed.id}">${breed.name}</option>`;
      });
      new SlimSelect('.breed-select');
    })
    .catch(error => {
      breedSelect.style.display = 'none';
      loader.style.display = 'none'; // Ukrycie p.loader w przypadku błędu
      document.querySelector('.error').style.display = 'block'; // Wyświetlenie komunikatu o błędzie
      console.error('Błąd podczas pobierania ras kotów:', error);
    });
};

const displayCatInfo = (breedId) => {
  const loader = document.querySelector('.loader');
  const error = document.querySelector('.error');

  loader.style.display = 'block'; // Wyświetlenie p.loader
  error.style.display = 'none'; // Ukrycie komunikatu błędu

  fetchCatByBreed(breedId)
    .then(cat => {
      loader.style.display = 'none'; // Ukrycie p.loader po zakończeniu żądania
      catInfoDiv.style.display = 'block'; // Wyświetlenie informacji o kocie
      catInfoDiv.innerHTML = `
        <img src="${cat.url}" alt="${cat.breeds[0].name}" />
        <p>Nazwa rasy: ${cat.breeds[0].name}</p>
        <p>Opis: ${cat.breeds[0].description}</p>
        <p>Temperament: ${cat.breeds[0].temperament}</p>
      `;
    })
    .catch(error => {
      loader.style.display = 'none'; // Ukrycie p.loader w przypadku błędu
      error.style.display = 'block'; // Wyświetlenie komunikatu błędu
      console.error('Błąd podczas pobierania informacji o kocie:', error);
    });
};

breedSelect.addEventListener('change', (event) => {
  const selectedBreedId = event.target.value;
  displayCatInfo(selectedBreedId);
});

populateBreeds();