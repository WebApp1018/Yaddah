import moment from "moment";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Patch } from "../../Axios/AxiosFunctions";
import { Button } from "../../Components/Button/Button";
import UploadImageBox from "../../Components/UploadImageBox";
import { apiHeader, BaseURL, imageUrl } from "../../config/apiUrl";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./ServiceProviderDetailModal.module.css";

const ServiceProviderDetailModal = ({
  show,
  setShow,
  data,
  setData,
  serviceProviders,
  setServiceProviders,
  filter,
  ratingPage = true,
}) => {
  const { accessToken } = useSelector((state) => state.authReducer);
  const [isLoading, setIsLoading] = useState("");

  const UpdateRating = async (status, messageTitle) => {
    const params = {
      rating: status,
    };
    setIsLoading(status);
    const response = await Patch(
      BaseURL(`users/rating/${data?._id}`),
      params,
      apiHeader(accessToken)
    );
    if (response) {
      const temp = [...serviceProviders];
      if (ratingPage) {
        if (filter.value === "all") {
          status === "none"
            ? temp?.splice(
                temp?.findIndex(
                  (item) => item?._id == response?.data?.data?._id
                ),
                1
              )
            : temp?.splice(
                temp?.findIndex(
                  (item) => item?._id == response?.data?.data?._id
                ),
                1,
                response?.data?.data
              );
        } else {
          temp?.splice(
            temp?.findIndex((item) => item?._id == response?.data?.data?._id),
            1
          );
        }
      } else {
        temp?.splice(
          temp?.findIndex((item) => item?._id == response?.data?.data?._id),
          1,
          response?.data?.data
        );
      }

      setServiceProviders(temp);
      setData(response?.data?.data);
      toast.success(`Service Provider ${messageTitle} Successfully`);
    }
    setIsLoading("");
  };
  return (
    <>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width={"750px"}
        borderRadius={"10px"}
        header={"Service Provider Detail"}
        showCloseIcon
      >
        <Row className={classes.row}>
          <Col md={12} className={classes.img}>
            <UploadImageBox
              state={data?.photo}
              containerClass={classes.imgBox}
              isCloseable={false}
              edit={false}
            />
          </Col>

          <Col md={6}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Full Name:</p>
              <p className={classes.timeText}>
                {data?.fullName || "Not Added Yet"}
              </p>
            </div>
          </Col>
          <Col md={6}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>User Name:</p>
              <p className={classes.timeText}>
                {data?.userName || "Not Added Yet"}
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
              <p className={classes.mainHead}>Contact Number:</p>
              <p className={classes.text}>{data?.phoneNo}</p>
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
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Description:</p>
              <p className={classes.text}>
                {data?.description || "Not Added Yet"}
              </p>
            </div>
          </Col>

          <Col md={12}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Commercial License:</p>
              {data?.commercialLicense == null ? (
                <p className={classes.text}>Not Added Yet</p>
              ) : (
                <a
                  className={`${classes.text} ${classes?.linkText}`}
                  onClick={() => {
                    window.open(imageUrl(data?.commercialLicense));
                  }}
                >
                  Click Here
                </a>
              )}
            </div>
          </Col>
          {/* Other Details */}
          <Col md={12}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Organization:</p>
              <p className={classes.text}>{data?.organization}</p>
            </div>
          </Col>
          <Col md={12}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Fax:</p>
              <p className={classes.text}>{data?.fax}</p>
            </div>
          </Col>
          <Col md={12}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Comment:</p>
              <p className={classes.text}>{data?.comment}</p>
            </div>
          </Col>

          <Col md={12}>
            <h4>Location Details:</h4>
          </Col>
          <Col md={12}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Address:</p>
              <p className={classes.text}>{data?.address}</p>
            </div>
          </Col>
          <Col md={6}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Country:</p>
              <p className={classes.text}>{data?.country}</p>
            </div>
          </Col>

          <Col md={6}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>City:</p>
              <p className={classes.text}>{data?.city}</p>
            </div>
          </Col>

          <Col md={6}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>State:</p>
              <p className={classes.text}>{data?.regionState}</p>
            </div>
          </Col>
          <Col md={6}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Zip Code:</p>
              <p className={classes.text}>{data?.zipCode}</p>
            </div>
          </Col>

          <Col md={12}>
            <h4>Subscription Details:</h4>
          </Col>

          <Col md={6}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Package Type:</p>
              <p className={classes.text}>{data?.packageType}</p>
            </div>
          </Col>
          <Col md={6}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Plan Type:</p>
              <p className={classes.text}>{data?.planType}</p>
            </div>
          </Col>
          <Col md={6}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Subscribed:</p>
              <p className={classes.text}>
                {data?.subscriptionExpired ? "No" : "Yes"}
              </p>
            </div>
          </Col>
          <Col md={6}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>Expiration Date:</p>
              <p className={classes.text}>
                {moment(data?.planEndDate).format("DD MMM YYYY")}
              </p>
            </div>
          </Col>
          <Col md={12}>
            <h4>Usage:</h4>
          </Col>
          <Col md={6}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>My Venues</p>
              <p className={classes.text}>{data?.myVenues?.length}</p>
            </div>
          </Col>
          <Col md={6}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>My Staff</p>
              <p className={classes.text}>{data?.myStaff?.length}</p>
            </div>
          </Col>
          <Col md={6}>
            <div className={classes.viewEventMain}>
              <p className={classes.mainHead}>My Services</p>
              <p className={classes.text}>{data?.myServices?.length}</p>
            </div>
          </Col>

          <Col md={12} className={classes.btnWrap}>
            <Button
              onClick={() => {
                UpdateRating("top-rated", "Mark Top Rated");
              }}
              className={`${
                data?.userRating === "top-rated" && classes.activeBtn
              } ${classes.btn}`}
              label={isLoading === "top-rated" ? "wait..." : "Mark Top Rated"}
            />
            <Button
              onClick={() => {
                UpdateRating("preferred", "Mark Preferred");
              }}
              className={`${
                data?.userRating === "preferred" && classes.activeBtn
              } ${classes.btn}`}
              label={isLoading === "preferred" ? "wait..." : "Mark Preferred"}
            />
            <Button
              onClick={() => {
                UpdateRating("none", "Removed from Rating");
              }}
              className={`${data?.userRating === "none" && classes.activeBtn} ${
                classes.btn
              }`}
              label={isLoading === "none" ? "wait..." : "Remove from Rating"}
            />
          </Col>
        </Row>
      </ModalSkeleton>
    </>
  );
};

export default ServiceProviderDetailModal;
