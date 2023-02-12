import getGenreFilm from '../genre-list';

import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';

function dataFormat(data) {
  try {
    return format(new Date(data), 'MMMM dd, yyyy', { locale: enGB });
  } catch {
    return 'date unknown';
  }
}

function createArrayFilms(arrayFilms) {
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
}

export default class MoviesSearch {
  apiBase = 'https://api.themoviedb.org/3';

  apiKey = 'api_key=d26b514b9df0782d472c6973afb2c007';

  async getArrayFilms(nameFilm, page) {
    const res = await fetch(
      `${this.apiBase}/search/movie?${this.apiKey}&guest_session_id=06462f24e181850c463f2fa6d1503967&query=${nameFilm}&page=${page}`
    );
    const arrayFilms = await res.json().then((resolve) => resolve.results);

    return createArrayFilms(arrayFilms);
  }

  async getPopularFilms(page = 1) {
    const res = await fetch(`${this.apiBase}/movie/popular?${this.apiKey}&language=en-US&page=${page}`);

    const arrayFilms = await res.json().then((resolve) => resolve.results);
    return createArrayFilms(arrayFilms);
  }

  async getTotalPages(text) {
    const res = await fetch(
      `${this.apiBase}/search/movie?${this.apiKey}&guest_session_id=06462f24e181850c463f2fa6d1503967&query=${text}`
    );
    const totalPages = await res.json().then((resolve) => resolve.total_pages);
    return totalPages;
  }

  async getGuestSession() {
    const guestGET = await fetch(
      `${this.apiBase}/authentication/guest_session/new?api_key=d26b514b9df0782d472c6973afb2c007`
    );
    await guestGET.json().then((answer) => {
      if (!localStorage.getItem(0)) localStorage.setItem(0, answer.guest_session_id);
    });
  }

  async getUserRatingFilms(idGuest, page = 1) {
    const res = await fetch(
      `${this.apiBase}/guest_session/${idGuest}/rated/movies?${this.apiKey}&language=en-US&sort_by=created_at.asc&page=${page}`
    );
    const arrayUserRatingFilm = await res.json();
    const totalPages = arrayUserRatingFilm.total_pages;
    if (arrayUserRatingFilm.results) return [totalPages, createArrayFilms(arrayUserRatingFilm.results)];
    return '';
  }

  setRatingFilm(id, guestSessionId, rating) {
    localStorage.setItem(id, rating);
    fetch(`${this.apiBase}/movie/${id}/rating?${this.apiKey}&guest_session_id=${guestSessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        value: rating,
      }),
    });
  }
}
