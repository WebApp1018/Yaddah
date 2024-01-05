import React, { useState } from "react";
import SidebarSkeleton from "../../components/SidebarSkeleton";
import styles from "./Subcription.module.css";
import { Button } from "../../components/Button/Button";
import { Col, Row } from "react-bootstrap";
import moment from "moment";
import { apiHeader, BaseURL } from "../../config/apiUrl";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOutRequest, updateUser } from "../../redux/auth/authSlice";
import AreYouSureModal from "../../Modals/AreYouSureModal";
import { useEffect } from "react";

const TitleAndValue = ({ label, value }) => {
  return (
    <div className={styles.labelAndValue}>
      <label>{label}:</label>
      <span>{value}</span>
    </div>
  );
};

// Page
function AllBookings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken, user } = useSelector((state) => state.authReducer);
  const [isUnsubscribeModalOpen, setIsUnsubscribeModalOpen] = useState(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);

  // getMe
  const getMe = async () => {
    const url = BaseURL("users/me");
    Get(url, accessToken, false, "true")
      .then((response) => {
        const apiUser = response?.data?.data?.user;
        dispatch(updateUser(apiUser));
      })
      .catch((err) => {
        if (err?.message == "logout") {
          dispatch(signOutRequest());
          navigate("/");
        }
      });
  };

  // unSubscribe
  const unSubscribe = async () => {
    setIsUnsubscribing(true);
    const response = await Patch(
      BaseURL(`users/unsubscribe-plan`),
      {},
      apiHeader(accessToken)
    );
    if (response !== undefined) {
      dispatch(updateUser(response?.data?.data?.user));
      navigate("/pricing");
    }
    setIsUnsubscribing(false);
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.__header}>
          <h1>Subscription</h1>
          <div className={styles.headerRight}>
            {/* <SearchInput setter={setSearchInput} value={searchInput} /> */}
            <Button
              label={"Change Plan"}
              className={styles.DownloadReport}
              customStyle={{
                backgroundColor: "var(--clr-secondary)",
                color: "var(--clr-font-inverted)",
                fontFamily: "var(--ff-poppins-semibold)",
                padding: "16px",
              }}
              onClick={() => navigate("/pricing")}
            />
          </div>
        </div>
        <div className={styles.__content}>
          <Row className={styles.rowGap}>
            <Col md={6}>
              <TitleAndValue label={"Package Type"} value={user?.packageType} />
            </Col>
            <Col md={6}>
              <TitleAndValue label={"Plan Type"} value={user?.planType} />
            </Col>
            {!user?.subscriptionExpired && !user?.packageType === "Free" && (
              <Col md={6}>
                <TitleAndValue
                  label={"Status"}
                  value={user?.subscriptionExpired ? "Expired" : "Active"}
                />
              </Col>
            )}
            <Col md={6}>
              <TitleAndValue
                label={"Amount"}
                value={`$${user?.planAmount || 0}`}
              />
            </Col>
            <Col md={6}>
              <TitleAndValue
                label={"Plan StartDate"}
                value={
                  user?.planStartDate
                    ? moment(user?.planStartDate).format("ll hh:mm a")
                    : "---"
                }
              />
            </Col>
            <Col md={6}>
              <TitleAndValue
                label={"Plan EndDate"}
                value={
                  user?.planEndDate
                    ? moment(user?.planEndDate).format("ll hh:mm a")
                    : "---"
                }
              />
            </Col>

            <Col md={6}>
              <TitleAndValue
                label={"Allowed Staff"}
                value={`${user?.totalStaff || 0}`}
              />
            </Col>
            <Col md={6}>
              <TitleAndValue
                label={"Allowed Venue"}
                value={`${user?.totalVenues || 0}`}
              />
            </Col>
            <Col md={6}>
              <TitleAndValue
                label={"Allowed Booking"}
                value={`${user?.totalBookings || 0}`}
              />
            </Col>
            <Col md={6}>
              <TitleAndValue
                label={"Allowed Services"}
                value={`${user?.totalServices || 0}`}
              />
            </Col>
            <Col md={6}>
              <TitleAndValue
                label={"Available Bookings"}
                value={`${user?.availableBookings}`}
              />
            </Col>
            <Col md={6}>
              <TitleAndValue
                label={"Available Services"}
                value={`${user?.availableServices}`}
              />
            </Col>
            <Col md={6}>
              <TitleAndValue
                label={"Available Staff"}
                value={`${user?.availableStaff}`}
              />
            </Col>
            <Col md={6}>
              <TitleAndValue
                label={"Available Venues"}
                value={`${user?.availableVenues}`}
              />
            </Col>

            {/* Unsubscribe */}
            {moment(user?.planEndDate).format("x") > moment().format("x") &&
              !["free", "none"].includes(user?.packageType?.toLowerCase()) &&
              user?.paypalSubscriptionId && (
                <Col md={12} className={styles.btnDiv}>
                  <Button
                    customStyle={{
                      backgroundColor: "var(--clr-secondary)",
                      color: "var(--clr-font-inverted)",
                      fontFamily: "var(--ff-poppins-semibold)",
                      padding: "16px",
                      minWidth: "170px",
                    }}
                    onClick={() => setIsUnsubscribeModalOpen(true)}
                  >
                    {"Unsubscribe"}
                  </Button>
                </Col>
              )}
          </Row>
        </div>
      </div>

      {isUnsubscribeModalOpen && (
        <AreYouSureModal
          show={isUnsubscribeModalOpen}
          setShow={setIsUnsubscribeModalOpen}
          isApiCall={isUnsubscribing}
          subTitle={"Are you sure you want to unsubscribe?"}
          onClick={unSubscribe}
        />
      )}
    </SidebarSkeleton>
  );
}

export default AllBookings;
