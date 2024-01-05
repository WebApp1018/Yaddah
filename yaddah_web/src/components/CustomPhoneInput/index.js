import React from "react";
import classes from "./CustomPhoneInput.module.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState } from "react";

const CustomPhoneInput = ({
  label,
  value,
  setter,
  customClass,
  form,
  placeholder = "Enter Phone Number",
}) => {
  // const [phone, setPhone] = useState("");
  const [selCountryCode, setSelCountryCode] = useState("us");
  const [selCountryExpectedLength, setSelCountryExpectedLength] = useState(0);
  const [isValid, setIsValid] = useState(true);

  console.log({
    selCountryExpectedLength,
  });

  return (
    <>
      <style>{`
    .react-tel-input .flag-dropdown{
      border-radius: 5px 0 0 5px !important;
      border: ${form ? "none" : "1px solid var(--clr-border)"} !important;
    }
    .react-tel-input .selected-flag{
      overflow:hidden;
    }
    `}</style>
      <div>
        {label && (
          <p
            className={[classes.phoneLabel, form && classes.formLabel].join(
              " "
            )}
          >
            {label}
          </p>
        )}
        <PhoneInput
          inputClass={[classes.phoneInput]}
          containerClass={[
            classes.phoneInputContainer,
            form && classes.formInput,
            customClass && customClass,
          ].join(" ")}
          placeholder={placeholder}
          enableSearch={true}
          // onChange={(phone, countryData) => {
          //   setter(phone);
          // }}
          value={value}
          isValid={(value, country) => {
            console.log(country?.iso2, value?.length);
            if (
              (country.iso2 === "sa" || country.iso2 === "ae") &&
              value?.length > 12
            ) {
              // console.log("if -----------------------------------------------------")

              return false;
            } else if (
              (country.iso2 === "sa" || country.iso2 === "ae") &&
              value?.length == 12
            ) {
              // console.log("else if -----------------------------------------------------")

              return true;
            } else {
              // console.log("else -----------------------------------------------------")
              return !isValid
                ? value?.length == selCountryExpectedLength
                : isValid;
            }
          }}
          onChange={(inputPhone, countryData) => {
            if (countryData.countryCode !== selCountryCode) {
              setter("");
              setIsValid(true);
            } else {
              setter(inputPhone);
            }
            setSelCountryCode(countryData.countryCode);
            setSelCountryExpectedLength(countryData?.format?.length);
          }}
          // onBlur={() => {
          //   value.length != selCountryExpectedLength
          //     ? setIsValid(false)
          //     : setIsValid(true);
          // }}
        />
      </div>
    </>
  );
};

export default CustomPhoneInput;
