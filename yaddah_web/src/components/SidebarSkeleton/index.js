import React, { useEffect } from "react";
import Navigation from "../Navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Sidebar.module.css";
import Header from "../DashboardHeader";
import { toggleDrawer } from "../../redux/common/commonSlice";
import { isMobileViewHook } from "../../CustomHooks/isMobileViewHook";

const SidebarSkeleton = ({ children }) => {
  const { sidebarOpen } = useSelector((state) => state?.commonReducer);
  const dispatch = useDispatch();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sidebarHandler = (e) => {
    dispatch(toggleDrawer(e ?? !sidebarOpen));
  };

  const notificationHandler = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  useEffect(() => {
    isMobileViewHook(setIsMobile);
  }, []);
  useEffect(() => {
    if (isMobile) {
      sidebarHandler(false);
    } else {
      sidebarHandler(true);
    }
  }, [isMobile]);

  return (
    <div
      className={
        sidebarOpen
          ? styles.content__wrapper
          : [styles.sidebar__collapsed, styles.content__wrapper].join(" ")
      }
    >
      <div className={styles.sidebar}>
        <Navigation getter={sidebarOpen} func={sidebarHandler} />
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
