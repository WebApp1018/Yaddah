import React from "react";
import { useState } from "react";
import styles from "./UserCard.module.css";
import { Button } from "../Button/Button";
import { imageUrl } from "../../config/apiUrl";
import { EmptyProfile } from "../../constant/imagePath";
import { useNavigate } from "react-router-dom";
import { AiFillCheckCircle } from "react-icons/ai";

const UserCard = ({
  item,
  isShowBadge = false,
  activateDeactivateStatus,
  viewProfileClick,
  onAccept,
  onReject,
  flag,
}) => {
  const isEmailVerified =
    item?.role === "service-provide" && item?.isEmailVerified;
  const [isLoading, setIsLoading] = useState("");
  const navigate = useNavigate();

  return (
    <div className={styles.userCard__wrapper}>
      {item?.badge !== null && isShowBadge === true ? (
        <div className={styles.userCard__badge} data-badge={item?.badge}></div>
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
      <p className={styles.userCard__email}>
        {item?.email}{" "}
        {isEmailVerified && (
          <span>
            <AiFillCheckCircle fill="#00acee" size={16} />
          </span>
        )}
      </p>
      {flag === "subAdmin" && (
        <Button
          onClick={async () => {
            navigate("/create-sub-admin", { state: item });
          }}
          label={"Edit"}
          className={styles.userCard__button}
        />
      )}
      {item?.status === "pending" && (
        <div className={styles.userCard__button__wrapper}>
          <Button
            onClick={async () => {
              setIsLoading("accept");

              await onAccept();
              setIsLoading("");
            }}
            label={isLoading == "accept" ? "Wait.." : "Accept"}
            className={styles.userCard__button}
            disabled={isLoading == "accept"}
          />
          <Button
            disabled={isLoading == "reject"}
            onClick={async () => {
              setIsLoading("reject");
              await onReject();
              setIsLoading("");
            }}
            label={isLoading == "reject" ? "Wait.." : "Reject"}
            className={[
              styles.userCard__button,
              styles.userCard__button__bordered,
            ].join(" ")}
          />
        </div>
      )}
      {["rejected", "pending"].includes(item?.status) && (
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
      )}
      {item?.status === "accepted" && (
        <div className={styles.userCard__button__wrapper}>
          <Button
            className={styles.userCard__button}
            onClick={() => {
              viewProfileClick();
            }}
          >
            View Profile
          </Button>
          {item?.isBlockedByAdmin ? (
            <Button
              label={isLoading == "block" ? "Wait.." : "Activate"}
              onClick={async () => {
                setIsLoading("block");
                await activateDeactivateStatus(false);
                setIsLoading("");
              }}
              className={[
                styles.userCard__button,
                styles.userCard__button__bordered,
              ].join(" ")}
            />
          ) : (
            <Button
              label={isLoading == "block" ? "Wait.." : "Deactivate"}
              onClick={async () => {
                setIsLoading("block");
                await activateDeactivateStatus(true);
                setIsLoading("");
              }}
              className={[
                styles.userCard__button,
                styles.userCard__button__bordered,
              ].join(" ")}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UserCard;
