import { useNavigate } from "react-router-dom";
import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { Button } from "../Button/Button";
import DropDown from "../DropDown";
import { Input } from "../Input/Input";
import classes from "./homeSearch.module.css";

function HomeSearch({ categoryOptions }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState();
  const [category, setCategory] = useState(null);
  const catRef = useRef(null);

  return (
    <form
      onSubmit={(e) => e?.preventDefault()}
      autoComplete={"off"}
      className={classes.search__bar}
    >
      <div className={classes.input__div}>
        <Input
          state={search}
          setter={setSearch}
          placeholder={"Search keyword"}
          type={"text"}
          customStyle={{
            borderBottom: "1px solid #c9c9c996",
            backgroundColor: "var(--clr-font)",
            height: "50px",
            borderRadius: "0px",
            width:"100%"
          }}
          inputStyle={{
            fontFamily: "Rubik",
          }}
          onKeyDown={(e) => {
            if (e?.keyCode == 13) {
              catRef.current.focus();
              catRef.current.onMenuOpen();
            }
          }}
        />
        
        <DropDown
        customClass={classes.dropdown}
          setter={setCategory}
          dropDownRef={catRef}
          value={category}
          options={categoryOptions}
          customStyle={{
            border: "none",
            borderRadius: "0px",
            color: "var(--white-color)",
            // width: "170px",
            backgroundColor: "transparent",
            // height: "50px",
            textAlign:"start"
          }}
          placeholder={"Select category"}
          indicatorColor={"var(--white-color)"}
          textColor={"var(--white-color)"}
          optionLabel={"name"}
          optionValue={"_id"}
        />
      </div>
      <Button
        className={classes.btn}
        onClick={() => {
          navigate("/services", {
            state: {
              search: search,
              category: category?._id,
            },
          });
        }}
      >
        Search
      </Button>
    </form>
  );
}

export default HomeSearch;
