import React from "react";
import styles from "./CardWithHeader.module.css";

const WithHeader__card = ({ item, showBtn }) => {
  return (
    <div
      className={
        !item?.titleBelow
          ? styles.category__card
          : `${[styles.category__card, styles.padding__normal].join(" ")}`
      }
    >
      {!item?.titleBelow ? <h3>{item?.title}</h3> : null}
      <img src={item?.img} alt="" />
      {item?.titleBelow ? (
        <h3 className={styles.title__below}>{item?.title}</h3>
      ) : null}
      <p>{item?.desc}</p>
      {showBtn ? (
        <button className={`btn__solid bg__primary ${styles.card__btn}`}>
          {"Book Now"}
        </button>
      ) : null}
    </div>
  );
};

export default WithHeader__card;
