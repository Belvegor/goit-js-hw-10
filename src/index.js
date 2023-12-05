import SlimSelect from 'slim-select';


import { fetchBreeds, fetchCatByBreed } from './cat-api.js';


const breedSelect = document.querySelector('.breed-select');
const catInfoDiv = document.querySelector('.cat-info');

// wypełnienia selecta rasami kotów
const populateBreeds = () => {
  fetchBreeds()
    .then(breeds => {
      breeds.forEach(breed => {
        breedSelect.innerHTML += `<option value="${breed.id}">${breed.name}</option>`;
      });
      
      // inicjalizuje slimSelect 
      new SlimSelect('.breed-select');
    })
    .catch(error => {
      // łapie błąd
      console.error('Błąd podczas pobierania ras kotów:', error);
    });
};

// wyświetla informacjeo kocie po wyborze rasy
const displayCatInfo = (breedId) => {
  fetchCatByBreed(breedId)
    .then(cat => {
      // wyświetl informacje o kocie w divie catInfoDiv
      catInfoDiv.innerHTML = `
        <img src="${cat.url}" alt="${cat.breeds[0].name}" />
        <p>Nazwa rasy: ${cat.breeds[0].name}</p>
        <p>Opis: ${cat.breeds[0].description}</p>
        <p>Temperament: ${cat.breeds[0].temperament}</p>
      `;
    })
    .catch(error => {
      // łapie błąd
      console.error('Błąd podczas pobierania informacji o kocie:', error);
    });
};

// nasłuch zmiany w selectcie rasy
breedSelect.addEventListener('change', (event) => {
  const selectedBreedId = event.target.value;
  displayCatInfo(selectedBreedId);
});

// wywołauje funkcję
populateBreeds();