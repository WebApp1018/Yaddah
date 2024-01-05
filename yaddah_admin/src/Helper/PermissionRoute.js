import React from "react";
import { useSelector } from "react-redux";
import {  Navigate } from "react-router-dom";

const PermissionRoute = ({ permission, redirectTo = "/", element }) => {
  const userPermissions = useSelector(
    (state) => state?.authReducer?.user?.permissions
  );
  const userRole = useSelector((state) => state?.authReducer?.user?.role);

  const allowScreen =
    userRole !== "admin" ? userPermissions?.includes(permission) : true;

  return <>{allowScreen ? element : <Navigate to={redirectTo} />}</>;
};

export default PermissionRoute;
