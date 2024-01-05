import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, role, redirectTo, element, path }) => {
  const userData = useSelector((state) => state?.authReducer?.user);
  if (role === "service-provider") {
    console.warn("role", role, userData?.packageType, path, "first");
    if (
      userData?.packageType?.toLowerCase() === "none" &&
      path !== "/pricing"
    ) {
      return <Navigate to="/pricing" />;
    }
  }
  const isAllowed = user ;
  return <>{isAllowed ? userData?.status == "pending" ? <Navigate to='/dashboard'/>  : element : <Navigate to={redirectTo} />}</>;
};

export default ProtectedRoute;
