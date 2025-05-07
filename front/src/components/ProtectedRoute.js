import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from '../services/auth';

// protectedroute проверяет наличие валидного токена перед отображением компонента
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      getToken() ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

export default ProtectedRoute; 