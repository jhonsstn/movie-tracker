const input = document.querySelector('.movie_name');
const button = document.querySelector('.search_movie');
const deckContainer = document.querySelector('.deck');

const searchObject = {
  name: 'Homem de ferro',
  language: 'pt-BR',
  page: 1,
  adult: false,
};

const searchMovies = async ({ name, language, page, adult }) => {
  const encodedName = encodeURIComponent(name);
  const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=${language}&query=${encodedName}&page=${page}&include_adult=${adult}`;
  const response = await fetch(API_URL);
  const data = await response.json();
  return data.results;
};

const createParagraphElement = (title, date) => {
  const paragraph = document.createElement('p');
  const movieData = `${date} - ${title}`;
  paragraph.innerHTML = movieData;
  return paragraph;
};

const appendElement = (element) => {
  deckContainer.appendChild(element);
};

const getMovies = async () => {
  const movieName = input.value;
  searchObject.name = movieName;
  const moviesData = await searchMovies(searchObject);
  deckContainer.innerHTML = null;
  moviesData.forEach((movie) => {
    createCardElement(movie.title, movie.poster_path);
  });
};

const creatImgElement = (name, src) => {
  const img = document.createElement('img');
  img.src = `https://image.tmdb.org/t/p/w500${src}`;
  img.alt = `${name} movie cover.`;
  img.className = 'movie_img';
  return img;
};

const createCardElement = (name, src) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.appendChild(creatImgElement(name, src));
  appendElement(card);
};

input.addEventListener('keypress', (event) => {
  if (event.keyCode === 13) {
    getMovies();
  }
});

button.addEventListener('click', getMovies);
