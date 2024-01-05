import React from "react";

import classes from "./FormCard.module.css";

const FormCard = ({ children, className, type }) => {
  return (
    <div
      className={`${classes?.container} ${className && className} ${
        type == "black" && classes?.blackCard
      }`}
    >
      {children}
    </div>
  );
};

export default FormCard;
