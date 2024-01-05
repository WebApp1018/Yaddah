import React from "react";
import styles from "./Pricing.module.css";
import { AiFillEdit } from "react-icons/ai";
import EditPackageModal from "../../modals/EditPackeModal";
import { useState } from "react";

const PricingCard = ({ item }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div
      className={
        item.price !== 0
          ? styles.pricing__card
          : [styles.pricing__card, styles.pricing__card__free].join(" ")
      }
    >
      <button
        onClick={() => {
          setShowEditModal(true);
        }}
        className={styles.pricing__card__btn}
      >
        <AiFillEdit />
      </button>
      <div className={styles.pricing__card__content}>
        <p>{item.packageType}</p>
        {item.price !== 0 ? (
          <p className={styles.pricing__card__price}>
            ${parseFloat(item.price).toFixed(2)}
          </p>
        ) : null}
      </div>
      <EditPackageModal
        show={showEditModal}
        setShow={setShowEditModal}
        data={item}
      />
    </div>
  );
};

export default PricingCard;
