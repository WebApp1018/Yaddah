import moment from "moment";
import React from "react";
import { Col, Row } from "react-bootstrap";
import ShowMoreShowLessText from "../../Components/ShowMoreShowLess/ShowMoreShowLessText";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./CategoryDetailModal.module.css";
import { imageUrl } from "../../config/apiUrl";

const CategoryDetailModal = ({ show, setShow, data }) => {
  return (
    <>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width={"750px"}
        borderRadius={"10px"}
        header={"Category Detail"}
        showCloseIcon={true}>
        <Row className={classes.rowGap}>
          <Col md={12}>
            <p className={classes.mainHead}>Image:</p>
            <div className={classes.imgBox}>
              <img src={imageUrl(data?.image)} />
            </div>
          </Col>
          <Col md={12}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Name:</p>
              <p className={classes.text}>{data?.name}</p>
            </div>
          </Col>

          <Col md={12}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Created At:</p>
              <p className={classes.timeText}>
                {moment(data?.createdAt).format("DD MMM YYYY hh:mm a")}
              </p>
            </div>
          </Col>

          <Col md={12}>
            <p className={classes.mainHead}>Description:</p>
            <p className={classes.text}>
              <ShowMoreShowLessText text={data?.description} visibility={200} />
            </p>
          </Col>
        </Row>
      </ModalSkeleton>
    </>
  );
};

export default CategoryDetailModal;
