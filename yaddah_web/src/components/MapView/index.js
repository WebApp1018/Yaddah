import { useMemo } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import classes from "./MapView.module.css";

export default function MapView({ location, className }) {
  return (
    <div className={`${classes?.container} ${className && className}`}>
      <GoogleMap
        zoom={16}
        center={location}
        mapContainerClassName={classes["map-container"]}

      >
        {location && (
          <>
            <Marker position={location} />
          </>
        )}
      </GoogleMap>
    </div>
  );
}
