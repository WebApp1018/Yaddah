import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ScrollContainer from "react-indiana-drag-scroll";
import { useNavigate, useParams } from "react-router-dom";
import { Get, Post } from "../../Axios/AxiosFunctions";
import Lightbox from "react-image-lightbox";
import Carousel from "react-elastic-carousel";
import "react-multi-carousel/lib/styles.css";

import StaffCard from "../../components/StaffCard";
import VenueCard from "../../components/VenueCard";
import ShowMoreShowLessText from "../../components/ShowMoreShowLess/ShowMoreShowLessText";
import { apiHeader, BaseURL, imageUrl } from "../../config/apiUrl";
import { isMobileViewHook } from "../../CustomHooks/isMobileViewHook";

import { minutesToHours } from "../../Helper/commonHelper";
import classes from "./ServiceDetailScreen.module.css";
import PublicVenueDetailModal from "../../Modals/PublicVenueDetailModal/PublicVenueDetailModal";
import PublicStaffDetailModal from "../../Modals/PublicStaffDetailModal/PublicStaffDetailModal";
import {
  createTimeChunk,
  initialScheduleDateRange,
} from "../../Helper/scheduler";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Loader } from "../../components/Loader";
import LottieLoader from "../../components/LottieLoader/LottieLoader";
import { BsImages } from "react-icons/bs";

const ServiceDetailScreen = () => {
  const navigate = useNavigate();
  const serviceId = useParams()?.id;
  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const user = useSelector((state) => state.authReducer.user);
  const [serviceData, setServiceData] = useState(null);
  const [isLoadingServiceData, setIsLoadingServiceData] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isVenueDetailModalOpen, setIsVenueDetailModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isStaffDetailModalOpen, setIsStaffDetailModalOpen] = useState(false);
  const [isGettingStaffSchedule, setIsGettingStaffSchedule] = useState(false);
  const [selectedStaffSchedule, setSelectedStaffSchedule] = useState([]);
  const [schedulerDateRange, setSchedulerDateRange] = useState(
    initialScheduleDateRange
  );
  const [isBookNowApiCalling, setIsBookNowApiCalling] = useState(false);
  const [isLightRoomOpen, setIsLightRoomOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // schedule states
  const [timeArray, setTimeArray] = useState([]);
  const [selectedSlotsData, setSelectedSlotsData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  // renderImageGallery
  const renderImageGallery = () => {
    const responsive = {
      superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 5,
      },
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
      },
    };
    return (
      <>
        <style jsx>{`
          button.rec-dot:hover,
          button.rec-dot:active,
          button.rec-dot:focus {
            box-shadow: 0 0 1px 1px var(--clr-primary);
          }
          .dcYvsJ {
            background-color: var(--clr-primary) !important;
          }
          .hcZHLS {
            height: 210px;
          }
          button.rec {
            box-shadow: 0 0 1px 1px var(--clr-primary);
          }
        `}</style>
        {!isMobile ? (
          <Row className={classes?.imageGalleryContainer}>
            <Col lg={6} md={12} sm={12}>
              <div
                className={`${classes?.galleryBigImageContainer}`}
                onClick={() => {
                  setIsLightRoomOpen(true);
                  setPhotoIndex(0);
                }}
              >
                {serviceData?.createdBy?.userRating !== "none" && (
                  <div
                    data-badge={serviceData?.createdBy?.userRating.replace(
                      /-/g,
                      " "
                    )}
                    // data-badge={"top rated"}
                    className={classes?.spBadge}
                  />
                )}
                <img src={imageUrl(serviceData?.images[0])} />
              </div>
            </Col>
            <Col lg={6} md={12} sm={12}>
              <Row>
                {[0, 1, 2, 3].map((e, i) => (
                  <Col lg={6} md={6} sm={6} key={i}>
                    <div
                      className={classes?.gallerySmallImageContainer}
                      onClick={() => {
                        if (!!otherImages[e]) {
                          setIsLightRoomOpen(true);
                          setPhotoIndex(++i);
                        }
                      }}
                    >
                      {!!otherImages[e] ? (
                        <img src={imageUrl(otherImages[e])} />
                      ) : (
                        <div className={classes.noImageFound}>
                          <BsImages />
                          <p>No Image</p>
                        </div>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        ) : (
          <Row className={classes?.imageGalleryContainer}>
            <Carousel responsive={responsive} showArrows={false}>
              {serviceData?.images?.map((item, i) => {
                return (
                  <div
                    className={classes.gallerySmallImageContainer}
                    onClick={() => {
                      setIsLightRoomOpen(true);
                      setPhotoIndex(++i);
                    }}
                    key={i}
                  >
                    <img src={imageUrl(item)} />
                  </div>
                );
              })}
            </Carousel>
          </Row>
        )}
      </>
    );
  };

  // gtServiceData
  const getServiceData = async () => {
    if (!serviceId) return navigate(-1);
    const url = BaseURL(`service/detail/${serviceId}`);

    setIsLoadingServiceData(true);
    const response = await Get(url);
    setIsLoadingServiceData(false);

    if (response) {
      setServiceData(response?.data?.data);
    }
  };

  // staffCardClickHandler
  const staffCardClickHandler = async (staff) => {
    if (!accessToken) return toast.info("Please login first");
    if (!selectedVenue) return toast.info("Please select a venue first");
    setSelectedSlotsData([]);
    await getStaffSchedule(staff?._id);
    setSelectedStaff(staff);
    setIsStaffDetailModalOpen(true);
  };

  // getStaffSchedule
  const getStaffSchedule = async (
    staffId,
    isInitial = true,
    newScheduledDateRange
  ) => {
    const params = {};
    if (isInitial) {
      params.startDate = initialScheduleDateRange?.startDate;
      params.endDate = initialScheduleDateRange?.endDate;
    } else {
      params.startDate = newScheduledDateRange?.startDate;
      params.endDate = newScheduledDateRange?.endDate;
    }

    const url = BaseURL(`service/staff-schedule/${staffId}`);

    // if initial ? set staff id : boolean
    setIsGettingStaffSchedule(isInitial ? staffId : true);
    const response = await Post(url, params);
    setIsGettingStaffSchedule(false);

    if (response) {
      setSelectedStaffSchedule(response?.data?.data);
    }
  };

  // handleDateChangePress [type => prev, next]
  const handleDateChangePress = (type) => {
    const { startDate, endDate } = schedulerDateRange;
    const newStartDate = moment(startDate)
      .add(type === "prev" ? -7 : 7, "days")
      .format();
    const newEndDate = moment(endDate)
      .add(type === "prev" ? -7 : 7, "days")
      .format();

    const newScheduledDateRange = {
      startDate: newStartDate,
      endDate: newEndDate,
    };

    setSchedulerDateRange(newScheduledDateRange);
    getStaffSchedule(selectedStaff?._id, false, newScheduledDateRange);
  };

  // handleValidations
  const handleValidationsAndParamsGeneration = () => {
    if (!accessToken) {
      navigate("/login");
      return [null, false];
    }

    if (user?.role !== "customer") {
      toast.info("Only customer can book a service.");
      return [null, false];
    }

    const params = {
      serviceId,
      venue: selectedVenue?._id,
      staff: selectedStaff?._id,
      bookedSlots: {
        ...selectedSlotsData,
        date: moment.utc(selectedSlotsData?.date).format(),
      },
      service: serviceId,
      price: serviceData?.price,
    };

    if (!selectedVenue) {
      toast.info("Please select a venue");
      return [null, false];
    }
    if (!selectedStaff) {
      toast.info("Please select a staff");
      return [null, false];
    }

    if (!selectedSlotsData?.date) {
      toast.info("Please select a slot");
      return [null, false];
    }

    return [params, true];
  };

  // handleBookNowPress
  const handleBookNowPress = async (order, extraData) => {
    let [params, isValid] = handleValidationsAndParamsGeneration();
    if (!isValid) return;

    // paypal order id
    params.orderId = order?.id;
    if (extraData) {
      params = { ...params, ...extraData };
    }
    const url = BaseURL(`booking/create`);

    setIsBookNowApiCalling(true);
    const response = await Post(url, params, apiHeader(accessToken));
    setIsBookNowApiCalling(false);

    if (response !== undefined) {
      toast.success("Booking created successfully.");
      const dataId = response?.data?.data?._id;
      navigate(`/booking/${dataId}`, {
        replace: true,
      });
    }
  };

  // on mount load data
  useEffect(() => {
    getServiceData();
    isMobileViewHook(setIsMobile, 580);
  }, []);

  // create time chunks
  useEffect(() => {
    const createChunksHandler = async () => {
      const timeChunk = await createTimeChunk(30);
      setTimeArray(timeChunk);
    };
    createChunksHandler();
  }, []);

  if (isLoadingServiceData) {
    return <Loader />;
  }

  const otherImages = serviceData?.images?.slice(1) || [];

  return (
    <div className={classes?.mainContainer}>
      {/* Booking Strip */}
      <div className={classes?.bookingStrip}>
        <h3>Booking</h3>
      </div>

      <Container>
        {/* render Image Gallery */}
        <Row className={classes.gap}>
          <Col md={12}>{renderImageGallery()}</Col>

          <Col md={12} className={classes.head}>
            <h3 className="t-t-c">{serviceData?.name}</h3>
            <h3>${parseFloat(serviceData?.price).toFixed(2)}</h3>
          </Col>
          <Col md={12} className={classes.head}>
            <div>
              <span className={classes.subHead}>Service Category: </span>
              <span className="t-t-c">{serviceData?.category?.name}</span>
            </div>
            <div className={classes.time}>
              <p>{minutesToHours(serviceData?.length)}</p>
            </div>
          </Col>
          <Col md={12} className={classes.head}>
            <span className={classes.subHead}>Description: </span>
          </Col>
          <Col md={12} className={classes.head}>
            <div className={classes.desc}>
              <p>
                <ShowMoreShowLessText
                  text={serviceData?.description}
                  visibility={600}
                />
              </p>
            </div>
          </Col>
          <Col md={12}>
            <h4>Select Venue:</h4>
          </Col>
        </Row>
      </Container>
      <ScrollContainer
        horizontal
        className={`${classes.scroller} ${classes.venueScroller}`}
      >
        {serviceData?.venue.map((item, index) => (
          <div
            className={classes.venueCardWrap}
            key={index}
            onClick={() => {
              setSelectedVenue(item);
            }}
          >
            <VenueCard
              item={item}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedVenue(item);
                setIsVenueDetailModalOpen(true);
              }}
              selectedVenue={selectedVenue}
            />
          </div>
        ))}
      </ScrollContainer>
      <Container>
        {/* render Image Gallery */}
        <Row className={classes.gap}>
          <Col md={12}>
            <h4>Select Staff:</h4>
          </Col>
        </Row>
      </Container>
      <ScrollContainer
        horizontal
        className={`${classes.scroller} ${classes.staffScroller}`}
      >
        {serviceData?.staff?.map((item, index) => (
          <div
            className={classes.staffCardWrap}
            key={index}
            onClick={staffCardClickHandler.bind(this, item)}
          >
            <StaffCard
              item={item}
              onClick={staffCardClickHandler.bind(this, item)}
              selectedStaff={selectedStaff}
              isGettingStaffSchedule={isGettingStaffSchedule} // id of selected staff
            />
          </div>
        ))}
      </ScrollContainer>

      {/* Venue Detail Modal */}
      {isVenueDetailModalOpen && (
        <PublicVenueDetailModal
          show={isVenueDetailModalOpen}
          setShow={setIsVenueDetailModalOpen}
          data={selectedVenue}
        />
      )}
      {/* Staff Detail Modal */}
      {isStaffDetailModalOpen && (
        <PublicStaffDetailModal
          show={isStaffDetailModalOpen}
          setShow={setIsStaffDetailModalOpen}
          data={selectedStaff}
          timeArray={timeArray}
          slotTime={serviceData?.length}
          schedule={selectedStaffSchedule}
          isGettingStaffSchedule={isGettingStaffSchedule}
          handleDateChangePress={handleDateChangePress}
          setSelectedSlotsData={setSelectedSlotsData}
          handleBookNowPress={handleBookNowPress}
          isBookNowApiCalling={isBookNowApiCalling}
          handleValidations={handleValidationsAndParamsGeneration}
          price={serviceData?.price}
        />
      )}

      {/* LightBox */}
      {isLightRoomOpen && (
        <Lightbox
          mainSrc={imageUrl(serviceData?.images[photoIndex])}
          nextSrc={imageUrl(
            serviceData?.images[(photoIndex + 1) % serviceData?.images?.length]
          )}
          prevSrc={imageUrl(
            serviceData?.images[
              (photoIndex + serviceData?.images?.length - 1) %
                serviceData?.images?.length
            ]
          )}
          onCloseRequest={() => {
            setIsLightRoomOpen(false);
          }}
          onMovePrevRequest={() =>
            setPhotoIndex(
              (photoIndex + serviceData?.images?.length - 1) %
                serviceData?.images?.length
            )
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % serviceData?.images?.length)
          }
        />
      )}

      {isBookNowApiCalling && <LottieLoader className={classes?.bodyLoader} />}
    </div>
  );
};

export default ServiceDetailScreen;
