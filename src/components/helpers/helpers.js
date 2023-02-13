import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';

async function getGenreList() {
  let res = await fetch(
    'https://api.themoviedb.org/3/genre/movie/list?api_key=d26b514b9df0782d472c6973afb2c007&language=en-US'
  );
  res = await res.json();
  return res;
}

const genreList = getGenreList();

function getGenreFilm(array) {
  const newArray = [];
  genreList.then((resolve) => {
    array.forEach((id) =>
      resolve.genres.forEach((item) => {
        if (item.id === id) {
          newArray.push(item.name);
        }
      })
    );
  });
  return newArray;
}

function dataFormat(data) {
  try {
    return format(new Date(data), 'MMMM dd, yyyy', { locale: enGB });
  } catch {
    return 'date unknown';
  }
}

const helpers = {
  getBorderColor(stars) {
    if (!stars || stars < 3) {
      return '#E90000';
    }
    if (stars >= 3 && stars < 5) {
      return '#E97E00';
    }
    if (stars >= 5 && stars < 7) {
      return '#E9D100';
    }
    return '#66E900';
  },

  createArrayFilms(arrayFilms) {
    return arrayFilms.map((item) => ({
      key: item.id,
      title: item.original_title,
      genre: getGenreFilm(item.genre_ids),
      poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      overview: item.overview,
      releaseDate: dataFormat(item.release_date),
      stars: parseFloat(item.vote_average.toFixed(1)),
      userRating: item.rating || localStorage.getItem(item.id),
    }));
  },
};

export const { getBorderColor } = helpers;
export const { createArrayFilms } = helpers;
