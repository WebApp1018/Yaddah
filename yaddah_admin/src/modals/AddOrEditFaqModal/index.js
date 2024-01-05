import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Post } from "../../Axios/AxiosFunctions";
import { Button } from "../../Components/Button/Button";
import { Input } from "../../Components/Input/Input";
import { TextArea } from "../../Components/TextArea";
import { apiHeader, BaseURL } from "../../config/apiUrl";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./AddOrEditFaqModal.module.css";

function AddOrEditFaqModal({ show, setShow, data, onClick }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState("");

  async function faqHandler() {
    let params = {
      question,
      answer,
    };
    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error(`Please fill the ${key} field`);
      }
    }

    setIsLoading(true);
    await onClick(params);
    setIsLoading(false);
  }
  useEffect(() => {
    if (data) {
      setQuestion(data?.question);
      setAnswer(data?.answer);
    }
  }, [data]);
  return (
    <ModalSkeleton
      setShow={setShow}
      show={show}
      width={"600px"}
      header={"FAQ"}
      borderRadius={"20px"}
      showCloseIcon
    >
      <Row className={classes.row}>
        <Col md={12}>
          <Input
            setter={setQuestion}
            value={question}
            placeholder={"Enter question here"}
            label={"Question"}
            form
          />
        </Col>
        <Col md={12}>
          <TextArea
            setter={setAnswer}
            value={answer}
            placeholder={"Enter answer here"}
            label={"Answer"}
            form
          />
        </Col>
        <Col md={12} className={classes.jCenter}>
          <Button
            variant="secondary"
            className={classes.loginBtn}
            onClick={faqHandler}
            disabled={isLoading}
          >
            {isLoading ? "Wait..." : data ? "Update" : "Add"}
          </Button>
        </Col>
      </Row>
    </ModalSkeleton>
  );
}

export default AddOrEditFaqModal;
