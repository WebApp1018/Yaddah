import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Patch, Post } from "../../Axios/AxiosFunctions";
import { Button } from "../../Components/Button/Button";
import { Input } from "../../Components/Input/Input";

import {
  capitalizeFirstLetter,
  apiHeader,
  BaseURL,
  formRegEx,
  formRegExReplacer,
} from "../../config/apiUrl";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./EditPackageModal.module.css";

const EditPackageModal = ({ show, setShow, data }) => {
  // const token = useSelector((state) => state.authReducer.access_token);
  const { accessToken } = useSelector((state) => state.authReducer);

  const [bookings, setBookings] = useState(data.includeBooking);
  const [venue, setVenue] = useState(data.locationVenue);
  const [staff, setStaff] = useState(data.staff);
  const [services, setServices] = useState(data.services);
  const [order, setOrder] = useState(data.order);
  const [isLoading, setIsLoading] = useState(false);

  // addPackage
  const addPackage = async () => {
    const url = BaseURL(`package/${data._id}`);

    const params = {
      // description: description,
      includeBooking: bookings,
      locationVenue: venue,
      staff,
      services,
      order,
    };

    console.log("----------------------------------------------------");

    // validate
    for (let key in params) {
      if (params[key] === "" || params[key] === null) {
        return toast.error(
          `${capitalizeFirstLetter(
            key?.replace(formRegEx, formRegExReplacer)
          )} can not be empty.`
        );
      }
    }

    // every params value must be a number
    for (let key in params) {
      if (isNaN(params[key])) {
        return toast.error(
          `${capitalizeFirstLetter(
            key?.replace(formRegEx, formRegExReplacer)
          )} must be a number.`
        );
      }
    }

    // every params value greater than 0
    for (let key in params) {
      if (params[key] <= 0) {
        return toast.error(
          `${capitalizeFirstLetter(
            key?.replace(formRegEx, formRegExReplacer)
          )} must be greater than 0.`
        );
      }
    }


    setIsLoading(true);
    const response = await Patch(url, params, apiHeader(accessToken));

    if (response) {
      toast.success("Package updated successfully");
      setShow(false);
    }
    setIsLoading(false);
  };
  return (
    <ModalSkeleton
      setShow={setShow}
      show={show}
      width={"800px"}
      header={capitalizeFirstLetter(data.packageType)}
      borderRadius={"20px"}
      headerClass={classes.header}
      showCloseIcon
    >
      <Row className={classes.row}>
        {/* <Col md={12} className={classes.header}>
          <h6>Description</h6>
          <div className={classes.addMoreWrap}onClick={() => {
                      setDescription((prev) => [...prev, ""]);
                    }}>
            <BsFillPlusCircleFill size={18} color={"var(--clr-secondary)"} />
            <span className={classes.addMore}>Add more</span>
          </div>
        </Col> */}
        {/* {description.map((element, index) => (
          <Col md={12} className={classes.desc}>
            <Input
              placeholder={"Enter Description"}
              form
              value={element}
              setter={(e) => {
                const temp = [...description];
                temp[index] = e;
                setDescription(temp);
              }}
            />
            {description.length > 1 && (
              <MdCancel
                size={25}
                className={classes.cancel}
                onClick={() => {
                  setDescription(description.filter((city, i) => i !== index));
                }}
              />
            )}
          </Col>
        ))} */}
        <Col md={12}>
          <Input
            type="number"
            label={"Include Monthly Bookings"}
            placeholder={"Enter no of Bookings"}
            form
            value={bookings}
            setter={setBookings}
          />
        </Col>
        <Col md={12}>
          <Input
            type="number"
            label={"Locations(Venue)"}
            placeholder={"Enter no of venues"}
            form
            value={venue}
            setter={setVenue}
          />
        </Col>
        <Col md={12}>
          <Input
            type="number"
            label={"Staff"}
            placeholder={"Enter no of Staff"}
            form
            value={staff}
            setter={setStaff}
          />
        </Col>
        <Col md={12}>
          <Input
            type="number"
            label={"Sorting Order"}
            placeholder={"Enter sorting order"}
            form
            value={order}
            setter={setOrder}
          />
        </Col>
        <Col md={12}>
          <Input
            type="number"
            label={"Services"}
            placeholder={"Enter no of Services"}
            form
            value={services}
            setter={setServices}
          />
        </Col>
        <Col md={12} className={classes.jCenter}>
          <Button
            variant="secondary"
            //   className={classes.loginBtn}
            customStyle={{
              minWidth: "120px",
            }}
            onClick={addPackage}
            disabled={isLoading}
            label={isLoading ? "Updating..." : "Update"}
          />
          {/* </Button> */}
        </Col>
      </Row>
    </ModalSkeleton>
  );
};

export default EditPackageModal;
