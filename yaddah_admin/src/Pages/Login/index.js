import React, { useState } from "react";
import styles from "./Login.module.css";
import { logo } from "../../constant/imagePath";
import { useNavigate } from "react-router-dom";
import { apiHeader, BaseURL } from "../../config/apiUrl";
import { Post } from "../../Axios/AxiosFunctions";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { saveLoginUserData } from "../../store/auth/authSlice";
import validator from "validator";
import ForgotPasswordModal from "../../modals/ForgotPasswordModal/ForgotPasswordModal";
import { Input } from "../../Components/Input/Input";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  async function onLogin() {
    const url = BaseURL("users/admin-login");
    const body = {
      email,
      password,
    };
    for (let key in body) {
      if (body[key] == "" || body[key] == null) {
        return toast.error(`Please fill the ${key} field`);
      }
    }
    if (!validator.isEmail(email)) {
      return toast.error(`Please provide the valid email address`);
    }
    if (body["password"]?.length < 8) {
      return toast.error(`Password must be atleast 8 character or more`);
    }
    setIsLoading(true);
    const response = await Post(url, body, apiHeader());
    if (response) {
      if (response?.data?.data.user?.isBlockedByAdmin) {
        return toast.error(
          `Your account is blocked by admin. Please contact to support for more information.`
        );
      }
      dispatch(saveLoginUserData(response?.data));
      toast.success("Logged In Successfully");
      navigate("/");
    }
    setIsLoading(false);
  }

  return (
    <div className={styles.login__wrapper}>
      <div className={styles.login__box}>
        <img src={logo} alt="" />
        <form className={styles.form}>
          <label htmlFor="email" hidden>
            Email
          </label>
          <Input
            type="text"
            value={email}
            setter={setEmail}
            placeholder="Email"
          />
          <label htmlFor="password" hidden>
            Password
          </label>
          <Input
            value={password}
            setter={setPassword}
            type="password"
           
            placeholder="Password"
          />
          <button onClick={onLogin} disabled={isLoading}>
            {isLoading ? "Logging..." : "Login"}
          </button>
        </form>

        <span
          className={` ${styles.forgot} text-center`}
          href="#"
          onClick={() => setShowForgotPasswordModal(true)}
        >
          Forgot Password?
        </span>
      </div>
      {showForgotPasswordModal && (
        <ForgotPasswordModal
          show={showForgotPasswordModal}
          setShow={setShowForgotPasswordModal}
        />
      )}
    </div>
  );
};

export default Login;
