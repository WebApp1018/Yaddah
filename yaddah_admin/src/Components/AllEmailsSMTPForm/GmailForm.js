import React, { useEffect, useState } from "react";

import classes from "./Forms.module.css";
import { Col, Row } from "react-bootstrap";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { toast } from "react-toastify";

const GmailForm = ({ data, onClick, isLoading }) => {
  const dataObj = data?.gmail;
  const [HOST, setHOST] = useState(dataObj?.HOST);
  const [PASSWORD, setPASSWORD] = useState(dataObj?.PASSWORD);
  const [PORT, setPORT] = useState(dataObj?.PORT);
  const [SERVICE, setSERVICE] = useState(dataObj?.SERVICE);
  const [USER, setUSER] = useState(dataObj?.USER);

  // handleSubmit
  const handleSubmit = (isCheckingRequired = true) => {
    // check if no changes are made
    if (
      dataObj?.HOST === HOST &&
      dataObj?.PASSWORD === PASSWORD &&
      dataObj?.PORT === PORT &&
      dataObj?.SERVICE === SERVICE &&
      dataObj?.USER === USER &&
      isCheckingRequired
    )
      return toast.info("No changes made to the gmail settings");

    const params = {
      HOST,
      PASSWORD,
      PORT,
      SERVICE,
      USER,
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
          <Input label={"Host"} value={HOST} setter={setHOST} disabled={true} />
        </Col>

        <Col md={6} className="mt-4">
          <Input
            label={"Port"}
            value={PORT}
            setter={setPORT}
            disabled={true}
            type={"Number"}
          />
        </Col>
        <Col md={6} className="mt-4">
          <Input label={"Service"} value={SERVICE} setter={setSERVICE} />
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mt-4">
          <Input label={"User"} value={USER} setter={setUSER} />
        </Col>
        <Col md={6} className="mt-4">
          <Input label={"Password"} value={PASSWORD} setter={setPASSWORD} />
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

export default GmailForm;
