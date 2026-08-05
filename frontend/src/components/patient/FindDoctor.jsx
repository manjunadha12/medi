import React from 'react';
import { Navigate } from 'react-router-dom';

const FindDoctor = () => {
  // REDIRECT TO THE CORRECT COMPONENT TO PREVENT CONFUSION
  return <Navigate to="/patient/doctor-search" replace />;
};

export default FindDoctor;
