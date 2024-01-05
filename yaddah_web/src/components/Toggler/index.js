import React from "react";
import Switch from "react-switch";
import { Col, Row } from "react-bootstrap";
import classes from "./Toggler.module.css";

const Toggler = ({ text = "Enter Text", setChecked, checked,disabled }) => {
  const handleChange = (event) => {
    setChecked((prev) => !prev);
  };

  return (
    <>
      <style>
        {`
        .switcher_b .MuiSwitch-thumb{
              color: #ffffff !important;
              }
         .switcher_b .MuiSwitch-track{
              opacity:1 !important;
              background-color: #245357 !important;
              }
        .switcher_b .react-switch .react-switch-bg{
              //  background-color: #245357 !important;
              }
        .switcher_b .react-switch .react-switch-bg svg{
            display:none !important
         }



`}
      </style>
      <div>
        <Row className={classes.toggle_row}>
          <Col md={6}>
            <h6>{text}</h6>
          </Col>
          <Col md={6} className={`switcher_b ${classes.toggle_col}`}>
            <Switch
              onColor={"#245357"}
              onHandleColor={"#fff"}
              offColor={"#d3d3d3"}
              offHandleColor={"#245357"}
              checkedIcon={false}
              uncheckedIcon={false}
              className="react-switch"
              onChange={handleChange}
              checked={checked}
              disabled={disabled}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Toggler;
