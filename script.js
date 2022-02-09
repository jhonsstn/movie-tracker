const input = document.querySelector('.movie_name');
const button = document.querySelector('.search_movie');
const deckContainer = document.querySelector('.deck');
const pageTitle = document.querySelector('.page_title');
const svgUrl =
  'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg';

function refreshPage() {
  window.location.reload();
}

pageTitle.addEventListener('click', refreshPage);

const searchObject = {
  name: 'Homem de ferro',
  language: 'pt-BR',
  page: 1,
  adult: false,
};

const searchMovies = async ({ name, language, page, adult }) => {
  const encodedName = encodeURIComponent(name);
  const getMoviesApiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=${language}&query=${encodedName}&page=${page}&include_adult=${adult}`;
  const response = await fetch(getMoviesApiUrl);
  const data = await response.json();
  return data.results;
};

const getGenres = async () => {
  const getGenresApiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=pt-BR`;
  const response = await fetch(getGenresApiUrl);
  const data = await response.json();
  return data.genres;
};

const createParagraphElement = (title, date) => {
  const paragraph = document.createElement('p');
  const movieData = `${date} - ${title}`;
  paragraph.innerHTML = movieData;
  return paragraph;
};

const appendCardElement = (element) => {
  deckContainer.appendChild(element);
};

const creatImgElement = (name, src) => {
  const img = document.createElement('img');
  if (!src) img.src = svgUrl;
  if (src) img.src = `https://image.tmdb.org/t/p/w500${src}`;
  img.alt = `${name} movie cover.`;
  img.className = 'movie_img';
  return img;
};

const createMovieNameElement = (name) => {
  const h4Title = document.createElement('h4');
  h4Title.className = 'movie_title';
  h4Title.innerText = name;
  return h4Title;
};

const createMovieOverviewElement = (overview) => {
  const pOverview = document.createElement('p');
  pOverview.className = 'movie_overview';
  pOverview.innerText = `- ${overview ? overview : 'Sem overview'} -`;
  return pOverview;
};

const createGenreContainerElement = async (genre) => {
  const divGenre = document.createElement('div');
  divGenre.className = 'genre_container';
  const genreList = await getGenres();
  genre.forEach((movieGenre) => {
    genreList.forEach((genreOnList) => {
      if (movieGenre === genreOnList.id) {
        divGenre.append(createGenreElement(genreOnList.name));
      }
    });
  });
  return divGenre;
};

const createMovieDataContainerElement = async (name, overview, genre) => {
  const divMovieData = document.createElement('div');
  divMovieData.className = 'movie_data';
  divMovieData.appendChild(createMovieNameElement(name));
  divMovieData.appendChild(createMovieOverviewElement(overview));

  const genreContainerElement = await createGenreContainerElement(genre);

  divMovieData.appendChild(genreContainerElement);
  return divMovieData;
};

const createGenreElement = (genre) => {
  const spanGenre = document.createElement('span');
  spanGenre.className = 'movie_genre';
  spanGenre.innerText = genre;
  return spanGenre;
};

const createCardElement = async (name, src, overview, genre) => {
  const divCard = document.createElement('div');
  divCard.className = 'card';
  divCard.appendChild(creatImgElement(name, src));
  const movieDataContainerElement = await createMovieDataContainerElement(
    name,
    overview,
    genre
  );
  divCard.appendChild(movieDataContainerElement);
  appendCardElement(divCard);
};

input.addEventListener('keypress', (event) => {
  if (event.keyCode === 13) {
    getMovies();
  }
});

const getMovies = async () => {
  const movieName = input.value;
  searchObject.name = movieName;
  const moviesData = await searchMovies(searchObject);
  input.value = null;
  deckContainer.innerHTML = null;
  moviesData.forEach((movie) => {
    const { title, poster_path, overview, genre_ids } = movie;
    createCardElement(title, poster_path, overview, genre_ids);
  });
};

button.addEventListener('click', getMovies);
