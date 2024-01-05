import React from "react";
import ReactSelect, { components } from "react-select";
import classes from "./DropDown.module.css";
import PropTypes from "prop-types";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";

export const DropDown = ({
  options,
  label,
  labelTwo,
  customStyle,
  disabled,
  value,
  setter,
  noBorder,
  placeholder,
  isMulti,
  style,
  leftIcon,
  Components,
  labelClassName,
  indicatorColor = "var(--text-color-black)",
  optionLabel,
  optionValue,
  form,
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
      padding: form ? '4px 12px' : "0px",
      borderRadius: "0px",
      color: "var(--text-color-black)",
      boxShadow: form ? '-4px 4px 20px #00000029' : 'none',
      fontFamily: "Poppins-regular",
      fontSize: "16px",
      letterSpacing: "1.4",
      cursor: "pointer",
      borderRadius: "10px",
      textTransform: "capitialize",
      border: "1px solid #9797a5",
      ...customStyle,
      ":hover": {
        ...styles[":hover"],
        borderColor: "var(--main-color)",
      },
      ":placeholder": {
        ...styles[":placeholder"],
        color: "var(--text-color-black)",
      },
      ":active": {
        ...styles[":active"],
        borderColor: "var(--primary-color)",
      },
    }),

    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "var(--text-color-black)",
      };
    },

    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isSelected && "var(--dashboard-color)",
        color: isSelected && "var(--white-color)",
        padding: "8px 12px",
        fontFamily: "var(--ff-rubik)",
        textTransform: "capitialize",


        ":active": {
          ...styles[":active"],
          backgroundColor: "var(--dashboard-color)",
        },
        ":hover": {
          ...styles[":hover"],
          color: "var(--white-color)",
          backgroundColor: "#bb585587",
          cursor: "pointer",
        },
      };
    },

    multiValue: (styles, { data }) => {
      return {
        ...styles,
        backgroundColor: "var(--dashboard-color)",
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
          color: var(--text-color-black);
        }
      `}</style>
      {label && (
        <label
          htmlFor={`dropdown${label}`}
          className={`mb-2 ${[
            classes.label,
            labelClassName && labelClassName,
            disabled && classes.disabled,
            form && classes.formLabel
          ].join(" ")}`}
        >
          {label}
        </label>
      )}

      <div className={`${[classes.dropdownContainer,].join(" ")}`}>
        <ReactSelect
          inputId={`dropdown${label}`}
          value={value}
          onChange={(e) => {
            setter(e);
          }}
          className={`${[classes.reactSelect].join(" ")}`}
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
        {leftIcon && <div className={classes.leftIconBox}>{leftIcon}</div>}
      </div>
    </div>
  );
};

DropDown.propTypes = {
  options: PropTypes.array.isRequired,
  label: PropTypes.string,
  labelTwo: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.object.isRequired,
  setter: PropTypes.object,
  disabled: PropTypes.bool,
  isMulti: PropTypes.bool,
  customStyle: PropTypes.object,
  style: PropTypes.object,
  Components: PropTypes.object,
  labelClassName: PropTypes.string,
};

DropDown.defaultProps = {
  placeholder: "sdsad",
  value: "aaaa",
  disabled: false,
  isMulti: false,
  options: [],
  Components: {},
};
