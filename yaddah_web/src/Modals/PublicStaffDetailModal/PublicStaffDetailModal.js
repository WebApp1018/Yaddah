import React, { useEffect, useState } from "react";
import classes from "./PublicStaffDetailModal.module.css";
import ModalSkeleton from "../ModalSkeleton";
import { BaseURL, apiHeader, imageUrl } from "../../config/apiUrl";
import ShowMoreShowLessText from "../../components/ShowMoreShowLess/ShowMoreShowLessText";
import moment from "moment";
import BookingScheduleCalendar from "../../components/BookingScheduleCalendar";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
import LottieLoader from "../../components/LottieLoader/LottieLoader";
import PaypalButton from "../../components/PaypalButton/PayPalButton";
import { Input } from "../../components/Input/Input";
import { IconButton } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { toast } from "react-toastify";
import { Get } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CloseIcon from "@mui/icons-material/Close";

const PublicStaffDetailModal = ({
  show,
  setShow,
  data,
  timeArray,
  slotTime,
  schedule,
  isGettingStaffSchedule,
  handleDateChangePress,
  setSelectedSlotsData,
  handleBookNowPress,
  isBookNowApiCalling,
  handleValidations,
  price,
}) => {
  let [isCurrentDateInSchedule, setIsCurrentInSchedule] = useState(false);
  const accessToken = useSelector((state) => state.authReducer.accessToken);

  const [amountToPay, setAmountToPay] = useState(price);
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [isCouponApiCalling, setIsCouponApiCalling] = useState(false);

  useEffect(() => {
    if (schedule && schedule?.length > 0) {
      // check if current date is in schedule
      const r = schedule.some((item) => {
        return (
          moment(item?.day).format("YYYY-MM-DD") ===
          moment().format("YYYY-MM-DD")
        );
      });

      setIsCurrentInSchedule(r);
    }
  }, [schedule]);

  useEffect(() => {
    if (price) {
      setAmountToPay(price);
    }
  }, [price]);

  // applyCouponHandler
  const applyCouponHandler = async () => {
    if (!couponCode) return toast.warn("Please enter coupon code first.");
    const url = BaseURL(`coupon/validate-coupon/${couponCode}`);

    setIsCouponApiCalling(true);
    const res = await Get(url, accessToken);
    setIsCouponApiCalling(false);

    if (res) {
      let resData = res?.data?.data;
      setCouponData({
        ...resData,
        discountAmount: parseFloat(
          (price / 100) * parseFloat(resData?.discount)
        ).toFixed(2),
        discountedAmount: parseFloat(
          price - (price / 100) * parseFloat(resData?.discount)
        ).toFixed(2),
      });
      setAmountToPay(price - (price / 100) * parseFloat(resData?.discount));
      toast.success("Coupon applied successfully.");
    }
  };

  console.log("amountToPay ", amountToPay);

  // removeCouponHandler
  const removeCouponHandler = () => {
    setCouponData(null);
    setCouponCode("");
    setAmountToPay(price);
    toast.success("Coupon removed successfully.");
  };

  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      width={"1200px"}
      borderRadius={"10px"}
      header={"Staff Detail"}
      showCloseIcon
    >
      {/* image */}
      <div className={classes.imgBox}>
        <img src={imageUrl(data?.image)} draggable={false} />
      </div>
      <ItemList label={"Person Name"} value={data?.staffName} />
      <ItemList label={"Email"} value={data?.email} />
      <ItemList label={"Contact Number"} value={data?.phoneNo} ttc={false} />
      <ItemList label={"Description"} value={data?.description} isDescription />

      {data?.disabledDates?.length > 0 && (
        <>
          <h4 className={classes?.contactInfoHeading}>
            Not available on the following dates:
          </h4>

          <div className={classes.disabledDates}>
            {data?.disabledDates?.map((date, index) => (
              <div key={index}>{moment(date).format("ll")}</div>
            ))}
          </div>
        </>
      )}

      <div className={classes?.sp_div}>
        <h4
          className={`${classes?.contactInfoHeading} mb-3`}
          style={{ lineHeight: 1 }}
        >
          Booking Schedule
        </h4>
        {/* change Date Buttons */}
        <div className={classes?.changeViewButtonsButtons}>
          {isCurrentDateInSchedule ? (
            <div>
              <AiOutlineArrowLeft color="gray" />
            </div>
          ) : (
            <div onClick={handleDateChangePress.bind(this, "prev")}>
              <AiOutlineArrowLeft />
            </div>
          )}
          <div onClick={handleDateChangePress.bind(this, "next")}>
            <AiOutlineArrowRight />
          </div>
        </div>
        <BookingScheduleCalendar
          DateArray={schedule}
          timesSlotArray={timeArray}
          slotTime={slotTime}
          setSelectedData={setSelectedSlotsData}
        />
        {/* Loader */}
        {isGettingStaffSchedule && (
          <LottieLoader className={classes?.schedulerLoaderContainer} />
        )}
      </div>

      <div className={classes?.paymentContainer}>
        <div className={classes?.discountContainer}>
          <Input
            placeholder={"Enter here 💰💰💰..."}
            state={couponCode}
            setter={setCouponCode}
            label={"Have a coupon code?"}
          />
          <IconButton
            className={classes?.discountIconButton}
            onClick={couponData ? removeCouponHandler : applyCouponHandler}
            disabled={isCouponApiCalling}
            title={couponData ? "Remove Coupon" : "Apply Coupon"}
          >
            {couponData ? (
              <CloseIcon />
            ) : isCouponApiCalling ? (
              <HourglassEmptyIcon />
            ) : (
              <DoneIcon />
            )}
          </IconButton>
        </div>
        <p>
          <b>Price: </b>
          {`$${parseFloat(price).toFixed(2)}`}
        </p>
        {couponData && (
          <>
            <p>
              <b>Discount: </b>
              {couponData?.discount}% ($
              {couponData?.discountAmount})
            </p>
            <p>
              <b>New Payable Amount: </b>${parseFloat(amountToPay).toFixed(2)}
            </p>
          </>
        )}
      </div>
      <PaypalButton
        onSubmit={handleBookNowPress}
        disabled={isGettingStaffSchedule || isBookNowApiCalling}
        isLoading={isBookNowApiCalling}
        handleValidations={handleValidations}
        price={amountToPay}
        extraData={
          couponData
            ? {
                couponCode,
                discount: couponData?.discount,
              }
            : {}
        }
      />
    </ModalSkeleton>
  );
};

export default PublicStaffDetailModal;

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
