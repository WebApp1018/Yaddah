import React, { useState } from "react";
import classes from "./Setting.module.css";
import { Input } from "../../components/Input/Input";
import { TextArea } from "../../components/TextArea";
import { Button } from "../../components/Button/Button";
import { Row, Col } from "react-bootstrap";
import SidebarSkeleton from "../../components/SidebarSkeleton";
import UploadImageBox from "../../components/UploadImageBox";
import { Patch } from "../../Axios/AxiosFunctions";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { isMobileViewHook } from "../../CustomHooks/isMobileViewHook";
import {
  apiHeader,
  BaseURL,
  CreateFormData,
  imageUrl,
} from "../../config/apiUrl";
import { updateUser } from "../../redux/auth/authSlice";
import validator from "validator";
import CustomPhoneInput from "../../components/CustomPhoneInput";
import { EmptyProfile } from "../../constant/imagePath";

function ProfileSetting() {
  const { user, accessToken } = useSelector((state) => state?.authReducer);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    isMobileViewHook(setIsMobile);
  }, []);

  const [emailAndPhone, setEmailAndPhone] = useState({
    email: user ? user?.email : "",
    phoneNo: user ? user?.phoneNo : "",
  });
  const [userName, setUserName] = useState(user ? user?.userName : "");
  const [fullName, setFullName] = useState(user ? user?.fullName : "");
  const [userImage, setuserImage] = useState(user ? user?.photo : null);

  const [userDescription, setuserDescription] = useState(
    user ? user?.description : ""
  );
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const updateMyInfo = async () => {
    let params = {
      fullName: fullName,
      photo: userImage,
      description: userDescription,
      email: emailAndPhone?.email,
      phoneNo: emailAndPhone?.phoneNo?.includes("+")
        ? emailAndPhone?.phoneNo
        : `+${emailAndPhone?.phoneNo}`,
    };
    for (const key in params) {
      if (params[key] == "" || params[key] == null) {
        toast.error("Please fill all the fields");
        return;
      }
    }
    if (!validator.isEmail(params?.email)) {
      return toast.error("Please provide a valid email");
    }
    if (!validator.isMobilePhone(params?.phoneNo)) {
      return toast.error("Please provide a valid phone no");
    }
    const userFormData = await CreateFormData(params);
    setLoading(true);
    const response = await Patch(
      BaseURL("users/updateMe"),
      userFormData,
      apiHeader(accessToken, true)
    );
    if (response !== undefined) {
      dispatch(updateUser(response?.data?.data?.user));
      setuserImage(response?.data?.data?.user?.photo);
      toast.success("Profile updated successfully");
    }
    setLoading(false);
  };
  return (
    <SidebarSkeleton>
      <div className={classes.profileSetting__wrapper}>
        <h1>Settings</h1>
        <div className={classes.boxShadow__wrapper}>
          <Row>
            <Col lg={6} md={12} sm={12}>
              <h3>User Information</h3>
              <div>
                <Row className="mb-3">
                  <Col
                    lg={6}
                    md={12}
                    sm={12}
                    className={classes.input__wrapper}
                  >
                    <Input
                      label="User Name"
                      state={userName}
                      setter={setUserName}
                      form
                      disabled={true}
                    />
                  </Col>
                  <Col
                    lg={6}
                    md={12}
                    sm={12}
                    className={classes.input__wrapper}
                  >
                    <Input
                      label="Full Name"
                      state={fullName}
                      setter={setFullName}
                      form
                    />
                  </Col>
                  <Col md={12} sm={12} className={classes.input__wrapper}>
                    <Input
                      label="Email"
                      disabled={true}
                      state={emailAndPhone?.email}
                      setter={(e) =>
                        setEmailAndPhone((prev) => ({ ...prev, email: e }))
                      }
                      form
                    />
                  </Col>
                  <Col md={12} sm={12} className={classes.input__wrapper}>
                    <CustomPhoneInput
                      label="Phone No"
                      disabled={true}
                      value={emailAndPhone?.phoneNo}
                      setter={(e) =>
                        setEmailAndPhone((prev) => ({ ...prev, phoneNo: e }))
                      }
                    />
                  </Col>
                  {!isMobile && (
                    <Col md={12} sm={12} className={classes.input__wrapper}>
                      <Button
                        onClick={updateMyInfo}
                        className={classes.saveBtn}
                        disabled={isLoading}
                        label={isLoading ? "Updating..." : "Save"}
                      />
                    </Col>
                  )}
                </Row>
              </div>
            </Col>
            <Col lg={6} md={12} sm={12}>
              <h3>Profile Photo</h3>
              <div className={classes.input__wrapper}>
                <UploadImageBox
                  setter={setuserImage}
                  state={
                    typeof userImage == "object"
                      ? userImage
                      : imageUrl(userImage)
                  }
                  placeholderText="Upload your Profile Picture"
                  imgClass={classes.profilePic}
                  errorImage={EmptyProfile}
                />
              </div>
              <h3>Description</h3>
              <div className={classes.input__wrapper}>
                <TextArea
                  customStyle={{
                    borderRadius: "10px",
                    background: "#fff",
                    width: "100%",
                    border: "1px solid #707070",
                  }}
                  inputStyle={{
                    fontFamily: "var(--ff-rubik)",
                  }}
                  setter={setuserDescription}
                  value={userDescription}
                />
              </div>
            </Col>
          </Row>
          {isMobile && (
            <Button
              onClick={updateMyInfo}
              className={classes.saveBtn}
              disabled={isLoading}
              label={isLoading ? "Updating..." : "Save"}
            />
          )}
        </div>
      </div>
    </SidebarSkeleton>
  );
}

export default ProfileSetting;
