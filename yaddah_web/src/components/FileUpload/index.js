import React, { useRef } from "react";
import { Button } from "../Button/Button";
import classes from "./fileUpload.module.css";

function FileUpload({
  value,
  setter,
  label,
  subLabel,
  placeholder = "Select File",
  btnLabel="Browse"
}) {
  const inputRef = useRef(null);
  return (
    <>
      {label && (
        <label className={classes.label}>
          {label}{" "}
          {subLabel && <span className={classes?.subLabel}>{subLabel}</span>}
        </label>
      )}
      <div className={classes.fileUpload}>
        <p color={value && "var(--white-color)"}>
          {value ? value?.name : placeholder}
        </p>
        <Button
          className={classes.btn}
          onClick={() => inputRef?.current?.click()}
        >
          {btnLabel}
        </Button>
        <input
          type={"file"}
          hidden
          ref={inputRef}
          onChange={(e) => setter(e?.target?.files[0])}
        />
      </div>
    </>
  );
}

export default FileUpload;
