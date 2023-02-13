import React from 'react';
import { Alert } from 'antd';

function getError(errorName) {
  const permittedErrorNames = [
    {
      message: 'Failed to fetch',
      description: 'Failed to get data from the server, try turning on the VPN or try again later',
    },
    {
      message: 'INTERNET DISCONNECTED',
      description: 'No internet connection! Please turn on the Internet and try to enter the request again',
    },
  ];
  return permittedErrorNames.filter((obj) => obj.message === errorName);
}

const alerts = {
  ErrorAlerts({ errorName }) {
    const error = getError(errorName);

    if (error.length) {
      const { message, description } = error[0];
      return <Alert message={message} showIcon description={description} type="error" />;
    }
    return <Alert message={errorName} showIcon description="unknown error, write to support" type="error" />;
  },

  WarningAlerts() {
    return <Alert message="Nothing found for your request" type="warning" />;
  },
};

export const { ErrorAlerts } = alerts;
export const { WarningAlerts } = alerts;
