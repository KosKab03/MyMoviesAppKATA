import FilmItem from '../film-item';
import PaginationList from '../pagination-list';
import SpinLoading from '../app/spin-loading';
import { ErrorWindow, WarningWindow } from '../alerts/alerts';
import React from 'react';
import { Row } from 'antd';

function createListFilms(arr) {
  if (arr) {
    return arr.map((movie) => {
      const { key } = movie;
      return <FilmItem key={key} data={movie} />;
    });
  }
  return '';
}

function FilmList({ ArrayFilms, loading, notFound, error, errorName, totalPages }) {
  const spinner = loading && <SpinLoading />;
  const visPagination = totalPages === 1 || <PaginationList />;
  const content = !loading && !notFound && ArrayFilms && (
    <div>
      <Row gutter={[32, 32]}>{createListFilms(ArrayFilms)}</Row>
      {visPagination}
    </div>
  );
  const missing = notFound && <WarningWindow />;
  const errorMessage = error && <ErrorWindow errorName={errorName} />;

  return (
    <div>
      {spinner}
      {content}
      {missing}
      {errorMessage}
    </div>
  );
}

export default FilmList;
