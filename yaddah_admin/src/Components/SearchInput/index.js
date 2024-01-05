import React from "react";
import { BiSearch } from "react-icons/bi";
import { Input } from "../Input/Input";

function SearchInput({
  value,
  setter,
  placeholder = "Search",
  customStyle = {
    height: "52px",
    border: "1px solid var(--dashboard-color)",
    borderRadius: "8px",
    width: "280px",
    padding: "0px",
    fontFamily: "var(--ff-poppins-semibold)",
  },
}) {
  return (
    <Input
      setter={setter}
      value={value}
      placeholder={placeholder}
      leftIcon={<BiSearch size={25} color={"var(--placeholder-color)"} />}
    />
  );
}

export default SearchInput;
