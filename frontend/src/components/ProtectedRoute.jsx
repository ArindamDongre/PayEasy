import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './Auth'; 

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
