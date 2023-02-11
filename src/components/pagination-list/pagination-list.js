import { FilmListConsumer } from '../film-list-context';
import React from 'react';
import { Pagination } from 'antd';

import './pagination-list.css';

function PaginationList() {
  return (
    <FilmListConsumer>
      {({ totalPages, setPage, currentPage = 1 }) => (
        <Pagination
          className="pagination-list"
          pageSize="1"
          current={currentPage}
          total={totalPages}
          onChange={(page) => setPage(page)}
        />
      )}
    </FilmListConsumer>
  );
}

export default PaginationList;
