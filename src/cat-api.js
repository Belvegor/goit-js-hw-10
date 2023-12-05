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

// pobiera referencję do selecta i diva, wyświetla informacje o kocie
const breedSelect = document.querySelector('.breed-select');
const catInfoDiv = document.querySelector('.cat-info');

// wypełnienia selecta rasami kotów
const populateBreeds = () => {
  breedSelect.style.display = 'none';
  catInfoDiv.style.display = 'none';
  document.querySelector('.loader').style.display = 'block';
  document.querySelector('.error').style.display = 'none'; 

  fetchBreeds()
    .then(breeds => {
      breedSelect.style.display = 'block';
      document.querySelector('.loader').style.display = 'none';
      breeds.forEach(breed => {
        breedSelect.innerHTML += `<option value="${breed.id}">${breed.name}</option>`;
      });
      new SlimSelect('.breed-select');
    })
    .catch(error => {
      breedSelect.style.display = 'none';
      document.querySelector('.loader').style.display = 'none';
      document.querySelector('.error').style.display = 'block'; 
      console.error('Błąd podczas pobierania ras kotów:', error);
    });
};


const displayCatInfo = (breedId) => {
  catInfoDiv.style.display = 'none';
  breedSelect.style.display = 'none';
  document.querySelector('.loader').style.display = 'block';
  document.querySelector('.error').style.display = 'none'; 


  
  fetchCatByBreed(breedId)
    .then(cat => {
      catInfoDiv.style.display = 'block';
      breedSelect.style.display = 'block';
      document.querySelector('.loader').style.display = 'none';
      catInfoDiv.innerHTML = `
        <img src="${cat.url}" alt="${cat.breeds[0].name}" />
        <p>Nazwa rasy: ${cat.breeds[0].name}</p>
        <p>Opis: ${cat.breeds[0].description}</p>
        <p>Temperament: ${cat.breeds[0].temperament}</p>
      `;
    })
    .catch(error => {
      catInfoDiv.style.display = 'none';
      breedSelect.style.display = 'none';
      document.querySelector('.loader').style.display = 'none';
      document.querySelector('.error').style.display = 'block'; 
      console.error('Błąd podczas pobierania informacji o kocie:', error);
    });
};


breedSelect.addEventListener('change', (event) => {
  const selectedBreedId = event.target.value;
  displayCatInfo(selectedBreedId);
});


populateBreeds();