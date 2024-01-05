import React from "react";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./ContactUsDetailModal.module.css";
import moment from "moment";

const ContactUsDetailModal = ({ show, setShow, data }) => {
  return (
    <div>
      <ModalSkeleton
        setShow={setShow}
        show={show}
        width={"800px"}
        header={"Contact Details"}
        borderRadius={"20px"}
        showCloseIcon
      >
        <div className={classes.main}>
          <p className="t-t-c">
            <b>Name: </b>
            {data?.name}
          </p>
          <p>
            <b>Email: </b>
            <a href={`mailto:${data?.email}`}>{data?.email}</a>
          </p>
          <p>
            <b>Phone No: </b>
            <a href={`tel:${data?.phoneNo}`}>{data?.phoneNo}</a>
          </p>
          <p>
            <b>Phone No: </b>
            <a href={data?.website} target="_blank">
              {data?.website}
            </a>
          </p>

          <p>
            <b>Message: </b>
            {data?.message}
          </p>
          <p>
            <b>Made Contact At: </b>
            {moment(data?.createdAt).format("DD MMM YYYY hh:mm A")}
          </p>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default ContactUsDetailModal;
