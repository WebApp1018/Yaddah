import React from "react";
import classes from "./TextArea.module.css";
import PropTypes from "prop-types";

export function TextArea({
  value,
  setter,
  label,
  placeholder='Enter here...',
  customStyle,
  labelStyle,
  rows = 5,
  className = "",
  form
}) {
  return (
    <div className={`${classes.textAreaBox} ${form && classes?.formContainer}`}>
      {label && <label style={{ ...labelStyle }}>{label}</label>}
      <textarea
        placeholder={placeholder}
        value={value}
        style={{ ...customStyle }}
        onChange={(e) => {
          setter(e.target.value);
        }}
        rows={rows}
        className={className}
      />
    </div>
  );
}
TextArea.propTypes = {
  value: PropTypes.string,
  setter: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  customStyle: PropTypes.object,
  labelStyle: PropTypes.object,
};
