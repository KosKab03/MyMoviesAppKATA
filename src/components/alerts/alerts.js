import React from 'react';
import { Alert } from 'antd';

const alerts = {
  ErrorWindow({ errorName }) {
    let textError;

    if (errorName === 'Failed to fetch') {
      textError = 'Failed to get data from the server, try turning on the VPN or try again later';
    } else if (errorName === 'INTERNET DISCONNECTED') {
      textError = 'No internet connection! Please turn on the Internet and try to enter the request again';
    } else {
      textError = 'unknown error, write to support';
    }

    return <Alert message={errorName} showIcon description={textError} type="error" />;
  },

  WarningWindow() {
    return <Alert message="Nothing found for your request" type="warning" />;
  },
};

export const { ErrorWindow } = alerts;
export const { WarningWindow } = alerts;
