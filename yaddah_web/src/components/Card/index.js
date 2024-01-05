import React from "react";
import styles from "./Card.module.css";
import { Button } from "../Button/Button";
import { useNavigate } from "react-router-dom";
import { imageUrl } from "../../config/apiUrl";
import { categoryVenue } from "../../constant/imagePath";

const Card = ({ item, onView }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.card__wrapper}>
      <img
        className={styles.card__img}
        src={imageUrl(item?.image || item?.images[0])}
        alt=""
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = categoryVenue;
        }}
      />
      <p className={styles.card__name}>{item?.name}</p>
      <div className={styles.card__description}>
        <p>{item?.description}</p>
      </div>
      <div className={styles.button_wrapper}>
        <Button
          label={"Edit"}
          className={styles.card__button}
          onClick={() => {
            navigate(`/edit-venue/${item._id}`);
          }}
        />
        <Button
          label={"View Details"}
          onClick={onView}
          className={[styles.card__button, styles.card__button__bordered].join(
            " "
          )}
        />
      </div>
    </div>
  );
};

export default Card;
