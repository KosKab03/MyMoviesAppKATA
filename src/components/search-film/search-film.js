import React from 'react';
import { Input } from 'antd';

import './search-film.css';

function SearchFilm({ value, onLabelChange }) {
  return (
    <Input className="search-film" placeholder="Type to search..." onChange={onLabelChange} value={value} allowClear />
  );
}

export default SearchFilm;
