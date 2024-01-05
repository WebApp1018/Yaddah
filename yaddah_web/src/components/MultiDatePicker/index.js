import React from "react";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import classes from "./MultiDatePicker.module.css";

function MultiDatePicker({
  value,
  setValue,
  label,
  multiple = true,
  disabled,
  placeholder = "Select Date",
}) {
  return (
    <div className={classes.pickerDiv}>
      {label && (
        <label
          htmlFor={`input${label}`}
          className={`mb-2  ${[
            classes.labelText,
            disabled && classes.disabled,
          ].join(" ")}`}
        >
          {label}
        </label>
      )}
      <DatePicker
        className={classes.picker}
        value={value}
        onChange={(e) => setValue(e)}
        multiple={multiple}
        plugins={[<DatePanel />]}
        disabled={disabled}
        placeholder={placeholder}
        minDate={new Date()}
      />
    </div>
  );
}

export default MultiDatePicker;
