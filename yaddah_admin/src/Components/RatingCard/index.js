import React from "react";
import styles from "./RatingCard.module.css";
import { Button } from "../Button/Button";
import { imageUrl } from "../../config/apiUrl";
import { EmptyProfile } from "../../constant/imagePath";

const RatingCard = ({ item, isShowBadge = false, viewProfileClick }) => {

  return (
    <div className={styles.userCard__wrapper}>
      {item?.userRating !== "none" && isShowBadge === true ? (
        <div
          className={styles.userCard__badge}
          data-badge={item?.userRating.replace(/-/g, " ")}
        ></div>
      ) : null}
      <img
        className={styles.userCard__img}
        src={imageUrl(item?.photo)}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = EmptyProfile;
        }}
        alt=""
      />
      <p className={`${styles.userCard__name} userNameStyles`}>
        {item?.fullName}
      </p>
      <p className={styles.userCard__email}>{item?.email}</p>
      <div className={styles.userCard__button__wrapper}>
        <Button
          className={styles.userCard__button}
          onClick={() => {
            viewProfileClick();
          }}
        >
          View Profile
        </Button>
      </div>
    </div>
  );
};

export default RatingCard;
