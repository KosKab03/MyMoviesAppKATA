import React from 'react';
import { Input } from 'antd';

import './search-film.css';

function SearchFilm({ value, onLabelChange, onSearchFilm }) {
  return (
    <form className="search-film" onSubmit={onSearchFilm}>
      <Input placeholder="Type to search..." onChange={onLabelChange} value={value} allowClear />
    </form>
  );
}

export default SearchFilm;
