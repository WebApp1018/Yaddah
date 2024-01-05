import React, { useEffect, useState } from "react";

import classes from "./Forms.module.css";
import { Col, Row } from "react-bootstrap";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { toast } from "react-toastify";

const PostmarkForm = ({ data, onClick, isLoading }) => {
  const dataObj = data?.postmark;
  const [EMAIL_FROM, setEMAIL_FROM] = useState(dataObj?.EMAIL_FROM);
  const [POSTMARK_KEY, setPOSTMARK_KEY] = useState(dataObj?.POSTMARK_KEY);

  // handleSubmit
  const handleSubmit = (isCheckingRequired = true) => {
    // check if no changes are made
    if (
      dataObj?.EMAIL_FROM === EMAIL_FROM &&
      dataObj?.POSTMARK_KEY === POSTMARK_KEY &&
      isCheckingRequired
    )
      return toast.info("No changes made to the postmark settings");

    const params = {
      EMAIL_FROM,
      POSTMARK_KEY,
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
            label={"Postmark Key"}
            value={POSTMARK_KEY}
            setter={setPOSTMARK_KEY}
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

export default PostmarkForm;
