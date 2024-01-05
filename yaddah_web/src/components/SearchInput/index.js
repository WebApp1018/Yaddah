import React from "react";
import { BiSearch } from "react-icons/bi";
import { Input } from "../Input/Input";
import classes from "./SearchInput.module.css";

function SearchInput({
  value,
  setter,
  placeholder = "Search",
  customStyle = {
    border: "1px solid var(--dashboard-color)",
    borderRadius: "8px",
    width: "280px",
    padding: "0px",
    fontFamily: "var(--ff-poppins-semibold)",
  },
  inputStyle = {
    padding: "8px 34px",
    fontSize: "14px",
    height: "45px",
  },
  className = "",
}) {
  return (
    <>
      <div style={{ position: "relative" }}>
        <div className={classes.search_icon}>
          <BiSearch size={22} color={"var(--placeholder-color)"} />
        </div>
        <Input
          setter={setter}
          state={value}
          customStyle={customStyle}
          inputStyle={inputStyle}
          placeholder={placeholder}
          containerClassName={className}
        />
      </div>
    </>
  );
}

export default SearchInput;
