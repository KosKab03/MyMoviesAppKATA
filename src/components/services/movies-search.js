export default class MoviesSearch {
  apiBase = 'https://api.themoviedb.org/3';

  idGuest = localStorage.getItem('guest');

  async getArrayFilms(nameFilm, page) {
    const res = await fetch(
      `${this.apiBase}/search/movie?api_key=${process.env.REACT_APP_API_KEY}&guest_session_id=${this.idGuest}&query=${nameFilm}&page=${page}`
    );
    const arrayFilms = await res.json().then((resolve) => resolve.results);

    return arrayFilms;
  }

  async getPopularFilms(page = 1) {
    const res = await fetch(
      `${this.apiBase}/movie/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=${page}`
    );

    const arrayFilms = await res.json().then((resolve) => resolve.results);
    return arrayFilms;
  }

  async getTotalPagesByText(text) {
    const res = await fetch(
      `${this.apiBase}/search/movie?api_key=${process.env.REACT_APP_API_KEY}&guest_session_id=${this.idGuest}&query=${text}`
    );
    const totalPages = await res.json().then((resolve) => resolve.total_pages);
    return totalPages;
  }

  async getGuestSession() {
    const guestGET = await fetch(
      `${this.apiBase}/authentication/guest_session/new?api_key=${process.env.REACT_APP_API_KEY}`
    );
    await guestGET.json().then((answer) => {
      if (!localStorage.getItem('guest')) {
        this.idGuest = answer.guest_session_id;
        localStorage.setItem('guest', answer.guest_session_id);
      }
    });
  }

  async getUserRatingFilms(page = 1) {
    const res = await fetch(
      `${this.apiBase}/guest_session/${this.idGuest}/rated/movies?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=created_at.asc&page=${page}`
    );
    const arrayUserRatingFilm = await res.json();
    const totalPages = arrayUserRatingFilm.total_pages;
    if (arrayUserRatingFilm.results) return [totalPages, arrayUserRatingFilm.results];
    return '';
  }

  setRatingFilm(id, rating) {
    localStorage.setItem(id, rating);
    fetch(
      `${this.apiBase}/movie/${id}/rating?api_key=${process.env.REACT_APP_API_KEY}&guest_session_id=${this.idGuest}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          value: rating,
        }),
      }
    );
  }
}
