import React from "react";
import classes from "./CustomPhoneInput.module.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CustomPhoneInput = ({
  value,
  setter,
  placeholder = "Phone",
  disabled,
  label,
  form,
}) => {
  return (
    <>
      <style>{`
    .react-tel-input .flag-dropdown{
      border:none !important;
    }
   
    `}</style>
      <div>
        {label && (
          <label
            className={[
              classes.phoneLabel,
              disabled && classes.labelDisabled,
            ].join(" ")}>
            {label}
          </label>
        )}
        <PhoneInput
          inputClass={[classes.phoneInput].join(" ")}
          containerClass={[
            classes.phoneInputContainer,
            form && classes.formContainer,
          ].join(" ")}
          placeholder={placeholder}
          enableSearch={true}
          value={value}
          onChange={(phone) => {
            setter(phone);
          }}
          disabled={disabled}
          inputStyle={{
            ...(disabled && { background: "var(--disabled-input-color)" }),
          }}
        />
      </div>
    </>
  );
};

export default CustomPhoneInput;
