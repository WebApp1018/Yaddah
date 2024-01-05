import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Post } from "../../Axios/AxiosFunctions";
import { Button } from "../../components/Button/Button";
import { Checkbox } from "../../components/Checkbox/Checkbox";
import CustomPhoneInput from "../../components/CustomPhoneInput";
import DropDown from "../../components/DropDown";
import FileUpload from "../../components/FileUpload";
import { Input } from "../../components/Input/Input";
import Maps from "../../components/MapAndPlaces";
import PaypalSubscriptionButton from "../../components/PaypalButton/PaypalSubscriptionButton";
import SquareUploadImageBox from "../../components/SquareUploadImageBox";
import UploadImageBox from "../../components/UploadImageBox";
import {
  apiHeader,
  BaseURL,
  CreateFormData,
  formRegEx,
  formRegExReplacer,
} from "../../config/apiUrl";
import styles from "./CustomerSignup.module.css";
import LottieLoader from "../../components/LottieLoader/LottieLoader";
import { saveLoginUserData } from "../../redux/auth/authSlice";
import validator from "validator";

const CustomerSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const signUpUsertype = useLocation()?.state?.type;
  const packageData = useLocation()?.state?.package;

  console.log("signUpUsertype ", signUpUsertype, packageData);

  const { allCategories } = useSelector((state) => state?.commonReducer);
  const [photo, setPhoto] = useState(signUpUsertype ? null : "");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [userName, setUserName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [verifyEmail, setVerifyEamil] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [mobile, setMobile] = useState("+966");
  const [acceptTerms, setAcceptTerms] = useState("");
  const [googleMapAddress, setGoogleMapAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: 0,
    lng: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sp States
  const [organization, setOrganization] = useState("");
  const [fax, setFax] = useState("");
  const [comment, setComment] = useState("");
  const [serviceCategory, setServiceCategory] = useState([]);
  const [commercialLicense, setCommercialLicense] = useState(null);
  const [paypalMerchantId, setPaypalMerchantId] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [isfomrValidated, setIsfomrValidated] = useState(false);
  // handleValidate
  const handleValidate = () => {
    const body = {
      fullName,
      userName,
      role: "customer",
      email,
      verifyEmail,
      country,
      regionState: state,
      city,
      address,
      zipCode,
      phoneNo: mobile,

      password,
      passwordConfirm: verifyPassword,
      acceptTerms: acceptTerms?.length > 0,

      fcmToken: "123",

      photo, //* photo  + logo

      // Sp
      ...(signUpUsertype == "sp" &&
        packageData && {
          // paypalEmail: email,
          paypalMerchantId: paypalMerchantId,
          comment,
          organization,
          fax,
          serviceCategory: serviceCategory?.map((item) => item?._id),
          commercialLicense,
          role: "service-provider",
          paypalEmail,
          // paypalMerchantId,
        }),
    };

    for (let key in body) {
      if (body[key] == "" || body[key] == null) {
        toast.error(
          `Please fill the ${key
            .replace(formRegEx, formRegExReplacer)
            .toLowerCase()} field!`
        );
        return [null, false];
      }
    }

    body.lat = coordinates?.lat;
    body.lng = coordinates?.lng;

    if (email !== verifyEmail) {
      toast.error("Emails doesn't match");
      return [null, false];
    }

    if (!validator.isEmail(email)) {
      return toast.error("Your email is not valid");
    }
    if (!validator.isEmail(verifyEmail)) {
      return toast.error("Your verifications email is not valid");
    }
    if (password?.length < 8 || verifyPassword?.length < 8) {
      toast.error("Password must be 8 characters or greater");
      return [null, false];
    }
    if (password !== verifyPassword) {
      toast.error("Passwords doesn't match");
      return [null, false];
    }
    if (!validator.isMobilePhone(`+${mobile}`)) {
      toast.error("Your mobile number is not valid");
      return [null, false];
    }
    if (!body.lat || !body.lng) {
      toast.error("Please enter your location.");
      return [null, false];
    }

    return [body, true];
  };

  // signup
  async function signup(subscriptionId, planId) {
    const [body, isValid] = handleValidate();

    if (!isValid) return;

    // paypal ids
    if (
      signUpUsertype == "sp" &&
      packageData?.planType?.toLowerCase() !== "free"
    ) {
      body.subscriptionId = subscriptionId;
      body.planId = planId;
      body.packageId = packageData?._id;
    }
    const url = BaseURL("users/signup");

    setIsLoading(true);
    const params = await CreateFormData(body);
    const response = await Post(url, params, apiHeader());
    setIsLoading(false);
    if (response !== undefined) {
      dispatch(saveLoginUserData(response?.data));

      if (signUpUsertype == "sp") {
        navigate("/dashboard");
        toast.success(
          "Our team will review your account and get back to you soon"
        );
      } else {
        toast.success(
          "Our team will review your account and get back to you soon"
        );
        navigate("/on-hold-customer");
      }
    }
  }

  return (
    <section className={styles.section}>
      <Container>
        <Row className={styles.rowGap}>
          <Col md={12}>
            <h1>Sign Up</h1>
          </Col>
          {!signUpUsertype && (
            <Col md={12} className={styles.aCenter}>
              <UploadImageBox state={photo} setter={setPhoto} />
            </Col>
          )}
          <Col md={6}>
            <Input
              setter={setFullName}
              state={fullName}
              placeholder={"Enter full name here"}
              label={"Full Name"}
              form
            />
          </Col>

          <Col md={6}>
            <Input
              setter={setUserName}
              state={userName}
              placeholder={"Enter Username here"}
              label={"Username"}
              form
            />
          </Col>
          <Col md={6}>
            <Maps
              setAddress={setGoogleMapAddress}
              address={googleMapAddress}
              placeholder={"Enter google map address here"}
              label={"Google Map Address"}
              type={"places"}
              setCoordinates={setCoordinates}
              setPlaceDetail={(e) => {
                setCity(e?.city);
                setZipCode(e?.zipcode);
                setCountry(e?.country);
                setState(e?.state);
              }}
            />
          </Col>
          <Col md={6}>
            <Input
              setter={setAddress}
              state={address}
              placeholder={"Enter Address here"}
              label={"Address"}
              form
            />
          </Col>
          <Col md={6}>
            <Input
              setter={setCountry}
              state={country}
              placeholder={"Enter Country here"}
              label={"Country"}
              form
            />
          </Col>
          <Col md={6}>
            <Input
              setter={setCity}
              state={city}
              placeholder={"Enter City here"}
              label={"City"}
              form
            />
          </Col>
          <Col md={6}>
            <Input
              setter={setState}
              state={state}
              placeholder={"Enter State here"}
              label={"State"}
              form
            />
          </Col>
          <Col md={6}>
            <Input
              setter={setZipCode}
              state={zipCode}
              placeholder={"Enter Zip Code Here"}
              label={"Zip(Post) Code"}
              form
              type="tel"
            />
          </Col>
          <Col md={6}>
            <Input
              setter={setEmail}
              state={email}
              placeholder={"Enter Email Here"}
              label={"Email"}
              form
              type="email"
            />
          </Col>
          <Col md={6}>
            <Input
              setter={setVerifyEamil}
              state={verifyEmail}
              placeholder={"Enter Verify Email Here"}
              label={"Verify Email"}
              form
              type="email"
            />
          </Col>

          <Col md={6}>
            <Input
              setter={setPassword}
              state={password}
              type={"password"}
              placeholder={"Enter Password Here"}
              label={"Password"}
              form
            />
          </Col>
          <Col md={6}>
            <Input
              setter={setVerifyPassword}
              state={verifyPassword}
              type={"password"}
              label={"Verify Password"}
              placeholder={"Enter Verify Password Here"}
              form
            />
          </Col>
          <Col md={6}>
            <CustomPhoneInput
              setter={setMobile}
              value={mobile}
              label={signUpUsertype ? "Phone Number" : "Mobile"}
              placeholder={`Enter ${
                signUpUsertype ? "Phone Number" : "Mobile"
              } here`}
              form
            />
            {/* <Input
              setter={setMobile}
              state={mobile}
              label={"Mobile"}
              placeholder={"Enter mobile here"}
              form
            /> */}
          </Col>
          {signUpUsertype && (
            <>
              <Col md={6}>
                <Input
                  setter={setOrganization}
                  state={organization}
                  label={"Organization"}
                  placeholder={"Enter Organization Here"}
                  form
                />
              </Col>
              <Col md={6}>
                <Input
                  setter={setFax}
                  state={fax}
                  label={"Fax"}
                  placeholder={"Enter Fax Here"}
                  form
                  type="tel"
                />
              </Col>
              <Col md={6}>
                <Input
                  setter={setComment}
                  state={comment}
                  label={"Comment"}
                  placeholder={"Enter Comment Here"}
                  form
                />
              </Col>
              <Col md={6}>
                <Input
                  setter={setPaypalEmail}
                  state={paypalEmail}
                  label={"Paypal Email"}
                  placeholder={"Enter Paypal Email Here"}
                  form
                />
              </Col>
              <Col md={6}>
                <Input
                  setter={setPaypalMerchantId}
                  state={paypalMerchantId}
                  label={"Paypal Merchant Id"}
                  placeholder={"Enter Paypal Merchant Id Here"}
                  form
                />
              </Col>
              <Col md={6}>
                <DropDown
                  setter={setServiceCategory}
                  state={serviceCategory}
                  label={"Service Category"}
                  placeholder={"Select Service Category"}
                  options={allCategories}
                  optionLabel={"name"}
                  optionValue={"_id"}
                  labelClassName={styles.label}
                  form
                  isMulti
                />
              </Col>
              <Col md={12}>
                <SquareUploadImageBox
                  state={photo}
                  setter={setPhoto}
                  label={"Official Logo"}
                  labelClassName={styles.label}
                  imageContain={true}
                />
              </Col>
              <Col md={12}>
                <FileUpload
                  label={"Commercial License"}
                  subLabel={"(PDF file Only)"}
                  value={commercialLicense}
                  setter={(e) => {
                    if (!["pdf"].includes(e?.name?.split(".")[1])) {
                      return toast.error("Only PDF File Is Allowed");
                    }
                    setCommercialLicense(e);
                  }}
                  btnLabel={commercialLicense ? "Update" : "Browse"}
                  labelClassName={styles.label}
                />
              </Col>
            </>
          )}
          <Col md={12}>
            <Checkbox
              setValue={setAcceptTerms}
              value={acceptTerms}
              label={"I Accept The Terms & Conditions"}
            />
          </Col>

          <Col md={12}>
            {!signUpUsertype ? (
              <Button
                label={isLoading ? "Submitting..." : "Sign Up"}
                onClick={signup}
                disabled={isLoading}
                customStyle={{ minWidth: "150px" }}
              />
            ) : (
              // validate and show paypalButton
              <>
                {!isfomrValidated ? (
                  <Button
                    disabled={isLoading}
                    label={
                      packageData?.planType?.toLowerCase() === "free"
                        ? "Signup"
                        : "Proceed to Payment"
                    }
                    onClick={() => {
                      const [, isValid] = handleValidate();
                      if (!isValid) return;

                      // if free plan then signup
                      if (packageData?.planType?.toLowerCase() === "free") {
                        signup();
                        return;
                      }
                      if (isValid) setIsfomrValidated(true);
                    }}
                    customStyle={{ minWidth: "150px" }}
                  />
                ) : (
                  <div className={styles.paypalButton}>
                    <PaypalSubscriptionButton
                      price={packageData?.price}
                      planId={packageData?.planData?.id}
                      onSubmit={signup}
                      isfomrValidated={isfomrValidated}
                      handleValidate={handleValidate}
                    />
                  </div>
                )}
              </>
            )}
          </Col>
          <Col md={12}>
            <div className={styles.alreadyHaveAnAccount}>
              <p>Already have an account?</p>
              <Link to={"/login"}>Login</Link>
            </div>
          </Col>
        </Row>
      </Container>

      {isLoading && <LottieLoader className={styles?.bodyLoader} />}
    </section>
  );
};

export default CustomerSignup;
