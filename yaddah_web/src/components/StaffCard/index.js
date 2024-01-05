import React from "react";
import venueImage from "../../assets/images/photography.png";
import { imageUrl } from "../../config/apiUrl";
import { Button } from "../Button/Button";
import classes from "./StaffCard.module.css";

const StaffCard = ({
  item,
  selectedStaff,
  onClick,
  isGettingStaffSchedule,
}) => {
  return (
    <div className={classes.container}>
      <div
        className={`${classes.main} ${
          selectedStaff?._id === item?._id && classes?.activeItem
        }`}
      >
        <div className={classes.img}>
          <img
            src={imageUrl(item?.image)}
            alt=""
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = venueImage;
            }}
          />
        </div>
        <div className={classes.head}>
          <h4 className="t-t-c">{item?.staffName}</h4>
        </div>

        <Button
          label={
            isGettingStaffSchedule === item?._id ? "Please Wait..." : "Book Now"
          }
          variant="primary"
          customStyle={{
            width: "120px",
            backgroundColor: "var(--clr-primary)",
            padding: "10px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        />
      </div>
    </div>
  );
};

export default StaffCard;
