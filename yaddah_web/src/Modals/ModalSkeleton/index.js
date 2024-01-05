import React from "react";
import { Modal } from "react-bootstrap";
import classes from "./modalSkeleton.module.css";
import { AiOutlineClose } from "react-icons/ai";

export default function ModalSkeleton({
  show,
  setShow,
  header,
  footer,
  children,
  modalClass,
  hideHeaderBorder,
  headerStyles,
  footerStyles,
  borderRadius,
  showCloseIcon,
  width,
  borderLine = true,
  headerClass,
}) {
  function handleClose() {
    setShow(false);
  }
  return (
    <>
      <style jsx>{`
        .modal-header .btn-close {
          display: none;
        }
        .modal-header {
          border-bottom: ${!borderLine && "none !important"};
          padding-bottom: ${!borderLine && "0 !important"};
        }
        .modal-header {
          border-bottom: ${hideHeaderBorder
            ? "none"
            : `1px solid var(--footer-color-dark)`};
          background-color: var(--footer-color-dark);
        }
        .modal-footer {
          margin: 0px;
          display: unset;
          justify-content: unset;
          align-items: unset;
          padding: ${!borderLine ? "15px 30px" : "0px"};
        }

        .${classes.header} button {
          color: var(--black-color) !important;
        }
        .modal-content {
          width: 94%;
          border-radius: ${borderRadius ? borderRadius : "0px"};
          margin: 0 auto;
        }
        .modal .modal-dialog {
          max-width: ${width};
          margin: 0px auto;
        }
      `}</style>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        className={`${[classes.modal].join(" ")}`}>
        {header && (
          <Modal.Header
            closeButton
            className={`${[classes.header, headerClass && headerClass].join(
              " "
            )}`}
            style={{ ...headerStyles }}>
            <p>{header}</p>
          </Modal.Header>
        )}
        {showCloseIcon && (
          <div className={classes.iconBox} onClick={handleClose}>
            <AiOutlineClose size={20} color={"var(--white-color)"} />
          </div>
        )}
        <Modal.Body
          className={`${[classes.body, modalClass && modalClass].join(" ")}`}>
          {children}
        </Modal.Body>
        {footer && (
          <Modal.Footer
            className={`${[classes.footer].join(" ")}`}
            style={{
              ...footerStyles,
            }}>
            <div>{footer}</div>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}
