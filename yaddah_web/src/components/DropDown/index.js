import React from "react";
import ReactSelect, { components } from "react-select";
import classes from "./DropDown.module.css";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";

const DropDown = ({
  options,
  label,
  labelTwo,
  customStyle,
  customClass,
  disabled,
  value,
  setter,
  noBorder,
  placeholder,
  isMulti,
  style,
  leftIcon,
  RightIcon,
  Components,
  labelClassName,
  indicatorColor = "var(--text-color-black)",
  optionLabel,
  optionValue,
  dropDownRef,
  form,
  textColor = "var(--text-color-black)",
  ...props
}) => {
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        {props.isFocused ? (
          <MdOutlineArrowDropUp size={30} color={indicatorColor} />
        ) : (
          <MdOutlineArrowDropDown size={30} color={indicatorColor} />
        )}
      </components.DropdownIndicator>
    );
  };

  const dropDownStyle = {
    control: (styles, { isFocused, isDisabled, isSelected }) => ({
      ...styles,
      backgroundColor: isDisabled
        ? "var(--disabled-input-color)"
        : "var(--white-color)",
      padding: "0px 4px",
      borderRadius: "0px",
      color: "var(--text-color-black)",
      boxShadow: "none",
      fontFamily: "var(--ff-rubik)",
      fontSize: "16px",
      letterSpacing: "1.4",
      cursor: "pointer",
      borderRadius: "10px",
      textTransform: "capitialize",
      border: "1px solid #9797a5",
      minHeight: form && "54px",
      ...customStyle,
      ":hover": {
        ...styles[":hover"],
        borderColor: "var(--clr-secondary)",
      },
      ":placeholder": {
        ...styles[":placeholder"],
        color: "var(--text-color-black)",
      },
      ":active": {
        ...styles[":active"],
        borderColor: "var(--clr-secondary)",
      },
    }),

    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "var(--white-color)",
      };
    },

    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isSelected && "var(--clr-secondary)",
        color: isSelected && "var(--white-color)",
        padding: "8px 12px",
        fontFamily: "var(--ff-rubik)",
        textTransform: "capitialize",

        ":active": {
          ...styles[":active"],
          backgroundColor: "var(--clr-secondary)",
        },
        ":hover": {
          ...styles[":hover"],
          color: "var(--white-color)",
          backgroundColor: "#24535773",
          cursor: "pointer",
        },
      };
    },

    multiValue: (styles, { data }) => {
      return {
        ...styles,
        backgroundColor: "var(--clr-secondary)",
        borderRadius: "14px",
        padding: "1px 10px",
        fontFamily: "var(--ff-rubik)",
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: "#fff",
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      fontSize: 12,
      color: "#fff",
      ":hover": {
        color: "#000",
      },
    }),
  };
  return (
    <div className={`${[classes.Container].join(" ")}`}>
      <style jsx>{`
        .DropdownOptionContainer__menu {
          margin: 0px;
          border-radius: 8px !important;
          z-index: 1100 !important;
        }
        .DropdownOptionContainer__single-value {
          color: ${textColor};
        }
        .DropdownOptionContainer__control {
          border: ${form && "0 !important;"};
        }
        .DropdownOptionContainer__placeholder {
          color: ${form && "#8F8B8B;"};
        }
      `}</style>
      {label && (
        <label
          htmlFor={`dropdown${label}`}
          className={`mb-2 ${[
            classes.label,
            labelClassName && labelClassName,
            disabled && classes.disabled,
          ].join(" ")}`}
        >
          {label}
        </label>
      )}

      <div className={`${[classes.dropdownContainer].join(" ")}`}>
        <ReactSelect
          inputId={`dropdown${label}`}
          value={value}
          onChange={(e) => {
            setter(e);
          }}
          ref={dropDownRef}
          className={`${form && classes.form_dropdown}  ${[
            classes.reactSelect, customClass
          ].join(" ")}`}
          isMulti={isMulti}
          isDisabled={disabled}
          placeholder={placeholder}
          options={options}
          styles={{ ...dropDownStyle, ...style }}
          isClearable={false}
          classNamePrefix={"DropdownOptionContainer"}
          components={{
            IndicatorSeparator: () => null,
            DropdownIndicator: (e) => DropdownIndicator(e),
            ...Components,
          }}
          getOptionLabel={(option) => {
            return optionLabel ? option[optionLabel] : option.label;
          }}
          getOptionValue={(option) =>
            optionValue ? option[optionValue] : option.value
          }
          {...props}
        />
        {RightIcon && <div className={classes.rightIconBox}>{RightIcon}</div>}
        {leftIcon && <div className={classes.leftIconBox}>{leftIcon}</div>}
      </div>
    </div>
  );
};
export default DropDown;
