import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Button } from "../../Components/Button/Button";
import { Input } from "../../Components/Input/Input";
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import { apiHeader, BaseURL } from "../../config/apiUrl";
import { Get, Patch, Post } from "../../Axios/AxiosFunctions";
import classes from "./AddCoupon.module.css";
import { toast } from "react-toastify";
import moment from "moment";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Loader } from "../../Components/Loader";

function AddCoupon() {
  const { accessToken } = useSelector((state) => state.authReducer);
  const id = useParams()?.id;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [maxUserUse, setMaxUserUse] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGetLoading, setIsGetLoading] = useState(false);
  const [maxUsed, setMaxUsed] = useState(0);

  // getCoupon
  const getCoupon = async () => {
    setIsGetLoading(true);
    const response = await Get(
      BaseURL(`coupon/view-detail/${id}`),
      accessToken
    );
    if (response !== undefined) {
      setIsGetLoading(false);
      setTitle(response?.data.data?.title);
      setCouponCode(response?.data.data?.code);
      setDiscount(response?.data.data?.discount);
      setMaxUserUse(response?.data.data?.maxUsers);
      setExpiryDate(moment(response?.data.data?.expire).format("YYYY-MM-DD"));
      setMaxUsed(response?.data.data?.maxUsed);
    }
  };

  useEffect(() => {
    if (id) {
      getCoupon();
    }
  }, []);

  async function addCoupon() {
    const url = BaseURL("coupon");
    if (moment(expiryDate).isBefore(moment())) {
      return toast.error("Expiry date must be greater than today");
    }
    const params = {
      title,
      code: couponCode,
      discount,
      maxUserUse,
      maxUsers: maxUserUse,
      expire: expiryDate,
    };

    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error("Please fill all the fields");
      }
    }

    // if discount is not number
    if (isNaN(params.discount)) {
      return toast.error("Discount must be a number");
    }

    // max users is not number
    if (isNaN(params.maxUsers)) {
      return toast.error("Max users must be a number");
    }

    if (params.discount > 99) {
      return toast.error("Discount must be less than 100");
    }

    if (params.discount < 1) {
      return toast.error("Discount must be greater than 0");
    }

    setIsLoading(true);
    const response = await Post(url, params, apiHeader(accessToken));
    setIsLoading(false);
    if (response) {
      toast.success("Coupon added successfully");
      navigate(-1);
    }
  }

  async function EditCoupon() {
    const url = BaseURL(`coupon/${id}`);
    if (moment(expiryDate).isBefore(moment())) {
      return toast.error("Expiry date must be greater than today");
    }
    const params = {
      title,
      code: couponCode,
      discount,
      maxUsers: maxUserUse,
      expire: expiryDate,
    };

    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error("Please fill all the fields");
      }
    }

    // if discount is not number
    if (isNaN(params.discount)) {
      return toast.error("Discount must be a number");
    }

    // max users is not number
    if (isNaN(params.maxUsers)) {
      return toast.error("Max users must be a number");
    }

    if (params.discount > 99) {
      return toast.error("Discount must be less than 100");
    }

    if (params.discount < 1) {
      return toast.error("Discount must be greater than 0");
    }

    setIsLoading(true);
    const response = await Patch(url, params, apiHeader(accessToken));
    setIsLoading(false);
    if (response) {
      toast.success("Coupon updated successfully");
      navigate(-1);
    }
  }

  return (
    <SidebarSkeleton>
      {isGetLoading ? (
        <Loader className={classes.loader} />
      ) : (
        <Container fluid className={classes.container}>
          <Row className={classes.row}>
            <Col md={12}>
              <h3>{id ? "Edit Coupon" : "Add Coupons"}</h3>
            </Col>
            <Col md={6}>
              <Input
                typr="text"
                value={title}
                setter={setTitle}
                label={"Title"}
                placeholder={"Enter Title"}
                form
              />
            </Col>
            <Col md={6}>
              <Input
                type="text"
                value={couponCode}
                setter={setCouponCode}
                label={"Coupon Code"}
                placeholder={"Enter Coupon Code"}
                form
                disabled={id}
              />
            </Col>
            <Col md={6}>
              <Input
                type="number"
                value={discount}
                setter={setDiscount}
                label={"Discount (%)"}
                placeholder={"Enter Discount (%)"}
                form
                max={99}
                min={1}
              />
            </Col>
            <Col md={6}>
              <Input
                type="number"
                value={maxUserUse}
                setter={setMaxUserUse}
                label={"Max User Use"}
                placeholder={"Enter Max User Use"}
                form
              />
            </Col>
         
            <Col md={6}>
              <Input
                type="date"
                value={expiryDate}
                setter={setExpiryDate}
                label={"Expiry Date"}
                placeholder={"Enter Expiry Date"}
                form
              />
            </Col>
            {id && (
              <Col md={6}>
                <Input
                  type="number"
                  value={maxUsed}
                  setter={setMaxUsed}
                  label={"Max Used"}
                  form
                  disabled={true}
                />
              </Col>
            )}
            <Col md={12}>
              {id ? (
                <Button
                  onClick={() => EditCoupon()}
                  className={classes.btnSecondary}
                  disabled={isLoading}
                >
                  {isLoading ? "Update..." : "Update Coupon"}
                </Button>
              ) : (
                <Button
                  onClick={() => addCoupon()}
                  className={classes.btnSecondary}
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Add Coupon"}
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      )}
    </SidebarSkeleton>
  );
}

export default AddCoupon;
