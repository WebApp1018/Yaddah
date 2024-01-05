import React, { useState } from "react";

import classes from "./StorageSettings.module.css";
import { Col, Row } from "react-bootstrap";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { toast } from "react-toastify";

const StorageSettings = ({ data, onClick, isLoading }) => {
  const dataObj = data?.s3;
  const [AWS_ACCESS_KEY, setAWS_ACCESS_KEY] = useState(dataObj?.AWS_ACCESS_KEY);
  const [AWS_BUCKET_REGION, setAWS_BUCKET_REGION] = useState(
    dataObj?.AWS_BUCKET_REGION
  );
  const [AWS_IMAGE_BUCKET_NAME, setAWS_IMAGE_BUCKET_NAME] = useState(
    dataObj?.AWS_IMAGE_BUCKET_NAME
  );
  const [AWS_SECRET_KEY, setAWS_SECRET_KEY] = useState(dataObj?.AWS_SECRET_KEY);
  const [AWS_USERNAME, setAWS_USERNAME] = useState(dataObj?.AWS_USERNAME);
  const [AWS_VIDEO_BUCKET_LINK, setAWS_VIDEO_BUCKET_LINK] = useState(
    dataObj?.AWS_VIDEO_BUCKET_LINK
  );
  const [AWS_ENDPOINT, setAWS_ENDPOINT] = useState(dataObj?.AWS_ENDPOINT);

  // handleSubmit
  const handleSubmit = () => {
    // check if no changes are made
    if (
      dataObj?.AWS_ACCESS_KEY === AWS_ACCESS_KEY &&
      dataObj?.AWS_BUCKET_REGION === AWS_BUCKET_REGION &&
      dataObj?.AWS_IMAGE_BUCKET_NAME === AWS_IMAGE_BUCKET_NAME &&
      dataObj?.AWS_SECRET_KEY === AWS_SECRET_KEY &&
      dataObj?.AWS_USERNAME === AWS_USERNAME &&
      dataObj?.AWS_VIDEO_BUCKET_LINK === AWS_VIDEO_BUCKET_LINK &&
      dataObj?.AWS_ENDPOINT === AWS_ENDPOINT
    )
      return toast.info("No changes made to the s3 settings");

    const params = {
      AWS_ACCESS_KEY,
      AWS_BUCKET_REGION,
      AWS_IMAGE_BUCKET_NAME,
      AWS_SECRET_KEY,
      AWS_USERNAME,
      AWS_VIDEO_BUCKET_LINK,
      configId: data?._id,
      keyType: data?.keyType,
      AWS_ENDPOINT,
    };

    // validate
    for (let key in params)
      if (params[key] === "") return toast.info("Please fill all fields");

    onClick(params);
  };

  return (
    <div className="mt-5">
      <h1>S3 Bucket Settings</h1>
      <Row>
        <Col md={6} className="mt-4">
          <Input
            label={"Aws Access Key"}
            value={AWS_ACCESS_KEY}
            setter={setAWS_ACCESS_KEY}
          />
        </Col>
        <Col md={6} className="mt-4">
          <Input
            label={"Aws Bucket Region"}
            value={AWS_BUCKET_REGION}
            setter={setAWS_BUCKET_REGION}
          />
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mt-4">
          <Input
            label={"Aws Image Bucket Name"}
            value={AWS_IMAGE_BUCKET_NAME}
            setter={setAWS_IMAGE_BUCKET_NAME}
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
      <Row>
        <Col md={6} className="mt-4">
          <Input
            label={"Aws Username"}
            value={AWS_USERNAME}
            setter={setAWS_USERNAME}
          />
        </Col>
        <Col md={6} className="mt-4">
          <Input
            label={"Aws Video Bucket Link"}
            value={AWS_VIDEO_BUCKET_LINK}
            setter={setAWS_VIDEO_BUCKET_LINK}
          />
        </Col>
        <Col md={6} className="mt-4">
          <Input
            label={"Aws Endpoint"}
            value={AWS_ENDPOINT}
            setter={setAWS_ENDPOINT}
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

export default StorageSettings;
