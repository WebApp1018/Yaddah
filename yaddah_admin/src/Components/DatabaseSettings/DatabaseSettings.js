import React, { useState } from "react";

import classes from "./DatabaseSettings.module.css";
import { Col, Row } from "react-bootstrap";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { toast } from "react-toastify";
import { TextArea } from "../TextArea";

const DatabaseSettings = ({ data, isLoading, onClick }) => {
  const dataObj = data?.database;
  const [TARGET_DB_URL, setTARGET_DB_URL] = useState(dataObj?.TARGET_DB_URL);
  const [TARGET_DB_NAME, setTARGET_DB_NAME] = useState(dataObj?.TARGET_DB_NAME);

  // handleSubmit
  const handleSubmit = () => {
    if (dataObj?.TARGET_DB_URL === TARGET_DB_URL)
      return toast.info("No changes made to the database settings");

    const params = {
      TARGET_DB_URL,
      TARGET_DB_NAME,
      SOURCE_DB_URL: dataObj?.TARGET_DB_URL,
      configId: data?._id,
      keyType: data?.keyType,
    };

    // validate
    if (TARGET_DB_URL === "") return toast.info("Please fill all fields");

    onClick(params);
  };

  return (
    <div className={classes?.dbSettings}>
      <h1 className="mt-5 mb-3">Database</h1>

      <h3>MongoDB Developer Center</h3>
      <h3>
        <a href="https://www.mongodb.com/developer/" target="_blank">
          https://www.mongodb.com/developer/
        </a>
      </h3>
      {/* Input */}
      <Row className="mt-4">
        <Col md={12}>
          <Input
            label="Target DataBase Name"
            value={TARGET_DB_NAME}
            setter={setTARGET_DB_NAME}
            placeholder="Target DataBase Name"
          />
        </Col>

        <Col md={12} className="mt-4">
          <TextArea
            label="Target DataBase URL"
            value={TARGET_DB_URL}
            setter={setTARGET_DB_URL}
            placeholder="Target DataBase URL"
            rows={2}
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

export default DatabaseSettings;
