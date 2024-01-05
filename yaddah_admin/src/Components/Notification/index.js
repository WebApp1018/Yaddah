import React from "react";
import styles from "./Notification.module.css";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import { liveURLWEB } from "../../config/apiUrl";

const Notification = ({ item, icon }) => {
  const navigate = useNavigate();
  const diff = moment(`${item.createdAt}`).format("DD MMM YYYY hh:mm");
  return (
    <div
      className={styles.notification__wrapper}
      onClick={() => {
        if (item?.flag == "booking") {
          window.open(`${liveURLWEB}/booking/${item?.booking}`, "_blank");
        } else {
          if (["register", "subscription"].includes(item?.flag)) {
            navigate(`/all-service-providers`);
          }
        }
      }}>
      <span className={styles.notification__icon}>{icon}</span>
      <p className={styles.notification__time}>{item?.message}</p>
      <p>{diff}</p>
    </div>
  );
};

export default Notification;
