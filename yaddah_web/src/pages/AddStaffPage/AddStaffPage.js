import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Get, Patch, Post } from "../../Axios/AxiosFunctions";
import { Button } from "../../components/Button/Button";
import CustomPhoneInput from "../../components/CustomPhoneInput";
import { Input } from "../../components/Input/Input";
import { Loader } from "../../components/Loader";
import { ProfileWithEditButton } from "../../components/ProfileWithEditButton";
import SidebarSkeleton from "../../components/SidebarSkeleton";
import { TextArea } from "../../components/TextArea";
import Toggler from "../../components/Toggler";
import {
  apiHeader,
  BaseURL,
  capitalizeFirstLetter,
  CreateFormData,
  falsyArray,
  formRegEx,
  formRegExReplacer,
  validateEmail,
} from "../../config/apiUrl";
import validator from "validator";
import { createTimeChunk, CreateWeekSchedular } from "../../Helper/scheduler";

import classes from "./AddStaffPage.module.css";
import StaffScheduleCalendar from "../../components/StaffScheduleCalendar";
import MultiDatePicker from "../../components/MultiDatePicker";
import { setAllStaffs } from "../../redux/common/commonSlice";
import moment from "moment";

const AddStaffPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = useParams()?.id;
  const token = useSelector((state) => state.authReducer.accessToken);
  const { allStaffs } = useSelector((state) => state.commonReducer);
  const [img, setImg] = useState("");
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [staffDescription, setStaffDescription] = useState("");
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disabledDates, setDisabledDates] = useState([]);

  // Scheduler States
  const [timeArray, setTimeArray] = useState([]);
  const [dateArray, setDateArray] = useState([]);

  const [statusLoading, setStatusLoading] = useState(false);

  function setStaffToReducer(d, type = "add") {
    const newData = [...allStaffs];
    if (type == "add") {
      newData.push(d);
    } else if (type == "edit") {
      if (newData?.findIndex((item) => item?._id == d?._id) == -1) {
        newData.push(d);
      } else {
        newData.splice(
          newData?.findIndex((item) => item?._id == d?._id),
          1,
          d
        );
      }
    } else {
      newData.splice(
        newData?.findIndex((item) => item?._id == d?._id),
        1
      );
    }
    dispatch(setAllStaffs(newData));
  }

  // Activate Deactivate Staff
  async function activateDeactivate(e) {
    setStatusLoading(true);
    const url = BaseURL(`staff/activate-deactivate/${id}`);
    const response = await Patch(url, { status: e }, apiHeader(token));
    if (response != undefined) {
      setIsToggled(response?.data?.data?.isActive);
      toast.success(`Staff ${e ? "activated" : "deactivated"} successfully`);
      setStatusLoading(false);
    }
  }

  // getSingleStaff
  async function getSingleStaff() {
    const url = BaseURL(`staff/view-detail/${id}`);
    setIsLoading(true);
    const response = await Get(url, token);
    if (response) {
      const staffData = response?.data?.data;
      setStaffName(staffData?.staffName);
      setStaffEmail(staffData?.email);
      setStaffPhone(staffData?.phoneNo);
      setStaffDescription(staffData?.description);
      setImg(staffData?.image);
      setIsToggled(staffData?.isActive);
      setDateArray(staffData?.schedule);
      setDisabledDates(staffData?.disabledDates);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      getSingleStaff();
    }
  }, []);

  // addOrEditStaffHandler
  const addOrEditStaffHandler = async () => {
    const url = BaseURL(id ? `staff/${id}` : `staff/create`);

    let params = {
      staffName: staffName,
      email: staffEmail,
      phoneNo: staffPhone?.includes("+") ? staffPhone : `+${staffPhone}`,
      description: staffDescription,
      image: img,
      schedule: JSON.stringify(dateArray),
      disabledDates: disabledDates?.map((item) =>
        moment(new Date(item)).format()
      ),
    };

    // validate
    for (let key in params) {
      if (falsyArray?.includes(params[key]))
        return toast.error(
          `${capitalizeFirstLetter(
            key?.replace(formRegEx, formRegExReplacer)
          )} can not be empty.`
        );
    }

    if (!validateEmail(staffEmail))
      return toast.error(`Please enter a valid email address.`);
    if (!validator.isMobilePhone(params.phoneNo))
      return toast.error(`Please enter a valid phone no`);

    const formData = await CreateFormData(params);
    setIsAddingStaff(true);
    const apiFunc = id ? Patch : Post;
    const response = await apiFunc(url, formData, apiHeader(token, true));
    if (response) {
      if (id) {
        setStaffToReducer(
          response?.data?.data,
          response?.data?.data?.isActive ? "edit" : "delete"
        );
      } else {
        setStaffToReducer(response?.data?.data);
      }
      toast.success(`Staff ${id ? "edited" : "created"} successfully`);
      navigate(-1);
    }
    setIsAddingStaff(false);
  };

  // craete time chunk
  useEffect(() => {
    const createChunksHandler = async () => {
      const timeChunk = await createTimeChunk(30);
      setTimeArray(timeChunk);

      // if we are crearing new staff then create date array
      if (!id) {
        const dateArray = await CreateWeekSchedular(timeChunk);
        setDateArray(dateArray);
      }
    };
    createChunksHandler();
  }, []);

  return (
    <SidebarSkeleton>
      <Container fluid>
        {/* main */}
        <div className={classes?.mainContainer}>
          {isLoading ? (
            <Loader className={classes.loader} />
          ) : (
            <>
              <div className={classes.header}>
                <h2>{id ? "Edit" : "Add"} Staff</h2>
                {id && (
                  <Toggler
                    checked={isToggled}
                    setChecked={() => {
                      activateDeactivate(!isToggled);
                    }}
                    text="Active"
                    disabled={statusLoading}
                  />
                )}
              </div>
              {/* Image component */}
              <div className={classes?.add_imageCom_main}>
                <ProfileWithEditButton
                  updateImage={img}
                  setUpdateImage={setImg}
                />
              </div>

              {/* Row */}
              <Row className={classes.rowGap}>
                <Col md={6} sm={12}>
                  <Input
                    form
                    label="Name"
                    state={staffName}
                    setter={setStaffName}
                    type="text"
                  />
                </Col>
                <Col md={6} sm={12}>
                  <Input
                    form
                    label="Email"
                    state={staffEmail}
                    setter={setStaffEmail}
                    disabled={id && true}
                  />
                </Col>
                <Col md={12} sm={12}>
                  <CustomPhoneInput
                    form
                    label="Phone No"
                    value={staffPhone}
                    setter={setStaffPhone}
                  />
                </Col>
                <Col md={12} sm={12}>
                  <MultiDatePicker
                    form
                    label="Select Disabled Dates"
                    value={disabledDates}
                    setValue={setDisabledDates}
                  />
                </Col>
              </Row>
              {/* Row */}
              <Row className="mt-4">
                <TextArea
                  label={"Description"}
                  form
                  value={staffDescription}
                  setter={setStaffDescription}
                />
              </Row>

              {/* Scheduler */}
              <div className={classes?.sp_div}>
                <h5 className={classes?.heading5} style={{ lineHeight: 1 }}>
                  Schedule
                </h5>
                <StaffScheduleCalendar
                  DateArray={dateArray}
                  timesSlotArray={timeArray}
                  onSchedulerChange={(data) => setDateArray(data)}
                />
              </div>

              <div className={classes?.buttonContainer}>
                <Button
                  label={
                    isAddingStaff
                      ? "Please Wait.."
                      : id
                      ? "Edit Staff"
                      : "Add Staff"
                  }
                  disabled={isAddingStaff}
                  onClick={addOrEditStaffHandler}
                />
                {id && (
                  <Button
                    label={"Cancel"}
                    variant={"secondary"}
                    onClick={() => {
                      window.location.reload();
                    }}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </Container>
    </SidebarSkeleton>
  );
};

export default AddStaffPage;
