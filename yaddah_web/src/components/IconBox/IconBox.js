import React from "react";
import { imageUrl } from "../../config/apiUrl";
import styles from "./IconBox.module.css";

const IconBox = ({ item }) => {
  return (
    <div className={styles.iconbox__wrapper}>
      <div className={styles.iconbox__icon}>
        <img src={imageUrl(item?.logo)} alt="" />
      </div>
      <div className={styles.iconbox__content}>
        <p className={styles.__title}>{item?.title}</p>
        <p className={styles.__desc}>{item?.description}</p>
      </div>
    </div>
  );
};

export default IconBox;
