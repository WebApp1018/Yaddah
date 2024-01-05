import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer/Footer";
import { useSelector } from "react-redux";

function WebSkeleton({ children }) {
  const token = useSelector((state) => state.authReducer.accessToken);
  let showHeaderFooter = true;
  if (token && window?.location?.pathname === "/pricing") {
    showHeaderFooter = false;
  }

  return (
    <>
      {showHeaderFooter && <Header />}
      {children ? children : <Outlet />}
      {showHeaderFooter && <Footer />}
    </>
  );
}

export default WebSkeleton;
