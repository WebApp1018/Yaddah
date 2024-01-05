import React, { useRef } from "react";
import classes from "./profilewitheditbutton.module.css";
import { EmptyProfile, userAvatar } from '../../constant/imagePath';
import { imageUrl, BaseURL } from "../../config/apiUrl";
import { toast } from "react-toastify";
import { HiPencil } from "react-icons/hi";

export const ProfileWithEditButton = ({
  photo,
  updateImage,
  setUpdateImage,
  customClass,
  edit = true
}) => {
  const inputRef = useRef(null);
  return (
    <>
      <div className={[`${classes.profileEditContainer} ${customClass}`]}>
        {typeof updateImage === "object" ? (
          <div className={`${classes.profileEditImage_box}`}>
            <img
              className={`${classes.profileEditImage}`}
              src={URL.createObjectURL(updateImage)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = EmptyProfile;
              }}
            />
          </div>
        ) : updateImage !== "" ? (
          <div className={`${classes.profileEditImage_box}`}>
            <img
              className={`${classes.profileEditImage}`}
              src={
                updateImage == "" || updateImage == undefined
                  ? EmptyProfile
                  : imageUrl(updateImage)
              }
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = EmptyProfile;
              }}
            />
          </div>
        ) : (
          <div className={`${classes.profileEditImage_box}`}>
            <img
              className={`${classes.profileEditImage}`}
              src={userAvatar}
              alt="profileEditImage"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = userAvatar;
              }}
            />
          </div>
        )}
        {edit && <div className={`${classes.profileEditPen_box}`}>
          <HiPencil
            className={`${classes.profileEditPen}`}
            onClick={() => {
              inputRef.current.click();
            }}
          />
          <input
            ref={inputRef}
            type="file"
            size="2000000"
            className={`${classes.file_upload_form3rd}`}
            onChange={(e) => {
              if (e.target.files?.length > 0) {
                if (
                  !["image/jpeg", "image/png", "image/jpg"].includes(
                    e.target.files[0].type
                  )
                ) {
                  return toast.error(
                    "Please upload a valid image. [jpg and png formats only]"
                  );
                }
                // max size 2MB
                if (e.target.files[0]?.size / 1024 / 1024 > 2)
                  return toast.error(
                    "Please upload a valid image. [Max size: 2MB]"
                  );

                setUpdateImage(e.target.files[0]);
              }
            }}
          />
        </div>}
      </div>
    </>
  );
};
