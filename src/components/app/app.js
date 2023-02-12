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
    tabIndex: 1,
  };

  componentDidMount() {
    this.getPopularFilms();
    this.moviesSearch.getGuestSession().catch((reject) => {
      this.setState({ loading: false, error: true, errorName: reject.message });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { value, currentPage, tabIndex } = this.state;

    if (!value && prevState.currentPage !== currentPage && tabIndex === 1) {
      this.getPopularFilms(currentPage);
    }
    if (value && prevState.currentPage !== currentPage && tabIndex === 1) {
      this.getFilms(value);
    }
    if (tabIndex === 2) {
      this.getArrayUserRatingFilms();
    }
  }

  getPopularFilms(page) {
    this.setState({ ArrayFilms: null, loading: true, notFound: false, error: false });
    this.moviesSearch
      .getPopularFilms(page)
      .then((resolve) => {
        this.setState(() => ({
          ArrayFilms: resolve,
          loading: false,
          totalPages: 500,
          currentPage: page,
        }));
      })
      .catch((reject) => {
        this.setState({ loading: false, error: true, errorName: reject.message });
      });
  }

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

    this.getTotalPages(text);
  }, 500);

  getTotalPages(text) {
    this.moviesSearch
      .getTotalPages(text)
      .then((count) => {
        this.setState({ totalPages: count });
      })
      .catch((reject) => {
        this.setState({ loading: false, error: true, errorName: reject.message });
      });
  }

  onLabelChange = (e) => {
    this.setState({
      value: e.target.value,
      currentPage: 1,
    });

    if (!e.target.value && navigator.onLine) this.getPopularFilms();
    if (e.target.value && navigator.onLine) this.getFilms(e.target.value);
    if (!navigator.onLine) {
      this.setState({ ArrayFilms: null, error: true, errorName: 'INTERNET DISCONNECTED' });
    }
  };

  setPage = (page) => {
    this.setState(() => ({
      currentPage: page,
    }));
  };

  getArrayUserRatingFilms() {
    const idGuest = localStorage.getItem(0);
    const { currentPage } = this.state;
    this.moviesSearch
      .getUserRatingFilms(idGuest, currentPage)
      .then((resolve) => {
        const [totalPages, arrayFilms] = resolve;
        this.setState({ arrayUserRatingFilm: arrayFilms, totalPages });
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
                totalPages={totalPages}
              />
            </FilmListProvider>
          </div>
        ),
      },
      {
        key: '2',
        label: 'Rated',
        children: (
          <FilmListProvider value={{ totalPages, setPage: this.setPage, currentPage, addRatedFilm: this.addRatedFilm }}>
            <FilmList
              ArrayFilms={arrayUserRatingFilm}
              loading={loading}
              notFound={notFound}
              error={error}
              errorName={errorName}
              totalPages={totalPages}
            />
          </FilmListProvider>
        ),
      },
    ];

    return (
      <div className="app">
        <Tabs
          defaultActiveKey="1"
          items={items}
          centered
          onChange={(index) => {
            if (index === '2') {
              this.setState({ tabIndex: 2, currentPage: 1 });
              this.getArrayUserRatingFilms(1);
            } else {
              this.getPopularFilms(1);
              this.setState({ tabIndex: 1 });
            }
          }}
        />
      </div>
    );
  }
}
