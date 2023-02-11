import FilmList from '../film-list';
import SearchFilm from '../search-film';
import MoviesSearch from '../services/movies-search';
import { FilmListProvider } from '../film-list-context';

import React, { Component } from 'react';
import { Tabs } from 'antd';
import { debounce } from 'lodash';
import './app.css';
import 'antd/dist/reset.css';

export default class App extends Component {
  moviesSearch = new MoviesSearch();

  state = {
    ArrayFilms: null,
    arrayUserRatingFilm: null,
    totalPages: null,
    currentPage: 1,
    value: '',
    loading: null,
    notFound: false,
    error: false,
    errorName: null,
  };

  getFilms = debounce(async (text) => {
    this.setState({ ArrayFilms: null, loading: true, notFound: false, error: false });
    const { currentPage } = this.state;
    await this.moviesSearch
      .getArrayFilms(text, currentPage)
      .then((arrayFilms) => {
        if (arrayFilms.length) {
          this.setState(() => ({
            ArrayFilms: arrayFilms,
            loading: false,
          }));
        } else {
          this.setState({ loading: false, notFound: true });
        }
      })
      .catch((reject) => {
        this.setState({ loading: false, error: true, errorName: reject.message });
      });

    this.moviesSearch
      .getTotalPages(text)
      .then((count) => {
        this.setState({ totalPages: count });
      })
      .catch((reject) => {
        this.setState({ loading: false, error: true, errorName: reject.message });
      });
    this.moviesSearch.getGuestSession();
  }, 500);

  onLabelChange = (e) => {
    this.setState({
      value: e.target.value,
    });

    if (e.target.value && navigator.onLine) this.getFilms(e.target.value);
    if (!navigator.onLine) {
      this.setState({ ArrayFilms: null, error: true, errorName: 'INTERNET DISCONNECTED' });
    }
  };

  setPage = (page) => {
    this.setState(() => ({
      currentPage: page,
    }));
    const { value } = this.state;
    this.getFilms(value);
  };

  getArrayUserRatingFilms() {
    const idGuest = localStorage.getItem(0);
    this.moviesSearch
      .getUserRatingFilms(idGuest)
      .then((resolve) => {
        this.setState({ arrayUserRatingFilm: resolve });
      })
      .catch((reject) => {
        this.setState({ loading: false, error: true, errorName: reject.message });
      });
  }

  addRatedFilm = (id, rating) => {
    const idGuest = localStorage.getItem(0);
    this.moviesSearch.setRatingFilm(id, idGuest, rating);
  };

  render() {
    const { ArrayFilms, arrayUserRatingFilm, totalPages, currentPage, value, loading, notFound, error, errorName } =
      this.state;

    const items = [
      {
        key: '1',
        label: 'Search',
        children: (
          <div>
            <SearchFilm value={value} onLabelChange={this.onLabelChange} onSearchFilm={this.onSearchFilm} />
            <FilmListProvider
              value={{ totalPages, setPage: this.setPage, currentPage, addRatedFilm: this.addRatedFilm }}
            >
              <FilmList
                ArrayFilms={ArrayFilms}
                loading={loading}
                notFound={notFound}
                error={error}
                errorName={errorName}
                tabRating={false}
              />
            </FilmListProvider>
          </div>
        ),
      },
      {
        key: '2',
        label: 'Rated',
        children: (
          <FilmListProvider value={{ addRatedFilm: this.addRatedFilm }}>
            <FilmList
              ArrayFilms={arrayUserRatingFilm}
              loading={loading}
              notFound={notFound}
              error={error}
              errorName={errorName}
              tabRating
            />
          </FilmListProvider>
        ),
      },
    ];

    return (
      <div className="app">
        <Tabs defaultActiveKey="1" items={items} centered onChange={() => this.getArrayUserRatingFilms()} />
      </div>
    );
  }
}
