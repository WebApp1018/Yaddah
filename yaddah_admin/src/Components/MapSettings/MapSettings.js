import React from "react";

import classes from "./MapSettings.module.css";
import { Col, Row } from "react-bootstrap";
import { Button } from "../Button/Button";
import { useState } from "react";
import { Input } from "../Input/Input";
import { toast } from "react-toastify";

const MapSettings = ({ data, onClick, isLoading }) => {
  const dataObj = data?.map;
  const [MAP_KEY, setMAP_KEY] = useState(dataObj?.MAP_KEY);

  // handleSubmit
  const handleSubmit = () => {
    if (dataObj?.MAP_KEY === MAP_KEY)
      return toast.info("No changes made to the map settings");
      
    const params = {
      MAP_KEY,
      configId: data?._id,
      keyType: data?.keyType,
    };

    // validate
    if (!MAP_KEY) return toast.info("Please fill all fields");

    onClick(params);
  };

  return (
    <div className="mt-5">
      <h1>Map</h1>
      <Row>
        <Col md={12} className="mt-4">
          <Input
            label={"Google Map Api Key"}
            value={MAP_KEY}
            setter={setMAP_KEY}
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

export default MapSettings;
