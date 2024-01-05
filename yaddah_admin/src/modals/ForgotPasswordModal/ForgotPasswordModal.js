import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Post } from "../../Axios/AxiosFunctions";
import { Button } from "../../Components/Button/Button";
import { Input } from "../../Components/Input/Input";
import { apiHeader, BaseURL } from "../../config/apiUrl";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./ForgotPasswordModal.module.css";
import validator from "validator";

function ForgotPasswordModal({ show, setShow }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState("");

  async function loginUser() {
    const url = BaseURL("users/forgotPassword");
    let params = {
      email,
    };
    if (!validator.isEmail(email)) {
      return toast.error("Your email is not valid");
    }

    setIsLoading(true);
    const response = await Post(url, params, apiHeader());
    setIsLoading(false);

    if (response) {
      toast.success("Password reset link has been sent to your email");
      setShow(false);
    }
  }

  return (
    <ModalSkeleton
      setShow={setShow}
      show={show}
      width={"550px"}
      header={"Forgot Password"}
      borderRadius={"20px"}
      showCloseIcon
    >
      <Row className={classes.row}>
        <Col md={12}>
          <p className={classes.dontHaveAnAccount}>
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </Col>
        <Col md={12}>
          <Input
            setter={setEmail}
            value={email}
            placeholder={"Enter email here"}
            label={"Email"}
            type='email'
          />
        </Col>

        <Col md={12} className={classes.jCenter}>
          <Button
            variant=""
            className={classes.loginBtn}
            onClick={loginUser}
            disabled={isLoading}
          >
            {isLoading ? "Please Wait..." : "Send"}
          </Button>
        </Col>
      </Row>
    </ModalSkeleton>
  );
}

export default ForgotPasswordModal;
