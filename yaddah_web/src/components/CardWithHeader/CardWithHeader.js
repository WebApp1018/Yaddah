import React from "react";
import { useNavigate } from "react-router-dom";
import { imageUrl } from "../../config/apiUrl";
import { Button } from "../Button/Button";
import styles from "./CardWithHeader.module.css";

const WithHeader__card = ({ item, showBtn }) => {
  const navigate = useNavigate();
  const image = item?.images !== undefined ? item.images[0] : item?.image;
  return (
    <div
      className={
        !item.titleBelow
          ? styles.category__card
          : `${[styles.category__card, styles.padding__normal].join(" ")}`
      }
    >
      {!item.titleBelow ? <h3>{item.name}</h3> : null}
      <img src={imageUrl(image)} alt="" />
      {item.titleBelow ? (
        <h3 className={styles.title__below}>{item.title}</h3>
      ) : null}
      <p className={`${styles.para_b}`}>{item.description}</p>
      {showBtn ? (
        <Button
          label={"Book Now"}
          className={`btn__solid bg__primary ${styles.card__btn}`}
          onClick={() => {
            navigate(`/service/${item._id}`);
          }}
        />
      ) : null}

      {item?.createdBy?.userRating !== "none" && (
        <div
          data-badge={item?.createdBy?.userRating.replace(/-/g, " ")}
          className={styles?.spBadge}
        />
      )}
    </div>
  );
};

export default WithHeader__card;
