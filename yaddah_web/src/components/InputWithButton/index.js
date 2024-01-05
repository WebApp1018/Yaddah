import React, { useState } from "react";
import classes from "./InputWithButton.module.css";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import { toast } from "react-toastify";

const InputWithButton = ({
  inputClass = classes.inputClass,
  onClick,
  btnChildern,
  placeholder,
}) => {
  const [value, setValue] = useState("");
  const handleSubmit = async () => {
    if (value?.trim() == "") {
      return;
    }
    await onClick(value);
    setValue("");
  };

  return (
    <>
      <div className={classes.chat__wrapper}>
        <Input
          className={inputClass}
          state={value}
          setter={setValue}
          placeholder={placeholder}
          type={"text"}
          onEnterClick={handleSubmit}
          inputStyle={{
            borderRadius: "22px",
            border: "none",
          }}
        />
        <Button
          className={classes.chat_btn}
          leftIcon={btnChildern}
          onClick={handleSubmit}
        />
      </div>
    </>
  );
};

export default InputWithButton;
