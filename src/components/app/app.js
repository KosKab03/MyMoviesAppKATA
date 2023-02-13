import FilmList from '../film-list';
import SearchFilm from '../search-film';
import MoviesSearch from '../services/movies-search';
import { FilmListProvider } from '../film-list-context';
import { createArrayFilms } from '../helpers/helpers';

import React, { Component } from 'react';
import { Tabs } from 'antd';
import { debounce } from 'lodash';
import './app.css';
import 'antd/dist/reset.css';

const tabs = {
  search: 'search',
  rated: 'rated',
};

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
    tab: 'search',
  };

  componentDidMount() {
    this.getPopularFilms();
    this.moviesSearch.getGuestSession().catch((reject) => {
      this.setState({ loading: false, error: true, errorName: reject.message });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { value, currentPage, tab } = this.state;

    if (!value && prevState.currentPage !== currentPage && tab === tabs.search) {
      this.getPopularFilms(currentPage);
    }
    if (value && prevState.currentPage !== currentPage && tab === tabs.search) {
      this.getFilms(value);
    }
    if (tab === tabs.rated && prevState.currentPage !== currentPage) {
      this.UserRatingFilms();
    }
  }

  getPopularFilms(page) {
    this.setState({ ArrayFilms: null, loading: true, notFound: false, error: false });
    this.moviesSearch
      .getPopularFilms(page)
      .then((resolve) => {
        const arrayFilms = createArrayFilms(resolve);
        this.setState(() => ({
          ArrayFilms: arrayFilms,
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
      .then((resolve) => {
        const arrayFilms = createArrayFilms(resolve);
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

    this.getTotalPagesByText(text);
  }, 500);

  getTotalPagesByText(text) {
    this.moviesSearch
      .getTotalPagesByText(text)
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

  addRatedFilm = (id, rating) => {
    this.moviesSearch.setRatingFilm(id, rating);
  };

  UserRatingFilms() {
    const { currentPage } = this.state;
    this.moviesSearch
      .getUserRatingFilms(currentPage)
      .then((resolve) => {
        const [totalPages, results] = resolve;
        const arrayFilms = createArrayFilms(results);
        this.setState({ arrayUserRatingFilm: arrayFilms, totalPages });
      })
      .catch((reject) => {
        this.setState({ loading: false, error: true, errorName: reject.message });
      });
  }

  render() {
    const {
      ArrayFilms,
      arrayUserRatingFilm,
      totalPages,
      currentPage,
      value,
      loading,
      notFound,
      error,
      errorName,
      tab,
    } = this.state;

    const items = [
      {
        key: '1',
        label: 'Search',
      },
      {
        key: '2',
        label: 'Rated',
      },
    ];

    const renderArrayFilms = tab === tabs.search ? ArrayFilms : arrayUserRatingFilm;
    const searchInput = tab === tabs.search && (
      <SearchFilm value={value} onLabelChange={this.onLabelChange} onSearchFilm={this.onSearchFilm} />
    );

    return (
      <div className="app">
        <Tabs
          defaultActiveKey="1"
          items={items}
          centered
          onChange={(index) => {
            if (index === '2') {
              this.setState({ tab: 'rated', currentPage: 1 });
              this.UserRatingFilms(1);
            } else {
              this.getPopularFilms(1);
              this.setState({ tab: 'search', value: '' });
            }
          }}
        />
        {searchInput}
        <FilmListProvider value={{ totalPages, setPage: this.setPage, currentPage, addRatedFilm: this.addRatedFilm }}>
          <FilmList
            ArrayFilms={renderArrayFilms}
            loading={loading}
            notFound={notFound}
            error={error}
            errorName={errorName}
            totalPages={totalPages}
          />
        </FilmListProvider>
      </div>
    );
  }
}
