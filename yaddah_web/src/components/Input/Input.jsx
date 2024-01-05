import React, { useState } from "react";
import PropTypes from "prop-types";
import classes from "./input.module.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { numberRegEx } from "../../config/apiUrl";

/**
 * Primary UI component for user interaction
 */
export const Input = ({
  type = "text",
  label,
  state,
  setter,
  noBorder,
  placeholder,
  disabled,
  customStyle,
  inputStyle,
  error,
  errorText,
  label2,
  form,
  onEnterClick,
  containerClassName = "",
  leftIcon,
  ...props
}) => {
  const [passToggle, setPassToggle] = useState(false);
  let inputContainerStyleObject = Object.assign(
    {},
    error && { border: `1px solid red ` },
    leftIcon && { padding: "15px 10px" }
  );
  return (
    <>
      <div
        className={`${[classes.Container, containerClassName].join(" ")}`}
        style={{ ...customStyle }}
        
      >
        {label && (
          <label
            htmlFor={`input${label}`}
            className={`mb-2  ${[
              classes.labelText,
              disabled && classes.disabled,
            ].join(" ")}`}
          >
            {label} {label2 && label2}
          </label>
        )}
        <div className={`${[classes.inputPassContainer].join(" ")}`}>
          {leftIcon && <div className={classes.leftIconBox}>{leftIcon}</div>}
          <input
          {...props}
            value={state}
            onChange={(e) => {
              if (type == "number" || type === "tel") {
                setter(e?.target?.value?.replace(numberRegEx, ""));
                return;
              }
              setter(e.target.value);
            }}
            onKeyDown={(e) => {
              if (type == "number" || type === "tel") {
                return (
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                );
              }
            }}
            disabled={disabled}
            placeholder={placeholder}
            type={passToggle == true ? "text" : type}
            id={`input${label}`}
            className={` ${[
              classes.inputBox,
              noBorder && classes.noBorder,
              form && classes.formInput,
            ].join(" ")}`}
            style={{ ...inputContainerStyleObject, ...inputStyle }}
            onKeyPress={(e) =>
              ["Enter", "NumpadEnter"].includes(e.code) && onEnterClick()
            }
            onBlur={() => {
              setter(state?.trim());
            }}
          />
          {type == "password" && passToggle == false && (
            <VisibilityOffIcon onClick={(e) => setPassToggle(!passToggle)} />
          )}
          {type == "password" && passToggle && (
            <VisibilityIcon onClick={(e) => setPassToggle(!passToggle)} />
          )}
        </div>
        {error && (
          <p className={`mt-2 ${[classes.errorText].join(" ")}`}>{errorText}</p>
        )}
      </div>
    </>
  );
};

Input.propTypes = {
  type: PropTypes.oneOf.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  state: PropTypes.string.isRequired,
  setter: PropTypes.string,
  noBorder: PropTypes.bool,
  disabled: PropTypes.bool,
  customStyle: PropTypes.string,
  error: PropTypes.bool,
  errorText: PropTypes.string,
  label2: PropTypes.string,
};

Input.defaultProps = {
  type: "email",
  placeholder: "Enter Text",
  state: "",
  noBorder: false,
  disabled: false,
  error: false,
  errorText: "An error has occurred, check your details!",
};
