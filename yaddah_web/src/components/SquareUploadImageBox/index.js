import React, { useRef } from "react";
import { MdUpload, MdModeEdit, MdClose } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { imageUrl, uploadImageValidtor } from "../../config/apiUrl";
import GalleryImage from "../../assets/images/gallery-Image.png";
import classes from "./SquareUploadImageBox.module.css";
import { toast } from "react-toastify";

function SquareUploadImageBox({
  state,
  setter,
  label,
  edit = true,
  onDelete,
  onClose,
  isCloseable,
  hideDeleteIcon = false,
  imgClass,
  containerClass = "",
  onEdit,
  fallBackIcon,
  labelClassName,
  imageContain = false,
}) {
  const inputRef = useRef(null);
  return (
    <>
      {label && (
        <label
          className={[classes.label, labelClassName && labelClassName].join(
            " "
          )}
        >
          {label}
        </label>
      )}

      <div className={`${classes.box} ${containerClass}`}>
        <div className={classes.uploadImageBox}>
          {/* Close Icon */}
          {isCloseable && (
            <span className={classes.closeIcon} onClick={onClose}>
              <MdClose />
            </span>
          )}
          {state?.name || typeof state == "string" ? (
            <div className={classes.imageUploaded}>
              <img
                src={
                  typeof state == "object"
                    ? URL.createObjectURL(state)
                    : imageUrl(state)
                }
                className={[
                  imgClass ? imgClass : "",
                  imageContain && classes.fitContain,
                ].join(" ")}
              />
              <div className={classes.editAndDelete}>
                {edit && (
                  <>
                    {hideDeleteIcon && (
                      <div className={classes.icon} onClick={onDelete}>
                        <RiDeleteBinLine />
                      </div>
                    )}
                    <div
                      className={classes.icon}
                      onClick={() => {
                        inputRef.current.click();
                        onEdit();
                      }}
                    >
                      <MdModeEdit />
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className={classes.uploadBox}>
              {fallBackIcon ? (
                fallBackIcon
              ) : (
                <img src={GalleryImage} className={classes.icon} />
              )}
              <div
                className={classes.uploadIcon}
                onClick={() => inputRef.current.click()}
              >
                <MdUpload />
              </div>
            </div>
          )}
        </div>
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
          onClick={(event) => (event.currentTarget.value = null)}
        />
      </div>
    </>
  );
}

export default SquareUploadImageBox;
