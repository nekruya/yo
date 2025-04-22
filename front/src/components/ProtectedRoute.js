import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from '../services/auth';

// ProtectedRoute checks for a valid token before rendering the component
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      getToken() ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

export default ProtectedRoute; 