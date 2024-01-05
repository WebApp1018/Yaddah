import React from "react";
import Carousel from "react-elastic-carousel";
import classes from "./PublicVenueDetailModal.module.css";
import ModalSkeleton from "../ModalSkeleton";
import { imageUrl } from "../../config/apiUrl";
import ShowMoreShowLessText from "../../components/ShowMoreShowLess/ShowMoreShowLessText";
import moment from "moment";

const PublicVenueDetailModal = ({ show, setShow, data }) => {
  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      width={"850px"}
      borderRadius={"10px"}
      header={"Venue Detail"}
      showCloseIcon
    >
      {/* images */}
      <Carousel pagination={false} className="customCarousel">
        {data?.images?.map((img, index) => (
          <div key={index} className={classes.imgBox}>
            <img src={imageUrl(img)} draggable={false} />
          </div>
        ))}
      </Carousel>

      <ItemList label={"Venue Name"} value={data?.name} />
      <ItemList label={"Address"} value={data?.address} />
      <ItemList label={"Description"} value={data?.description} isDescription />

      <h4 className={classes?.contactInfoHeading}>Contact Information</h4>
      <ItemList label={"Contact Person"} value={data?.contactName} />
      <ItemList
        label={"Contact Email"}
        value={data?.contactEmail}
        ttc={false}
      />
      <ItemList
        label={"Contact Number"}
        value={data?.contactNumber}
        ttc={false}
      />

      {!!data?.disabledDates?.length && (
        <h4 className={classes?.contactInfoHeading}>
          Not available on the following dates:
        </h4>
      )}

      <div className={classes.disabledDates}>
        {data?.disabledDates?.map((date, index) => (
          <div key={index}>{moment(date).format("ll")}</div>
        ))}
      </div>
    </ModalSkeleton>
  );
};

export default PublicVenueDetailModal;

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
