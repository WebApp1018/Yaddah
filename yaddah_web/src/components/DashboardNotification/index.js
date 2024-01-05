import React from "react";
import styles from "./Notification.module.css";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";

const Notification = ({ item, icon }) => {
  const navigate = useNavigate();
  const diff = moment(item?.createdAt).format("DD MMM YYYY hh:mm");

  return (
    <div
      className={styles.notification__wrapper}
      onClick={() => {
        if (item?.flag == "booking") {
          navigate(`/booking/${item?.booking}`);
        }
      }}
    >
      <span className={styles.notification__icon}>{icon}</span>
      <p className={styles.notification__msg}>{item?.message}</p>
      <p className={styles.notification__time}>{diff}</p>
    </div>
  );
};

export default Notification;
