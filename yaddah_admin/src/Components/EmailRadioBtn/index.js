import React from "react";
import classes from "./EmailRadioBtn.module.css";
import { IoRadioButtonOff, IoRadioButtonOnOutline } from "react-icons/io5";
import {
  gmailImg,
  mailgunImg,
  outlook,
  postMarkImg,
  sendgridImg,
  swsSesImg,
} from "../../constant/imagePath";

const EmailRadioBtn = ({ label, value, setValue }) => {
  const Logo = [
    { name: "sendgrid", img: sendgridImg },
    { name: "mailgun", img: mailgunImg },
    { name: "postmark", img: postMarkImg },
    { name: "gmail", img: gmailImg },
    { name: "awsSes", img: swsSesImg },
    { name: "office365", img: outlook },
  ];
  return (
    <div
      key={label}
      className={`${classes?.typeList} ${label === value && classes?.active}`}
      onClick={() => setValue(label)}
    >
      {label === value ? (
        <IoRadioButtonOnOutline size={20} className={`${classes?.radioIcon}`} />
      ) : (
        <IoRadioButtonOff size={20} className={`${classes?.radioIcon}`} />
      )}

      <img
        src={Logo?.find((e) => e.name === label)?.img}
        alt={label}
        className={classes?.typeImg}
      />
    </div>
  );
};

export default EmailRadioBtn;
