import React from "react";

import classes from "./SMList.module.css";

const SMList = ({ title, onClick, isSelected }) => {
  return (
    <div
      onClick={onClick.bind(this, title)}
      className={`${classes?.SMList__main} ${
        isSelected && classes?.SMList__selected
      }`}
    >
      <p>{title}</p>
    </div>
  );
};

export default SMList;
