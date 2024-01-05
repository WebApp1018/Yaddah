import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Button } from "../../Components/Button/Button";
import { Input } from "../../Components/Input/Input";
import { TextArea } from "../../Components/TextArea";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./rejectServiceProviderModal.module.css";

function RejectServiceProviderModal({ show, setShow, onReject }) {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState("");

  async function onClick() {
    let params = {
      description,
    };
    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error(`Please fill the ${key} field`);
      }
    }
    if (description.length > 500) {
      return toast.error("Reason should not be greater than 500 characters.");
    }
    setIsLoading(true);
    await onReject(description);
    setIsLoading(false);
  }

  return (
    <ModalSkeleton
      setShow={setShow}
      show={show}
      width={"600px"}
      header={"Reject Reason"}
      borderRadius={"20px"}
      showCloseIcon>
      <Row className={classes.row}>
        <Col md={12}>
          <TextArea
            setter={setDescription}
            value={description}
            placeholder={"Enter reason here"}
            label={"Reason"}
            className={classes.textArea}
            form
          />
        </Col>
        <Col md={12} className={classes.jCenter}>
          <Button
            variant="secondary"
            className={classes.btn}
            onClick={onClick}
            disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </Col>
      </Row>
    </ModalSkeleton>
  );
}

export default RejectServiceProviderModal;
