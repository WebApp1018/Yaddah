import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Get } from "../../Axios/AxiosFunctions";

import { Button } from "../../components/Button/Button";
import { stop_sign } from "../../constant/imagePath";
import FormCard from "../../components/FormCard/FormCard";
import { apiUrl, BaseURL } from "../../config/apiUrl";
import { signOutRequest, updateUser } from "../../redux/auth/authSlice";

import classes from "./OnHold.module.css";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { useState } from "react";

const OnHold = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useRef(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    accessToken: token,
    user,
    fcmToken,
  } = useSelector((state) => state?.authReducer);

  // get me
  const getMe = async () => {
    const url = BaseURL("users/me");
    setIsRefreshing(true);
    Get(url, token, false, true)
      .then((response) => {
        const apiUser = response?.data?.data?.user;
        dispatch(updateUser(apiUser));
        if (apiUser?.status === "pending") {
          return;
        }
        if (apiUser?.status === "accepted") {
          toast.success("Your account has been approved by admin. Thank you.");
          navigate("/dashboard", {
            replace: true,
          });
        } else {
          toast.info(
            "Your account is rejected by admin. Please contact support. Thank you."
          );
          handleLogout();
        }
      })
      .catch((err) => {
        if (err?.message == "logout") {
          dispatch(signOutRequest());
          navigate("/");
        }
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    getMe();
  }, []);

  // handleLogout
  const handleLogout = async () => {
    socket.current = io(apiUrl);
    socket.current.emit("logout", user?._id, fcmToken);
    dispatch(signOutRequest());
    navigate("/");
  };

  return (
    <FormCard className={classes?.main}>
      <div className={classes?.mainInner}>
        <img src={stop_sign} className={classes?.holdImg} />
        <div className={classes?.mainHeading}>
          <h4>Account is on Hold</h4>
        </div>
        <div className={classes?.mainDescription}>
          <p>
            Our team will go through your profile and approve within 48 hours.
            Thanks for your corporation.
          </p>
        </div>
        <div className={classes?.btnContainer}>
          <Button
            label={"Logout"}
            onClick={handleLogout}
            disabled={isRefreshing}
          />
          <Button
            label={isRefreshing ? "Please Wait..." : "Refresh"}
            onClick={getMe}
            disabled={isRefreshing}
          />
        </div>
      </div>
    </FormCard>
  );
};

export default OnHold;
