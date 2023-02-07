import FilmItem from '../film-item';
import React from 'react';
import { Row } from 'antd';

import './film-list.css';

function createListFilms(arr) {
  if (arr) {
    return arr.map((movie) => {
      const { key } = movie;
      return <FilmItem key={key} data={movie} />;
    });
  }
  return '';
}

function FilmList({ ArrayFilms }) {
  return (
    <Row className="row" gutter={[32, 32]}>
      {createListFilms(ArrayFilms)}
    </Row>
  );
}

export default FilmList;
