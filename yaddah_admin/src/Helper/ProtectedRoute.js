import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, redirectTo }) => {
  return <>{user ? <Outlet /> : <Navigate to={redirectTo} />}</>;
};

export default ProtectedRoute;
