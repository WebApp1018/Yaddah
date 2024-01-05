import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import { BsBell } from "react-icons/bs";
import Notification from "../Notification";
import { BaseURL } from "../../config/apiUrl";
import { Get } from "../../Axios/AxiosFunctions";
import { useDispatch, useSelector } from "react-redux";
import { ClickAwayListener, Skeleton } from "@mui/material";
import NoData from "../NoData/NoData";
import { clearNotiData } from "../../store/common/commonSlice";

const Header = ({ getter, func }) => {
  const dispatch = useDispatch();
  const {  accessToken } = useSelector((state) => state?.authReducer);
  const [notificationData, setNotificationData] = useState([]);
  const { noti_counter } = useSelector((state) => state.commonReducer);

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

  return (
    <div
      className={styles.header}
      data-notification={noti_counter > 9 ? "9+" : noti_counter}
      data-show-notification={noti_counter > 0}>
      <BsBell onClick={(e) => func(e)} />
      {getter ? (
        <ClickAwayListener onClickAway={() => func()}>
          <div className={styles.headerNotification}>
            {loading ? (
              Array(4)
                .fill(0)
                .map((item) => (
                  <Skeleton
                    className={styles.notificationSkelton}
                    variant="rounded"
                    width={`100%`}
                    height={73}
                  />
                ))
            ) : notificationData?.length == 0 ? (
              <NoData text="No Notifications Found" />
            ) : (
              notificationData?.map((e) => (
                <Notification item={e} icon={<BsBell />} />
              ))
            )}
          </div>
        </ClickAwayListener>
      ) : null}
    </div>
  );
};

export default Header;
