import React from "react";
import classes from "./loader.module.css";
import Spinner from "react-bootstrap/Spinner";

export const Loader = ({ className, customStyle }) => {
  return (
    <>
      <div
        className={`${classes.loaderContainer} ${className && className}`}
        style={customStyle}
      >
        <div className={classes.loaderBox}>
          <Spinner animation="grow" className={classes.loader} />
          <Spinner animation="grow" className={classes.loader} />
          <Spinner animation="grow" className={classes.loader} />
        </div>
      </div>
    </>
  );
};
