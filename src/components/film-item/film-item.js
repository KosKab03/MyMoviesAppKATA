import { FilmListConsumer } from '../film-list-context';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Col, Rate, Skeleton, Typography } from 'antd';

import './film-item.css';

const { Paragraph } = Typography;

function ImageCard({ poster }) {
  if (poster === 'https://image.tmdb.org/t/p/w500null') {
    return <Skeleton.Image style={{ width: '18.8vw', height: '100%' }} />;
  }
  return <img className="card-image" alt="poster film" src={poster} />;
}

function FilmItem({ data }) {
  const { title, key, poster, genre, overview, releaseDate, stars, userRating } = data;
  return (
    <FilmListConsumer>
      {({ addRatedFilm }) => (
        <Col md={{ span: 24 }} lg={{ span: 12 }}>
          <div className="card">
            <ImageCard poster={poster} />
            <aside className="card-description">
              <Paragraph className="description_header" ellipsis={{ rows: 1, expandable: false, symbol: 'more' }}>
                {title}
              </Paragraph>
              <p className="description_date">{releaseDate}</p>
              <ul className="card-ganre">
                {genre.map((item) => (
                  <li key={uuidv4()}>{item}</li>
                ))}
              </ul>
              <Paragraph className="card_overview" ellipsis={{ rows: 6, expandable: false, symbol: 'more' }}>
                {overview}
              </Paragraph>
              <Rate
                className="card-rate"
                count={10}
                defaultValue={userRating}
                onChange={(value) => {
                  addRatedFilm(key, value);
                }}
              />
              <span className="description_header-rating">{stars}</span>
            </aside>
          </div>
        </Col>
      )}
    </FilmListConsumer>
  );
}

export default FilmItem;
