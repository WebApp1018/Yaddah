import React from "react";
import { useLoadScript } from "@react-google-maps/api";
import classes from "./MapAndPlaces.module.css";
import Places from "../PlacesInput";
import MapView from "../MapView";
import { useSelector } from "react-redux";

// const defaultLocation = { lat: 32.715736, lng: -117.161087 };

// type = 'map' || 'places'
const Maps = ({
  type = "map",
  className,
  mapClass,
  placeClass,
  setCoordinates,
  setAddress,
  address,
  setPlaceDetail,
  location = { lat: 32.715736, lng: -117.161087 },
  placeholder,
  label,
  leftIcon,
  data,
  loader,
}) => {
  const googleMapApiKey = useSelector(
    (state) => state?.settingSlice?.googleMapsApiKey
  );
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapApiKey,
    libraries: ["places", "visualization"],
  });
  if (!isLoaded) {
    return loader ? (
      loader
    ) : (
      <div className={classes?.loadingContainer}>Loading</div>
    );
  }

  if (loadError) {
    return (
      <div className={classes?.ErrorContainer}>
        <span>Map cannot be loaded right now, sorry. </span>
      </div>
    );
  }

  return (
    <div className={`${classes.Container} ${className ? className : ""}`}>
      {type === "map" ? (
        <MapView data={data} location={location} className={mapClass} />
      ) : (
        <Places
          setCoordinates={setCoordinates}
          setAddress={setAddress}
          address={address}
          className={placeClass}
          placeholder={placeholder}
          setPlaceDetail={setPlaceDetail}
          label={label}
          leftIcon={leftIcon}
        />
      )}
    </div>
  );
};

export default Maps;
