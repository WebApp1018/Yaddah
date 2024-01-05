import React from "react";
import { Button } from "../../components/Button/Button";
import { FiAlertTriangle } from "react-icons/fi";
import classes from "./AreYouSureModal.module.css";
import { Modal } from "react-bootstrap";

const AreYouSureModal = ({ show, setShow, subTitle, onClick, isApiCall }) => {
  return (
    <>
      <style jsx>{`
        .modal-content {
          width: 100%;
          border-radius: 20px;
          overflow: hidden;
        }
        .modal-body {
          padding: 24px;
        }
        .modal-header {
          flex-direction: column;
         background: var(--clr-primary);;
          border-bottom: none;
          padding: 0.75rem;
        }
        .name {
          font-size: 18px;
          color: var(--text-color-black);
        }
      `}</style>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header>
          <div className={[classes.iconDiv].join(" ")}>
            <FiAlertTriangle size={"60px"} color={"var(--white-color)"} />
          </div>
          <h4 className={[classes.headingText].join(" ")}>Are You Sure</h4>
        </Modal.Header>
        <Modal.Body>
          <div className={classes.content}>
            <div className={classes.mainDiv}>
              <p className={[classes.message].join(" ")}>{subTitle}</p>
            </div>
            <div className={classes.btnsBox}>
              <Button
                className={classes.yesBtn}
                variant={"secondary"}
                onClick={onClick}
                disabled={isApiCall}>
                {isApiCall ? "Wait..." : "Yes"}
              </Button>
              <Button
                variant={"primary"}
                className={classes.noBtn}
                onClick={async () => {
                  setShow(false);
                }}
                disabled={isApiCall}>
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AreYouSureModal;
