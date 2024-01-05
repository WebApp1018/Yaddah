import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./NavigationHeader.module.css";
import { useSelector, useDispatch } from "react-redux";
// import { signOutRequest } from "../../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";

//Images
import {
  logoWhite,
  logoWithoutName,
  dashboardSvg,
  newUserSvg,
  allUserSvg,
  allServiceSvg,
  earningSvg,
  packagesSvg,
  discountSvg,
  badgeSvg,
  notificationSvg,
  chatsSvg,
  logoutSvg,
  serviceSvg,
  allBookingsSvg,
  venueSvg,
  settingSvg,
} from "../../constant/imagePath";
import { GiHamburgerMenu } from "react-icons/gi";
import { useRef } from "react";
import { apiUrl } from "../../config/apiUrl";
import { signOutRequest } from "../../redux/auth/authSlice";
import { io } from "socket.io-client";
import { clearNotiData } from "../../redux/common/commonSlice";

const Navigation = ({ getter, func }) => {
  const socket = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, fcmToken } = useSelector((state) => state?.authReducer);
  const { noti_counter } = useSelector((state) => state?.commonReducer);

  const LogoutHandler = () => {
    socket.current = io(apiUrl);
    socket.current.emit("logout", user?._id, fcmToken);
    dispatch(signOutRequest());
    navigate("/login");
  };
  return (
    <div
      className={
        !getter
          ? [styles.sidebar__collapsed, styles.sidebar].join(" ")
          : styles.sidebar
      }
    >
      <button onClick={(e) => func()} className={styles.hamburger__btn}>
        <GiHamburgerMenu />
      </button>
      <div className={styles.logo__wrapper} onClick={() => navigate("/")}>
        <img src={logoWhite} alt="" />
      </div>
      <div className={styles.navigation__wrapper}>
        <img src={logoWithoutName} alt="" className={styles.accent__img} />
        <NavLink
          to="/dashboard"
          className={({ isActive }) => isActive && styles.navActive}
        >
          <ReactSVG src={dashboardSvg} />
          {getter ? <span>Dashboard</span> : null}
        </NavLink>
        <NavLink
          to={user?.role !== "customer" ? "/all-bookings" : "/my-bookings"}
          className={({ isActive }) => isActive && styles.navActive}
        >
          <ReactSVG src={allBookingsSvg} />
          {getter ? (
            <span>
              {user?.role !== "customer" ? "All Bookings" : "My Bookings"}
            </span>
          ) : null}
        </NavLink>

        {user?.role !== "customer" && (
          <>
            <NavLink
              to="/staff"
              className={({ isActive }) => isActive && styles.navActive}
            >
              <ReactSVG src={allUserSvg} />
              {getter ? <span>Staff</span> : null}
            </NavLink>
            <NavLink
              to="/venue"
              className={({ isActive }) => isActive && styles.navActive}
            >
              <ReactSVG src={venueSvg} />
              {getter ? <span>Venue</span> : null}
            </NavLink>
            <NavLink
              to="/my-services"
              className={({ isActive }) => isActive && styles.navActive}
            >
              <ReactSVG src={serviceSvg} />
              {getter ? <span>Services</span> : null}
            </NavLink>
            <NavLink
              to="/subscription"
              className={({ isActive }) => isActive && styles.navActive}
            >
              <ReactSVG src={serviceSvg} />
              {getter ? <span>Subscription</span> : null}
            </NavLink>
            <NavLink
              to="/earning"
              className={({ isActive }) => isActive && styles.navActive}
            >
              <ReactSVG src={earningSvg} />
              {getter ? <span>Earning</span> : null}
            </NavLink>
          </>
        )}
        <NavLink
          to="/chats"
          className={({ isActive }) => isActive && styles.navActive}
        >
          <ReactSVG src={chatsSvg} />
          {getter ? <span>Chats</span> : null}
        </NavLink>
        {user?.role === "customer" && (
          <>
            <NavLink
              to="/services"
              className={({ isActive }) => isActive && styles.navActive}
            >
              <ReactSVG src={allBookingsSvg} />
              {getter ? <span>All Services</span> : null}
            </NavLink>
            <NavLink
              to="/transactions"
              className={({ isActive }) => isActive && styles.navActive}
            >
              <ReactSVG src={earningSvg} />
              {getter ? <span>Transactions</span> : null}
            </NavLink>
          </>
        )}
        <NavLink
          to="/notifications"
          className={({ isActive }) => isActive && styles.navActive}
          onClick={() => dispatch(clearNotiData())}
        >
          <ReactSVG src={notificationSvg} />
          {getter ? (
            <span>Notifications {noti_counter > 0 && `(${noti_counter})`}</span>
          ) : null}
        </NavLink>
        {user?.role == "customer" && (
          <NavLink
            to="/settings"
            className={({ isActive }) => isActive && styles.navActive}
          >
            <ReactSVG src={settingSvg} />
            {getter ? <span>Settings</span> : null}
          </NavLink>
        )}
        <NavLink
          to="/update-password"
          className={({ isActive }) => isActive && styles.navActive}
        >
          <ReactSVG src={settingSvg} />
          {getter ? <span>Update Password</span> : null}
        </NavLink>
      </div>
      <button onClick={LogoutHandler} className={styles.logout__button}>
        <ReactSVG src={logoutSvg} />
        Logout
      </button>
    </div>
  );
};

export default Navigation;
