import React from "react";
import { useState } from "react";
import styles from "./UserCard.module.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Button } from "../Button/Button";
import { imageUrl } from "../../config/apiUrl";
import { EmptyProfile } from "../../constant/imagePath";

const UserCard = ({
  item,
  onOptions,
  options = ["View Detail"],
  onEdit,
  onStatusChange,
}) => {
  const [ContextMenu, setContextMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className={styles.userCard__wrapper}>
      <img
        className={styles.userCard__img}
        src={imageUrl(item?.image)}
        alt=""
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = EmptyProfile;
        }}
      />
      <p className={`${styles.userCard__name} userNameStyles`}>
        {item?.staffName}
      </p>
      <p className={styles.userCard__email}>{item?.email}</p>
      <div className={styles.userCard__button__wrapper}>
        <Button
          label={"Edit"}
          className={styles.userCard__button}
          onClick={onEdit}
        />
        <Button
          label={
            isLoading ? "Wait..." : !item?.isActive ? "Activate" : "Deactivate"
          }
          className={[
            styles.userCard__button,
            styles.userCard__button__bordered,
          ].join(" ")}
          onClick={async () => {
            setIsLoading(true);
            await onStatusChange();
            setIsLoading(false);
          }}
        />
      </div>
      <div className={styles.userCard__contextMenu__wrapper}>
        <Button
          className={styles.userCard__contextMenu__btn}
          onClick={() =>
            ContextMenu ? setContextMenu(false) : setContextMenu(true)
          }
        >
          <BsThreeDotsVertical />
        </Button>
        {ContextMenu ? (
          <div className={styles.userCard__contextMenu}>
            {options?.map((item, key) => (
              <p key={key} onClick={() => onOptions(item)}>
                {item}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UserCard;
