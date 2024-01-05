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
import classes from "./AddReportModal.module.css";
import { DropDown } from "../../Components/DropDown/DropDown";
import moment from "moment";
// const typeFilter = [
//   {
//     label: "Subscription",
//     value: "subscription",
//   },
//   {
//     label: "Booking",
//     value: "booking",
//   },
// ];
function AddReportModal({ show, setShow, data, onClick }) {
  const [fileName, setFileName] = useState("");
  const [reportType, setReportType] = useState("subscription");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState("");

  async function faqHandler() {
    let params = {
      filename: fileName,
      startDate: startDate && moment(startDate).format(),
      endDate: endDate && moment(endDate).format(),
    };
    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error(`Please fill the ${key} field`);
      }
    }

    setIsLoading(true);
    await onClick(params, reportType);
    setIsLoading(false);
  }

  return (
    <ModalSkeleton
      setShow={setShow}
      show={show}
      width={"600px"}
      header={"Report"}
      borderRadius={"20px"}
      showCloseIcon
    >
      <Row className={classes.row}>
        <Col md={12}>
          <Input
            setter={setFileName}
            value={fileName}
            placeholder={"Enter File Name"}
            label={"File Name"}
            form
          />
        </Col>
        {/* <Col md={12}>
          <DropDown
            form
            label={"Report Type"}
            value={reportType}
            setter={setReportType}
            options={typeFilter}
            placeholder="Report Type"
            customStyle={{
              border: "none",
              fontFamily: "var(--ff-poppins-regular)"
            }}
          />
        </Col> */}

        <Col md={12}>
          <Input
            inputStyle={{
              display: "flex",
            }}
            type={"date"}
            setter={setStartDate}
            value={startDate}
            max={new Date().toISOString().split("T")[0]}
            placeholder={"Select Start Date"}
            label={"Start Date"}
            form
          />
        </Col>
        <Col md={12}>
          <Input
            inputStyle={{
              display: "flex",
            }}
            min={new Date(startDate).toISOString().split("T")[0]}
            max={new Date().toISOString().split("T")[0]}
            type={"date"}
            setter={setEndDate}
            value={endDate}
            placeholder={"Select End Date"}
            label={"End Date"}
            form
            disabled={!startDate}
          />
        </Col>
        <Col md={12} className={classes.jCenter}>
          <Button
            variant="secondary"
            className={classes.loginBtn}
            onClick={faqHandler}
            disabled={isLoading}
          >
            {isLoading ? "Wait..." : data ? "Edit" : "Add"}
          </Button>
        </Col>
      </Row>
    </ModalSkeleton>
  );
}

export default AddReportModal;
