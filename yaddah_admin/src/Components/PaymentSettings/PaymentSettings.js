import React from "react";

import classes from "./PaymentSettings.module.css";
import { toast } from "react-toastify";
import { Input } from "../Input/Input";
import { Col, Row } from "react-bootstrap";
import { Button } from "../Button/Button";
import { useState } from "react";
import Radio from "../Radio";

const PaymentSettings = ({ data, onClick, isLoading }) => {
  const dataObj = data?.paypal;
  const [APP_SECRET_LIVE, setAPP_SECRET_LIVE] = useState(
    dataObj?.APP_SECRET_LIVE
  );
  const [APP_SECRET_SANDBOX, setAPP_SECRET_SANDBOX] = useState(
    dataObj?.APP_SECRET_SANDBOX
  );
  const [CLIENT_ID_LIVE, setCLIENT_ID_LIVE] = useState(dataObj?.CLIENT_ID_LIVE);
  const [CLIENT_ID_SANDBOX, setCLIENT_ID_SANDBOX] = useState(
    dataObj?.CLIENT_ID_SANDBOX
  );
  const [MODE, setMODE] = useState(dataObj?.MODE?.toLowerCase());

  // handleSubmit
  const handleSubmit = () => {
    // check if no changes are made
    if (
      APP_SECRET_LIVE === dataObj?.APP_SECRET_LIVE &&
      APP_SECRET_SANDBOX === dataObj?.APP_SECRET_SANDBOX &&
      CLIENT_ID_LIVE === dataObj?.CLIENT_ID_LIVE &&
      CLIENT_ID_SANDBOX === dataObj?.CLIENT_ID_SANDBOX &&
      MODE === dataObj?.MODE?.toLowerCase()
    )
      return toast.info("No changes are made to the payment settings");

    const params = {
      APP_SECRET_LIVE,
      APP_SECRET_SANDBOX,
      CLIENT_ID_LIVE,
      CLIENT_ID_SANDBOX,
      MODE: MODE?.toLowerCase(),
      configId: data?._id,
      keyType: data?.keyType,
    };

    // validate
    for (let key in params)
      if (params[key] === "") return toast.info("Please fill all fields");

    onClick(params);
  };

  return (
    <div>
      <h1 className="mt-5">Paypal</h1>
      <Row className="mt-4">
        <p
          style={{
            fontSize: "18px",
            marginBottom: "0px",
          }}
        >
          Select Mode:
        </p>
        <Radio label="live" value={MODE} setValue={setMODE} />
        <Radio label="sandbox" value={MODE} setValue={setMODE} />
      </Row>
      <Row>
        <Col md={6} className="mt-4">
          <Input
            label={"App Secret (Live)"}
            value={APP_SECRET_LIVE}
            setter={setAPP_SECRET_LIVE}
          />
        </Col>
        <Col md={6} className="mt-4">
          <Input
            label={"Client ID (Sandbox)"}
            value={CLIENT_ID_SANDBOX}
            setter={setCLIENT_ID_SANDBOX}
          />
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mt-4">
          <Input
            label={"App Secret (Sandbox)"}
            value={APP_SECRET_SANDBOX}
            setter={setAPP_SECRET_SANDBOX}
          />
        </Col>
        <Col md={6} className="mt-4">
          <Input
            label={"Client ID (Live)"}
            value={CLIENT_ID_LIVE}
            setter={setCLIENT_ID_LIVE}
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

export default PaymentSettings;
