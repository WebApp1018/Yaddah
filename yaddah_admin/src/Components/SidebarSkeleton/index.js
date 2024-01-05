import React from "react";
import Navigation from "../Navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Sidebar.module.css";
import Header from "../Header";
import { ToggleDrawer } from "../../store/auth/authSlice";

const SidebarSkeleton = ({ children }) => {
  const { isOpen: sidebarState } = useSelector((state) => state?.authReducer);
  const dispatch = useDispatch();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const sidebarHandler = () => {
    dispatch(ToggleDrawer(!sidebarState));
  };
  const notificationHandler = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };
  return (
    <div
      className={
        sidebarState
          ? styles.content__wrapper
          : [styles.sidebar__collapsed, styles.content__wrapper].join(" ")
      }>
      <div className={styles.sidebar}>
        <Navigation getter={sidebarState} func={sidebarHandler} />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <Header getter={isNotificationOpen} func={notificationHandler} />
        </div>
        <div className={styles.children}>{children}</div>
      </div>
    </div>
  );
};

export default SidebarSkeleton;
