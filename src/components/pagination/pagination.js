import React, { useState } from 'react';
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';

const Pagination = () => {
  const [current, setCurrent] = useState(3);

  const onChange: PaginationProps['onChange'] = (page) => {
    console.log(page);
    setCurrent(page);
  };

  return <Pagination current={current} onChange={onChange} total={10} />;
};

export default Pagination;
