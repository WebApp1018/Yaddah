import React from "react";
import classes from "./noData.module.css";
import { ImSearch } from "react-icons/im";

function NoData({ text = "No Data Found", isAdminThemeColor, className }) {
  return (
    <div
      className={`${classes.noDataContainer} ${
        isAdminThemeColor && classes.adminThemeColor
      } ${className && className}`}
    >
      <ImSearch size={60} />
      <p>{text}</p>
    </div>
  );
}

export default NoData;
