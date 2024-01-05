import React from "react";

import classes from "./ServiceProviderCard.module.css";
import { imageUrl } from "../../config/apiUrl";

const ServiceProviderCard = ({ item }) => {
  return (
    <div className={classes?.mainContainer}>
      <div className={classes?.imageContainer}>
        <img src={imageUrl(item?.photo)} alt="profile image" />
      </div>
      <div className={classes?.infoContainer}>
        <h5 className="maxLine1">{item?.fullName}</h5>
        <p className="maxLine1">{item?.description || "N/A"}</p>

        {/* service mapper */}
        <div className={classes?.serviceContainer}>
          {item?.serviceCategory?.map((item, index) => (
            <div key={index} className={classes?.service}>
              <p>{item?.name}</p>
            </div>
          ))}
        </div>
      </div>
      {item?.userRating !== "none" && (
        <div
          data-badge={item?.userRating.replace(/-/g, " ")}
          className={classes?.spBadge}
        />
      )}
    </div>
  );
};

export default ServiceProviderCard;
