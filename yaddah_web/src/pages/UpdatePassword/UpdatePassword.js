import React, { useState } from "react";
import classes from "./UpdatePassword.module.css";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { Row, Col } from "react-bootstrap";
import SidebarSkeleton from "../../components/SidebarSkeleton";
import { Patch } from "../../Axios/AxiosFunctions";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { isMobileViewHook } from "../../CustomHooks/isMobileViewHook";
import { apiHeader, BaseURL } from "../../config/apiUrl";
import { saveLoginUserData } from "../../redux/auth/authSlice";

function UpdatePassword() {
  const { accessToken } = useSelector((state) => state?.authReducer);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    isMobileViewHook(setIsMobile);
  }, []);

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // update password
  const handleSubmit = async () => {
    let params = {
      passwordCurrent: currentPassword,
      password: password,
      passwordConfirm: newPassword,
    };
    for (const key in params) {
      if (params[key] == "" || params[key] == null) {
        toast.error("Please Fill all the fields");
        return;
      }
    }

    if (
      currentPassword?.length < 8 ||
      password?.length < 8 ||
      newPassword?.length < 8
    ) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (currentPassword === password) {
      toast.error("Current Password and New Password can not be same");
      return;
    }

    if (password !== newPassword) {
      toast.error("Password and Confirm Password does not match");
      return;
    }

    setLoading(true);
    const response = await Patch(
      BaseURL("users/updateMyPassword"),
      params,
      apiHeader(accessToken)
    );
    setLoading(false);
    if (response !== undefined) {
      dispatch(saveLoginUserData(response?.data));
      setCurrentPassword("");
      setPassword("");
      setNewPassword("");
      toast.success("Password Updated Successfully");
    }
  };

  return (
    <SidebarSkeleton>
      <div className={classes.profileSetting__wrapper}>
        <h1>Update Password</h1>
        <div className={classes.boxShadow__wrapper}>
          <Row>
            <Col lg={6} md={12} sm={12}>
              <div>
                <Row className="mb-3">
                  <Col
                    lg={6}
                    md={12}
                    sm={12}
                    className={classes.input__wrapper}
                  >
                    <Input
                      label="Current Password"
                      state={currentPassword}
                      setter={setCurrentPassword}
                      form
                      type="password"
                    />
                  </Col>
                  <Col
                    lg={6}
                    md={12}
                    sm={12}
                    className={classes.input__wrapper}
                  >
                    <Input
                      label="New Password"
                      state={newPassword}
                      setter={setNewPassword}
                      form
                      type="password"
                    />
                  </Col>
                  <Col md={12} sm={12} className={classes.input__wrapper}>
                    <Input
                      label="Confirm Password"
                      state={password}
                      setter={setPassword}
                      form
                      type="password"
                    />
                  </Col>

                  {!isMobile && (
                    <Col md={12} sm={12} className={classes.input__wrapper}>
                      <Button
                        onClick={handleSubmit}
                        className={classes.saveBtn}
                        disabled={isLoading}
                        label={isLoading ? "Updating..." : "Update"}
                      />
                    </Col>
                  )}
                </Row>
              </div>
            </Col>
          </Row>
          {isMobile && (
            <Button
              onClick={handleSubmit}
              className={classes.saveBtn}
              disabled={isLoading}
              label={isLoading ? "Updating..." : "Update"}
            />
          )}
        </div>
      </div>
    </SidebarSkeleton>
  );
}

export default UpdatePassword;
