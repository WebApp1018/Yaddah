import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { apiUrl } from "../../config/apiUrl";
import { isMobileViewHook } from "../../CustomHooks/isMobileViewHook";
import { signOutRequest } from "../../redux/auth/authSlice";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";

const Header = ({
  backgroundColor,
  containerClass,
  className,
  logo,
  customStyle,
}) => {
  const socket = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, fcmToken } = useSelector(state => state?.authReducer)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    isMobileViewHook(setIsMobile, 992);
  }, [window.innerWidth]);

  const onLogout = () => {
    socket.current = io(apiUrl);
    socket.current.emit("logout", user?._id, fcmToken);
    dispatch(signOutRequest());
    navigate("/login");
  };


  return (
    <>
      {isMobile ? (
        <MobileHeader logo={logo} customStyle={customStyle}

          onLogout={onLogout}
        />
      ) : (
        <DesktopHeader
          logo={logo}
          backgroundColor={backgroundColor}
          containerClass={containerClass}
          className={className}
          onLogout={onLogout}
        />
      )}
    </>
  );
};

export default Header;
