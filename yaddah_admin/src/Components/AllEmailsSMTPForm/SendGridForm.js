import React, { useEffect, useState } from "react";

import classes from "./Forms.module.css";
import { Col, Row } from "react-bootstrap";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { toast } from "react-toastify";

const SendGridForm = ({ data, onClick, isLoading }) => {
  const dataObj = data?.sendgrid;
  const [EMAIL_FROM, setEMAIL_FROM] = useState(dataObj?.EMAIL_FROM);
  const [SENDGRID_USERNAME, setSENDGRID_USERNAME] = useState(
    dataObj?.SENDGRID_USERNAME
  );
  const [SENDGRID_PASSWORD, setSENDGRID_PASSWORD] = useState(
    dataObj?.SENDGRID_PASSWORD
  );

  // handleSubmit
  const handleSubmit = (isCheckingRequired = true) => {
    // check if no changes are made
    if (
      dataObj?.EMAIL_FROM === EMAIL_FROM &&
      dataObj?.SENDGRID_USERNAME === SENDGRID_USERNAME &&
      dataObj?.SENDGRID_PASSWORD === SENDGRID_PASSWORD &&
      isCheckingRequired
    )
      return toast.info("No changes made to the sendgrid settings");

    const params = {
      EMAIL_FROM,
      SENDGRID_PASSWORD,
      SENDGRID_USERNAME,
      configId: data?._id,
      keyType: data?.keyType,
      isSelect: true,
    };

    // validate
    for (let key in params)
      if (params[key] === "") {
        isCheckingRequired && toast.info("Please fill all fields");
        return;
      }

    onClick(params, isCheckingRequired);
  };

  useEffect(() => {
    if (dataObj) handleSubmit(false);
  }, []);

  return (
    <div>
      <Row>
        <Col md={12} className="mt-4">
          <Input
            label={"Email From"}
            value={EMAIL_FROM}
            setter={setEMAIL_FROM}
          />
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mt-4">
          <Input
            label={"User Name"}
            value={SENDGRID_USERNAME}
            setter={setSENDGRID_USERNAME}
          />
        </Col>
        <Col md={6} className="mt-4">
          <Input
            label={"Password"}
            value={SENDGRID_PASSWORD}
            setter={setSENDGRID_PASSWORD}
          />
        </Col>
      </Row>

      <div className={classes?.buttonContainer}>
        <Button
          variant={"primary"}
          disabled={isLoading}
          label={isLoading ? "Please Wait..." : "Submit"}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default SendGridForm;
