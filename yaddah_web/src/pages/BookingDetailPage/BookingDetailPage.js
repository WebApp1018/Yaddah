import moment from "moment";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Carousel from "react-elastic-carousel";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Get } from "../../Axios/AxiosFunctions";
import { Loader } from "../../components/Loader";
import ShowMoreShowLessText from "../../components/ShowMoreShowLess/ShowMoreShowLessText";
import SidebarSkeleton from "../../components/SidebarSkeleton";
import WebSkeleton from "../../components/WebSkeleton";
import { BaseURL, imageUrl } from "../../config/apiUrl";
import { minutesToHours } from "../../Helper/commonHelper";
import classes from "./BookingDetailPage.module.css";

const BookingDetailPage = () => {
  const navigate = useNavigate();
  const bokingId = useParams()?.id;
  const token = useSelector((state) => state?.authReducer?.accessToken);

  const [bookingData, setBookingData] = useState(null);
  const [isLoadingBookingData, setIsLoadingBookingData] = useState(false);

  //  getBookingData
  const getBookingData = async () => {
    const url = BaseURL(`booking/${bokingId}`);

    setIsLoadingBookingData(true);
    const response = await Get(url);
    setIsLoadingBookingData(false);

    if (response) {
      setBookingData(response.data?.data);
    }
  };

  useEffect(() => {
    if (!bokingId) return navigate(-1);
    getBookingData();
  }, [bokingId]);

  // getBookedTimeSlot
  const getBookedTimeSlot = () => {
    if (bookingData?.bookedSlots[0]?.slot.length === 1)
      return bookingData?.bookedSlots[0]?.slot[0]?.time;
    else
      return (
        bookingData?.bookedSlots[0]?.slot[0]?.time +
        " - " +
        bookingData?.bookedSlots[0]?.slot[
          bookingData?.bookedSlots[0]?.slot.length - 1
        ]?.time
      );
  };

  // renderServiceDetail
  const renderServiceDetail = () => {
    return (
      <section
        className={`${classes?.renderServiceDetail} ${classes["border-bottom"]} mt-5`}
      >
        <h3 className="mb-3">Service Detail</h3>
        {/* images */}
        <Carousel showArrows={false} className="mb-3 customCarousel">
          {bookingData?.service?.images?.map((img, index) => (
            <div key={index} className={classes.imgBox}>
              <img src={imageUrl(img)} draggable={false} />
            </div>
          ))}
        </Carousel>

        {/* info */}
        <ItemList label={"Service Name"} value={bookingData?.service?.name} />
        <ItemList
          label={"Price"}
          value={`$${parseFloat(bookingData?.service?.price).toFixed(2)}`}
        />
        <ItemList
          label={"Duration"}
          value={minutesToHours(bookingData?.service?.length)}
        />
        <ItemList
          label={"Category"}
          value={bookingData?.service?.category?.name}
        />
        <ItemList
          label={"Description"}
          value={bookingData?.service?.description}
          isDescription
        />
      </section>
    );
  };

  // renderBookingDetail
  const renderBookingDetail = () => {
    return (
      <section
        className={`${classes?.renderServiceDetail} ${classes["border-bottom"]} mt-5`}
      >
        <h3 className="mb-3">Booking Detail</h3>
        <ItemList label={"Service Number"} value={bookingData?.name} />
        <ItemList
          label={"Price"}
          value={parseFloat(bookingData?.price).toFixed(2)}
        />
        <ItemList
          label={"Booked Date"}
          value={moment(bookingData?.bookedSlots[0]?.date).format("ll")}
        />
        <ItemList label={"Time Slot"} value={getBookedTimeSlot()} />
        <ItemList
          label={"Booking Status"}
          value={
            bookingData?.status === "pending" ? "booked" : bookingData?.status
          }
        />
        <ItemList
          label={"Booked At"}
          value={moment(bookingData?.createdAt).format("lll")}
        />
        {/* QR Code */}
        <div className="mt-3">
          <QRCode
            value={window.location.href}
            className={classes.qrCode}
            size={150}
          />
        </div>
      </section>
    );
  };

  // renderVenueDetail
  const renderVenueDetail = () => {
    return (
      <section
        className={`${classes?.renderServiceDetail} ${classes["border-bottom"]} mt-5`}
      >
        <h3 className="mb-3">Venue Detail</h3>
        {/* images */}
        <Carousel showArrows={false} className={"mb-3 customCarousel"}>
          {bookingData?.venue?.images?.map((img, index) => (
            <div key={index} className={classes.imgBox}>
              <img src={imageUrl(img)} draggable={false} />
            </div>
          ))}
        </Carousel>
        {/* Info */}
        <ItemList label={"Venue Name"} value={bookingData?.venue?.name} />
        <ItemList label={"Address"} value={bookingData?.venue?.address} />
        <ItemList
          label={"Description"}
          value={bookingData?.venue?.description}
          isDescription
        />

        <h4 className={classes?.contactInfoHeading}>Contact Information</h4>
        <ItemList
          label={"Contact Person"}
          value={bookingData?.venue?.contactName}
        />
        <ItemList
          label={"Contact Email"}
          value={bookingData?.venue?.contactEmail}
          ttc={false}
        />
        <ItemList
          label={"Contact Number"}
          value={bookingData?.venue?.contactNumber}
          ttc={false}
        />
      </section>
    );
  };

  // renderBookedStaff
  const renderBookedStaff = () => {
    return (
      <section
        className={`${classes?.renderServiceDetail} ${classes["border-bottom"]} mt-5`}
      >
        <h3 className="mb-3">Booked Staff</h3>
        {/* image */}
        <div className={classes.imgBoxProfile}>
          <img src={imageUrl(bookingData?.staff?.image)} draggable={false} />
        </div>
        <ItemList label={"Person Name"} value={bookingData?.staff?.staffName} />
        <ItemList label={"Email"} value={bookingData?.staff?.email} />
        <ItemList
          label={"Contact Number"}
          value={bookingData?.staff?.phoneNo}
          ttc={false}
        />
        <ItemList
          label={"Description"}
          value={bookingData?.staff?.description}
          isDescription
        />
      </section>
    );
  };

  // renderCustomerInfo
  const renderCustomerInfo = () => {
    return (
      <section
        className={`${classes?.renderServiceDetail} ${classes["border-bottom"]} mt-5`}
      >
        <h3 className="mb-3">Customer Info</h3>
        {/* image */}
        <div className={classes.imgBoxProfile}>
          <img src={imageUrl(bookingData?.customer?.photo)} draggable={false} />
        </div>
        <ItemList
          label={"Person Name"}
          value={bookingData?.customer?.fullName}
        />
        <ItemList label={"Email"} value={bookingData?.customer?.email} />
        <ItemList
          label={"Contact Number"}
          value={`${bookingData?.customer?.phoneNo}`}
          ttc={false}
        />
        {bookingData?.customer?.description !== "" && (
          <ItemList
            label={"Description"}
            value={bookingData?.customer?.description}
            isDescription
          />
        )}
      </section>
    );
  };

  // renderServiceProviderInfo
  const renderServiceProviderInfo = () => {
    return (
      <section
        className={`${classes?.renderServiceDetail} ${classes["border-bottom"]} mt-5`}
      >
        <h3 className="mb-3">Service Provider Info</h3>
        {/* image */}
        <div className={classes.imgBoxProfile}>
          <img
            src={imageUrl(bookingData?.serviceProvider?.photo)}
            draggable={false}
          />
        </div>
        <ItemList
          label={"Person Name"}
          value={bookingData?.serviceProvider?.fullName}
        />
        <ItemList label={"Email"} value={bookingData?.serviceProvider?.email} />
        <ItemList
          label={"Contact Number"}
          value={`${bookingData?.serviceProvider?.phoneNo}`}
          ttc={false}
        />
        {bookingData?.serviceProvider?.description !== "" && (
          <ItemList
            label={"Description"}
            value={bookingData?.serviceProvider?.description}
            isDescription
          />
        )}
      </section>
    );
  };

  // loader
  if (isLoadingBookingData) return <Loader />;

  const Wrapper = token ? SidebarSkeleton : WebSkeleton;

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

        button.rec {
          box-shadow: 0 0 1px 1px var(--clr-primary);
        }
      `}</style>
      <Wrapper>
        <Container fluid className={`p-0 m-0 mb-5`}>
          {/* Booking Strip */}
          <div className={classes?.bookingStrip}>
            <h3>Booking Detail</h3>
          </div>

          <Container fluid className={classes.main}>
            {/* renderServiceDetail */}
            {renderServiceDetail()}
            {/* renderBookingDetail */}
            {renderBookingDetail()}
            {/* renderVenueDetail */}
            {renderVenueDetail()}
            {/* renderBookedStaff */}
            {renderBookedStaff()}
            {/* renderCustomerInfo */}
            {renderCustomerInfo()}
            {/* renderServiceProviderInfo */}
            {renderServiceProviderInfo()}
          </Container>
        </Container>
      </Wrapper>
    </>
  );
};

export default BookingDetailPage;

const ItemList = ({
  label,
  value,
  isDescription,
  ttc = true,
  borderBottom,
}) => {
  return (
    <div
      className={`${classes.itemList} ${
        borderBottom && classes["border-bottom"]
      }`}
    >
      <span className={classes.itemListLabel}>{label}:</span>
      {!isDescription ? (
        <span className={`${classes.itemListValue} ${ttc && "t-t-c"}`}>
          {value}
        </span>
      ) : (
        <ShowMoreShowLessText text={value} visibility={300} />
      )}
    </div>
  );
};
