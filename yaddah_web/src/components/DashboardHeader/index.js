import React, { useEffect, useState } from "react";
import styles from "./DashboardHeader.module.css";
import { BsBell } from "react-icons/bs";
import Notification from "../DashboardNotification";
import { useDispatch, useSelector } from "react-redux";
import { BaseURL, imageUrl } from "../../config/apiUrl";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Get } from "../../Axios/AxiosFunctions";
import NoData from "../NoData/NoData";
import { Skeleton } from "@mui/material";
import { clearNotiData } from "../../redux/common/commonSlice";
import { isMobileViewHook } from "../../CustomHooks/isMobileViewHook";

const Header = ({ getter, func }) => {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state?.authReducer);
  const { noti_counter } = useSelector((state) => state.commonReducer);
  const [notificationData, setNotificationData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);

  async function getNotifications() {
    const url = BaseURL("notifications/all?page=1&limit=10");
    setLoading(true);
    const response = await Get(url, accessToken);
    if (response) {
      setNotificationData(response?.data?.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (getter) {
      getNotifications();
      dispatch(clearNotiData());
    }
  }, [getter]);

  useEffect(() => {
    isMobileViewHook(setIsMobile, 450);
  }, []);
  return (
    <div className={styles.header}>
      <div
        className={styles.notification}
        data-notification={noti_counter > 9 ? "9+" : noti_counter}
        data-show-notification={noti_counter > 0}
      >
        {!isMobile && <BsBell onClick={() => func()} />}
        {!isMobile && getter ? (
          <ClickAwayListener onClickAway={() => func()}>
            <div className={styles.headerNotification}>
              {loading ? (
                Array(4)
                  .fill(0)
                  .map((item, key) => (
                    <Skeleton
                      className={styles.notificationSkelton}
                      variant="rounded"
                      width={`100%`}
                      height={73}
                      key={key}
                    />
                  ))
              ) : notificationData?.length == 0 ? (
                <NoData text="No Notifications Found" />
              ) : (
                notificationData?.map((e, key) => (
                  <Notification item={e} icon={<BsBell />} key={key} />
                ))
              )}
            </div>
          </ClickAwayListener>
        ) : null}
      </div>
      <div className={styles.imgDiv}>
        <img src={imageUrl(user?.photo)} />
      </div>
      <p className={styles?.userName}>{user?.fullName}</p>
    </div>
  );
};

export default Header;
