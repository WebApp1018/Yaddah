import React, { useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Patch, Post } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import { Input } from "../../Component/Input/Input";
import { apiHeader, apiUrl, BaseURL, validateEmail } from "../../config/apiUrl";
import ModalSkeleton from "../ModalSkeleton";
import { useSelector, useDispatch } from "react-redux";
import styles from "./UpdatePassword.module.css";
import { signOutRequest } from "../../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const UpdatePasswordModal = ({ show, setShow }) => {
  const inputStyle = {
    borderRadius: "46px",
    boxShadow: "21px 14px 24px #00000012",
  };
  const { accessToken, fcmToken, user } = useSelector(
    (state) => state.authReducer
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const socket = useRef(null);

  const logout = () => {
    socket.current = io(apiUrl);
    socket.current.emit("join", user?._id);
    socket.current.emit("logout", { _id: user?._id, fcmToken });
    dispatch(signOutRequest());
    navigate("/");
  };
  const handleUpdate = async () => {
    const params = {
      passwordCurrent: currentPassword,
      password: newPassword,
      passwordConfirm: confirmPassword,
    };
    // validate
    for (let key in params)
      if (params[key] === "") return toast.error(`Fields can not be empty.`);

    // validate password
    if (newPassword.length < 8)
      return toast.warn("Password must be at least 8 characters long.");
    if (newPassword !== confirmPassword)
      return toast.warn("Password and confirm password do not match.");

    // call api
    const url = BaseURL(`users/updateMyPassword`);
    setIsLoading(true);
    const response = await Patch(url, params, apiHeader(accessToken));
    setIsLoading(false);

    if (response != undefined) {
      toast.success(
        "Your password has been updated successfully! please log in again"
      );
      setShow(false);
      logout();
    }
  };
  return (
    <ModalSkeleton
      setShow={setShow}
      show={show}
      width={"600px"}
      header={"Update Password"}
      borderRadius={"20px"}
      showCloseIcon>
      <Row className={styles.row}>
        <Col md={12}>
          <Input
            setter={setCurrentPassword}
            value={currentPassword}
            placeholder={"Enter Current Password"}
            label={"Current Password"}
            type={"password"}
            customStyle={inputStyle}
          />
        </Col>
        <Col md={12}>
          <Input
            setter={setNewPassword}
            value={newPassword}
            placeholder={"Enter New password"}
            label={"New Password"}
            type={"password"}
            customStyle={inputStyle}
          />
        </Col>
        <Col md={12}>
          <Input
            setter={setConfirmPassword}
            value={confirmPassword}
            placeholder={"Enter Confirm password"}
            label={"Confirm Password"}
            type={"password"}
            customStyle={inputStyle}
          />
        </Col>

        <Col md={12} className={styles.signUpBtnWrap}>
          <Button
            label={isLoading ? "Updating..." : "Update Password"}
            className={styles.UpdateBtn}
            variant={""}
            onClick={handleUpdate}
          />
        </Col>
      </Row>
    </ModalSkeleton>
  );
};

export default UpdatePasswordModal;
