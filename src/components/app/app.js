import SpinLoading from './spin-loading';
import FilmList from '../film-list';
import SearchFilm from '../search-film';
import MoviesSearch from '../services/movies-search';
import { ErrorWindow, WarningWindow } from '../alerts/alerts';

import React, { Component } from 'react';

import './app.css';
import 'antd/dist/reset.css';

export default class App extends Component {
  moviesSearch = new MoviesSearch();

  state = {
    ArrayFilms: null,
    value: '',
    loading: null,
    notFound: false,
    error: false,
    errorName: null,
  };

  getFilms(text) {
    this.setState({ ArrayFilms: null, loading: true, notFound: false, error: false });
    this.moviesSearch
      .createArrayFilms(text)
      .then((resolve) => {
        if (resolve.length) {
          const arrFilms = resolve;
          this.setState(() => ({
            ArrayFilms: arrFilms,
            loading: false,
          }));
        } else {
          this.setState({ loading: false, notFound: true });
        }
      })
      .catch((reject) => {
        this.setState({ loading: false, error: true, errorName: reject.message });
      });
  }

  onLabelChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  onSearchFilm = (e) => {
    e.preventDefault();
    const { value } = this.state;
    if (value && navigator.onLine) this.getFilms(value);
    if (!navigator.onLine) {
      this.setState({ ArrayFilms: null, error: true, errorName: 'INTERNET DISCONNECTED' });
    }
  };

  render() {
    const { ArrayFilms, value, loading, notFound, error, errorName } = this.state;

    const spinner = loading ? <SpinLoading /> : null;
    const content = !loading && !notFound ? <FilmList ArrayFilms={ArrayFilms} /> : null;
    const missing = notFound ? <WarningWindow /> : null;
    const errorMessage = error ? <ErrorWindow errorName={errorName} /> : null;

    return (
      <div className="app">
        <SearchFilm value={value} onLabelChange={this.onLabelChange} onSearchFilm={this.onSearchFilm} />
        {spinner}
        {content}
        {missing}
        {errorMessage}
      </div>
    );
  }
}
