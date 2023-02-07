import getGenreFilm from '../genre-list';

import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';

export default class MoviesSearch {
  apiBase = 'https://api.themoviedb.org/3/search/movie?api_key=d26b514b9df0782d472c6973afb2c007&query=';

  async getResource(nameFilm) {
    const res = await fetch(`${this.apiBase}${nameFilm}`);
    return res.json();
  }

  createArrayFilms(text) {
    return this.getResource(text).then((resolve) =>
      resolve.results.map((item) => ({
        key: uuidv4(),
        title: item.original_title,
        genre: getGenreFilm(item.genre_ids),
        poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        overview: item.overview,
        releaseDate: format(new Date(item.release_date), 'MMMM dd, yyyy', { locale: enGB }),
        stars: item.vote_average,
      }))
    );
  }
}
