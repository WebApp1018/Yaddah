import React from "react";
import { Col, Row } from "react-bootstrap";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./UpdatePlanByPayment.module.css";
import PaypalSubscriptionButton from "../../components/PaypalButton/PaypalSubscriptionButton";
import LottieLoader from "../../components/LottieLoader/LottieLoader";

function UpdatePlanByPayment({
  isLoading,
  show,
  setShow,
  packageData,
  handleSubmit,
  styles = {},
}) {
  return (
    <ModalSkeleton
      setShow={setShow}
      show={show}
      width={"600px"}
      header={"Upgrade Plan"}
      borderRadius={"20px"}
      showCloseIcon
    >
      <Row className={classes.row}>
        <Col md={12}>
          <p className={classes.dontHaveAnAccount}>
            Click on the button below to upgrade your plan.
          </p>
        </Col>

        <Col md={12} className={classes.jCenter}>
          <PaypalSubscriptionButton
            price={packageData?.price}
            planId={packageData?.planData?.id}
            onSubmit={handleSubmit}
            isfomrValidated={true}
            handleValidate={() => [true, true]}
          />
        </Col>
      </Row>

      {isLoading && <LottieLoader className={styles} />}
    </ModalSkeleton>
  );
}

export default UpdatePlanByPayment;
