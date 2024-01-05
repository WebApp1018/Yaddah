import React, { useEffect, useState } from "react";

import classes from "./Forms.module.css";
import { Col, Row } from "react-bootstrap";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { toast } from "react-toastify";

const AmazonSesForm = ({ data, onClick, isLoading }) => {
  const dataObj = data?.awsSes;
  const [EMAIL_FROM, setEMAIL_FROM] = useState(dataObj?.EMAIL_FROM);
  const [API_VERSION, setAPI_VERSION] = useState(dataObj?.API_VERSION);
  const [AWS_ACCESS_KEY, setAWS_ACCESS_KEY] = useState(dataObj?.AWS_ACCESS_KEY);
  const [AWS_SECRET_KEY, setAWS_SECRET_KEY] = useState(dataObj?.AWS_SECRET_KEY);
  const [AWS_SES_REGION, setAWS_SES_REGION] = useState(dataObj?.AWS_SES_REGION);

  // handleSubmit
  const handleSubmit = (isCheckingRequired = true) => {
    // check if no changes are made
    if (
      dataObj?.EMAIL_FROM === EMAIL_FROM &&
      dataObj?.API_VERSION === API_VERSION &&
      dataObj?.AWS_ACCESS_KEY === AWS_ACCESS_KEY &&
      dataObj?.AWS_SECRET_KEY === AWS_SECRET_KEY &&
      dataObj?.AWS_SES_REGION === AWS_SES_REGION &&
      isCheckingRequired
    )
      return toast.info("No changes made to the aws ses settings");

    const params = {
      EMAIL_FROM,
      API_VERSION,
      AWS_ACCESS_KEY,
      AWS_SECRET_KEY,
      AWS_SES_REGION,
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
        <Col md={6} className="mt-4">
          <Input
            label={"Email From"}
            value={EMAIL_FROM}
            setter={setEMAIL_FROM}
          />
        </Col>
        <Col md={6} className="mt-4">
          <Input
            label={"Api Version"}
            value={API_VERSION}
            setter={setAPI_VERSION}
          />
        </Col>
        <Col md={6} className="mt-4">
          <Input
            label={"Aws Access Key"}
            value={AWS_ACCESS_KEY}
            setter={setAWS_ACCESS_KEY}
          />
        </Col>
        <Col md={6} className="mt-4">
          <Input
            label={"Aws SES Bucket Region"}
            value={AWS_SES_REGION}
            setter={setAWS_SES_REGION}
          />
        </Col>

        <Col md={6} className="mt-4">
          <Input
            label={"Aws Secret Key"}
            value={AWS_SECRET_KEY}
            setter={setAWS_SECRET_KEY}
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

export default AmazonSesForm;
