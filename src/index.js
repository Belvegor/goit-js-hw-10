import SlimSelect from 'slim-select';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const breedSelect = document.querySelector('.breed-select');
const catInfoDiv = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');

const populateBreeds = () => {
  const breedSelect = document.querySelector('.breed-select');
  const loader = document.querySelector('.loader');
  const error = document.querySelector('.error');
  
  loader.style.display = 'block';
  error.style.display = 'none';
  
  fetchBreeds()
    .then(breeds => {
      breeds.forEach(breed => {
        breedSelect.innerHTML += `<option value="${breed.id}">${breed.name}</option>`;
      });
      
      breedSelect.style.display = 'block';
      loader.style.display = 'none';
      new SlimSelect('.breed-select');
    })
    .catch(error => {
      breedSelect.style.display = 'none';
      loader.style.display = 'none';
      error.style.display = 'block';
      console.error('Error fetching cat breeds:', error);
    });
};

const displayCatInfo = (breedId) => {
  catInfoDiv.classList.add('hidden');
  loader.classList.remove('hidden');
  error.classList.add('hidden');

  fetchCatByBreed(breedId)
    .then(cat => {
      catInfoDiv.classList.remove('hidden');
      loader.classList.add('hidden');
      catInfoDiv.innerHTML = `
        <img src="${cat.url}" alt="${cat.breeds[0].name}" />
        <p>Nazwa rasy: ${cat.breeds[0].name}</p>
        <p>Opis: ${cat.breeds[0].description}</p>
        <p>Temperament: ${cat.breeds[0].temperament}</p>
      `;
    })
    .catch(() => {
      catInfoDiv.classList.add('hidden');
      loader.classList.add('hidden');
      error.classList.remove('hidden');
    });
};

breedSelect.addEventListener('change', (event) => {
  const selectedBreedId = event.target.value;
  displayCatInfo(selectedBreedId);
});

populateBreeds();