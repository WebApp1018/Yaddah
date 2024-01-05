import React, { useRef } from "react";
import { BsCamera } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import classes from "./UploadImageBox.module.css";
import { toast } from "react-toastify";
import { uploadImageValidtor } from "../../config/apiUrl";

function UploadImageBox({
  state,
  setter,
  label,
  edit = true,
  onClose,
  isCloseable,
  imgClass,
  containerClass = "",
  onEdit,
  errorImage,
}) {
  const inputRef = useRef(null);

  return (
    <>
      {label && <label className={classes.label}>{label}</label>}

      <div className={`${classes.box} ${containerClass}`}>
        <div className={classes.uploadImageBox}>
          {/* Close Icon */}
          {isCloseable && (
            <span className={classes.closeIcon} onClick={onClose}>
              {/* <MdClose /> */}
            </span>
          )}
          {typeof state == "object" ? (
            <div className={classes.imageUploaded}>
              <img
                src={URL.createObjectURL(state)}
                className={imgClass ? imgClass : ""}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = errorImage;
                }}
              />
              <div className={classes.editAndDelete}>
                {edit && (
                  <>
                    <div
                      className={classes.icon}
                      onClick={() => {
                        inputRef.current.click();
                        onEdit && onEdit();
                      }}
                    >
                      <BsCamera />
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className={classes.uploadBox}>
              {state === "" ? (
                <FaUserAlt size={80} color={"var(--placeholder-color)"} />
              ) : (
                <img
                  src={state}
                  className={classes.icon}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = errorImage;
                  }}
                />
              )}
              {edit && (
                <div
                  className={classes.uploadIcon}
                  onClick={() => inputRef.current.click()}
                >
                  <BsCamera size={16} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input For Image Upload */}
        <input
          hidden
          type={"file"}
          ref={inputRef}
          onChange={(e) => {
            if (uploadImageValidtor(e?.target?.files[0])) {
              setter(e?.target?.files[0]);
            } else {
              toast.error(
                "Invalid File Type, Only JPEG, JPG, WEBP and PNG formats are allowed"
              );
            }
          }}
        />
      </div>
    </>
  );
}

export default UploadImageBox;
