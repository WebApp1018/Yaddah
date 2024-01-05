import moment from "moment";
import React from "react";
import { Col, Row } from "react-bootstrap";
import UploadImageBox from "../../Components/UploadImageBox";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./SubAdminDetailModal.module.css";

const SubAdminDetailModal = ({ show, setShow, data }) => {
  return (
    <>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width={"750px"}
        borderRadius={"10px"}
        header={"SubAdmin Detail"}
        showCloseIcon
      >
        <Row className="gy-2">
          <Col md={12} className={classes.img}>
            <UploadImageBox
              state={data?.photo}
              containerClass={classes.imgBox}
              isCloseable={false}
              edit={false}
            />
          </Col>
          <Col md={6}>
            <p className={classes.mainHead}>User Name:</p>
            <p className={classes.text}>{data?.userName || "Not Added Yet"}</p>
          </Col>

          <Col md={6}>
            <p className={classes.mainHead}>Email:</p>
            <p className={classes.text}>{data?.email}</p>
          </Col>
          <Col md={6}>
            <p className={classes.mainHead}>Full Name:</p>
            <p className={classes.timeText}>
              {data?.fullName || "Not Added Yet"}
            </p>
          </Col>
          <Col md={6}>
            <p className={classes.mainHead}>Created At:</p>
            <p className={classes.text}>
              {moment(data?.createdAt).format("DD MMM YYYY hh:mm")}
            </p>
          </Col>
          <Col md={12}>
            <p className={classes.mainHead}>Permissions:</p>
            <p className={classes.text}>{data?.permissions?.join(", ")}</p>
          </Col>
        </Row>
      </ModalSkeleton>
    </>
  );
};

export default SubAdminDetailModal;
