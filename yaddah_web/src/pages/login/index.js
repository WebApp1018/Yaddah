import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { Post } from "../../Axios/AxiosFunctions";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import { apiHeader, BaseURL, validateEmail } from "../../config/apiUrl";
import styles from "./Login.module.css";
import { useDispatch, useSelector } from "react-redux";
import { saveLoginUserData } from "../../redux/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import ForgotPasswordModal from "../../Modals/ForgotPasswordModal/ForgotPasswordModal";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fcmToken } = useSelector((state) => state.authReducer);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  async function onLogin() {
    const url = BaseURL("users/login");
    const body = {
      email,
      password,
    };
    for (let key in body) {
      if (body[key] == "" || body[key] == null) {
        return toast.error("Please fill all the fields");
      }
    }
    if (!validateEmail(email)) {
      return toast.error("Your email is not valid");
    }
    if (body["password"]?.length < 8) {
      return toast.error("Password must be 8 characters or greater");
    }
    body.fcmToken = fcmToken;
    setIsLoading(true);
    const response = await Post(url, body, apiHeader());
    if (response) {
      dispatch(saveLoginUserData(response?.data));
      toast.success("User Logged In successfully");
      navigate("/dashboard");
    }
    setIsLoading(false);
  }
  return (
    <section className={styles.banner__section}>
      <Container className={styles.container} fluid>
        <Row className={styles.row}>
          <Col md={12}>
            <h1>Login</h1>
          </Col>
          <Col md={12} className={styles.aCenter}>
            <Input
              setter={setEmail}
              state={email}
              placeholder={"Enter email here"}
              label={"Email"}
              form
            />
          </Col>
          <Col md={12}>
            <Input
              setter={setPassword}
              state={password}
              type="password"
              placeholder={"Enter password here"}
              label={"Password"}
              form
            />
          </Col>

          <Col md={12}>
            <div className={styles.forgotPassword}>
              <span onClick={() => setShowForgotPasswordModal(true)}>
                Forgot Your Password?
              </span>
            </div>
          </Col>
          <Col md={12} className={styles.btnDiv}>
            <Button
              disabled={isLoading}
              onClick={onLogin}
              label={isLoading ? "Logging..." : "Login"}
              customStyle={{ minWidth: "170px" }}
            />
          </Col>
          <Col md={12}>
            <div className={styles.dontHaveAnAccount}>
              <p>
                Don't have an account? <Link to={"/signup"}>Signup</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {showForgotPasswordModal && (
        <ForgotPasswordModal
          show={showForgotPasswordModal}
          setShow={setShowForgotPasswordModal}
        />
      )}
    </section>
  );
};

export default Login;
