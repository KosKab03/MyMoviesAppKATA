import React from 'react';
import { Spin } from 'antd';

function SpinLoading() {
  return (
    <Spin tip="Loading" size="large">
      <div className="content" />
    </Spin>
  );
}

export default SpinLoading;
