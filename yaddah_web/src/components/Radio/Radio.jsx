import React from "react";
import Fonts from "../assets/Fonts";
import Colors from "../assets/Colors";
import classes from "./Radio.module.css";
import PropTypes from "prop-types";

export const Radio = ({ value, setValue, label, disabled }) => {
  console.log("val", value);
  return (
    <div className={`my-2 ${classes.radioWithLabel}`}>
      <style jsx>{`
        .${classes.radioInput} {
          accent-color: ${Colors.neutralShadesOfNero};
        }

        .${classes.label} {
          color: ${Colors.neutralShadesOfDimGray};
        }
        .${classes.labelDisabled} {
          color: ${Colors.neutralShadesOfDimGray};
        }
        .${classes.labelChecked} {
          color: ${Colors.neutralShadesOfNero};
        }
      `}</style>

      <input
        type="radio"
        id={`radio${label}`}
        checked={value === label && "checked"}
        disabled={disabled}
        onChange={(e) => {
          setValue(label);
        }}
        className={`${[classes.radioInput].join(" ")}`}
      />
      {label && (
        <label
          htmlFor={`radio${label}`}
          className={`${classes.label}`}
          style={{
            ...Fonts.p1,
            color:
              value === label && disabled === false
                ? Colors.neutralShadesOfNero
                : disabled == true
                ? Colors.neutralShadesOfPinkSwan
                : Colors.neutralShadesOfDimGray,
          }}
        >
          {label}
        </label>
      )}
    </div>
  );
};

Radio.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
};
Radio.defaultProps = {
  value: false,
  disabled: false,
  label: null,
};
