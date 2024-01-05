import React from "react";
import styles from "./Card.module.css";
import { Button } from "../Button/Button";
import { imageUrl } from "../../config/apiUrl";
import CategoryImage from "../../assets/images/photography.png"
const Card = ({ item, onEdit, onView }) => {
  return (
    <div className={styles.card__wrapper}>
      <img className={styles.card__img} src={imageUrl(item?.image)} alt="" 
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = CategoryImage;
        }}
      />
      <p className={styles.card__name}>{item?.name}</p>
      <p className={styles.card__description}>{item?.description}</p>
      <div className={styles.button_wrapper}>
        <Button
          label={"Edit"}
          className={styles.card__button}
          onClick={onEdit}
        />
        <Button
          label={"View Details"}
          className={[styles.card__button, styles.card__button__bordered].join(
            " "
          )}
          onClick={onView}
        />
      </div>
    </div>
  );
};

export default Card;
