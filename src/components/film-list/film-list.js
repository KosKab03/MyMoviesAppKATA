import FilmItem from '../film-item';
import PaginationList from '../pagination-list';
import SpinLoading from '../app/spin-loading';
import { ErrorAlerts, WarningAlerts } from '../alerts/alerts';
import React from 'react';
import { Row } from 'antd';

function createFilmsComponents(arr) {
  return arr.map((movie) => {
    const { key } = movie;
    return <FilmItem key={key} data={movie} />;
  });
}

function FilmList({ ArrayFilms, loading, notFound, error, errorName, totalPages }) {
  const spinner = loading && <SpinLoading />;
  const visPagination = totalPages === 0 || totalPages === 1 || <PaginationList />;
  const content = !loading && !notFound && ArrayFilms && (
    <div>
      <Row gutter={[32, 32]}>{createFilmsComponents(ArrayFilms)}</Row>
      {visPagination}
    </div>
  );
  const missing = notFound && <WarningAlerts />;
  const errorMessage = error && <ErrorAlerts errorName={errorName} />;

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
