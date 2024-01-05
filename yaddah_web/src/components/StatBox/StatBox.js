import React from "react";
import styles from "./Statbox.module.css";

const StatBox = ({ item }) => {
  return (
    <div className={styles.statBox__wrapper}>
      <p className={styles.statBox__header}>{item?.lead}</p>
      <p className={styles.statBox__desc}>{item?.desc}</p>
    </div>
  );
};

export default StatBox;
