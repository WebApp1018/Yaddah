import React from "react";
import moment from "moment";
import { Col, Row } from "react-bootstrap";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./StaffDetailModal.module.css";
import { imageUrl } from "../../config/apiUrl";
import ShowMoreShowLessText from "../../components/ShowMoreShowLess/ShowMoreShowLessText";
import { ProfileWithEditButton } from "../../components/ProfileWithEditButton";

const StaffDetailModal = ({ show, setShow, data }) => {
  return (
    <>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width={"750px"}
        borderRadius={"10px"}
        header={"Staff Detail"}
        showCloseIcon
      >
        <Row className="gy-2">
          <Col md={12} className={classes.aCenter}>
            <ProfileWithEditButton
              updateImage={imageUrl(data?.image)}
              edit={false}
            />
          </Col>
          <Col md={6}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Staff Name:</p>
              <p className={classes.text}>
                {data?.staffName || "Not Added Yet"}
              </p>
            </div>
          </Col>

          <Col md={6}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Email:</p>
              <p className={classes.text}>{data?.email}</p>
            </div>
          </Col>
          <Col md={6}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Phone No:</p>
              <p className={classes.timeText}>
                {data?.phoneNo || "Not Added Yet"}
              </p>
            </div>
          </Col>

          <Col md={6}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Created At:</p>
              <p className={classes.text}>
                {moment(data?.createdAt).format("DD MMM YYYY hh:mm")}
              </p>
            </div>
          </Col>

          <Col md={12}>
            <div className={classes.viewEventColumn}>
              <p className={classes.mainHead}>Description:</p>
              <p className={classes.text}>
                <ShowMoreShowLessText
                  text={data?.description}
                  visibility={200}
                />
              </p>
            </div>
          </Col>
          <Col md={12}>
            {!!data?.disabledDates?.length && (
              <h6 className={classes?.contactInfoHeading}>
                Not available on the following dates:
              </h6>
            )}

            <div className={classes.disabledDates}>
              {data?.disabledDates?.map((date, index) => (
                <div key={index}>{moment(date).format("ll")}</div>
              ))}
            </div>
          </Col>
        </Row>
      </ModalSkeleton>
    </>
  );
};

export default StaffDetailModal;
