import React from "react";
import { Button } from "../Button/Button";
import classes from "./VenueCard.module.css";
import { imageUrl } from "../../config/apiUrl";
import { getRandomArrayIndex } from "../../Helper/commonHelper";
const VenueCard = ({ item, onClick, selectedVenue }) => {
  return (
    <div
      className={`${classes.main} ${
        selectedVenue?._id == item?._id && classes?.activeItem
      }`}
    >
      <div className={classes.img}>
        <img
          src={imageUrl(item?.images[getRandomArrayIndex(item?.images)])}
          alt=""
        />
      </div>
      <h4 className="t-t-c">{item?.name}</h4>
      <div>
        <span className={`${classes.loc}`}>
          <span className={classes.subHead}>Location: </span>
          {item?.address}
        </span>
      </div>
      <Button
        label={"View Detail"}
        customStyle={{
          width: "120px",
          backgroundColor: "var(--clr-primary)",
          padding: "10px",
        }}
        onClick={onClick}
      />
    </div>
  );
};

export default VenueCard;
