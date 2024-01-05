import React, { useState } from "react";
import PropTypes from "prop-types";
import classes from "./input.module.css";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
export const Input = ({
  type,
  label,
  label2, // sub label
  value, // input value
  setter, //setValue
  noBorder,
  placeholder,
  disabled,
  customStyle, //Input Container inline Style
  inputStyle, //Input inline Style
  labelStyle, //Label inline Style
  error, // Show Error Boolean
  errorText, // Error Text
  leftIcon, // Icon For Input
  inputRef,
  onEnterClick,
  form,
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
      <div className={`${[classes.Container].join(" ")}`}>
        {label && (
          <label
            htmlFor={`input${label}`}
            className={`${[
              classes.labelText,
              disabled && classes.label__disabled,
            ].join(" ")}`}
            style={{ ...labelStyle }}
          >
            {label} {label2 && label2}
          </label>
        )}
        <div
          className={`${[classes.inputPassContainer].join(" ")}`}
          style={{ ...customStyle }}
        >
          {leftIcon && <div className={classes.leftIconBox}>{leftIcon}</div>}
          <input
            value={value}
            onChange={(e) => {
              setter(e.target.value);
            }}
            disabled={disabled}
            placeholder={placeholder}
            type={passToggle == true ? "text" : type}
            onKeyDown={(e) => {
              if (type === "number") {
                return (
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                );
              }
            }}
            id={`input${label}`}
            className={` ${[
              classes.inputBox,
              noBorder && classes.noBorder,
              disabled && classes.disabled,
              form && classes.formInput,
            ].join(" ")}`}
            style={{ ...inputContainerStyleObject, ...inputStyle }}
            onKeyPress={(e) =>
              ["Enter", "NumpadEnter"].includes(e.code) && onEnterClick()
            }
            onBlur={() => {
              setter(value?.trim());
            }}
            ref={inputRef}
            {...props}
          />
          {type == "password" && passToggle == false && (
            <MdVisibilityOff
              className={classes.passwordIcon}
              onClick={(e) => setPassToggle(!passToggle)}
            />
          )}
          {type == "password" && passToggle && (
            <MdVisibility
              className={classes.passwordIcon}
              onClick={(e) => setPassToggle(!passToggle)}
            />
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
  value: PropTypes.string.isRequired,
  setter: PropTypes.string,
  noBorder: PropTypes.bool,
  disabled: PropTypes.bool,
  customStyle: PropTypes.string,
  error: PropTypes.bool,
  errorText: PropTypes.string,
  label2: PropTypes.string,
};

Input.defaultProps = {
  type: "text",
  placeholder: "enter text",
  value: "",
  noBorder: false,
  disabled: false,
  error: false,
  errorText: "An error has occurred, check your details!",
};
