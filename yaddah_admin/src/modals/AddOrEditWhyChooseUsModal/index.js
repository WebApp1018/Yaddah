import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Button } from "../../Components/Button/Button";
import { Input } from "../../Components/Input/Input";
import { TextArea } from "../../Components/TextArea";
import UploadImageBox from "../../Components/UploadImageBox";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./AddOrEditWhyChooseUsModal.module.css";

function AddOrEditWhyChooseUsModal({ show, setShow, data, onClick }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(null);
  const [isLoading, setIsLoading] = useState("");

  async function handler() {
    let params = {
      title,
      description,
      image: icon,
    };
    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error(`Please fill the ${key} field`);
      }
    }

    setIsLoading(true);
    await onClick(params);
    setIsLoading(false);
  }

  useEffect(() => {
    if (data) {
      setTitle(data?.title);
      setDescription(data?.description);
      setIcon(data?.image);
    }
  }, [data]);

  return (
    <>
      <style>{`
      .modal-content{
        overflow-visible;
      }
      `}</style>
      <ModalSkeleton
        setShow={setShow}
        show={show}
        width={"600px"}
        header={`${data ? "Edit" : "Add"} Why Choose Us`}
        borderRadius={"20px"}
        showCloseIcon>
        <Row className={classes.row}>
          <Col md={12}>
            <UploadImageBox setter={setIcon} state={icon} label={"Icon"} form />
          </Col>
          <Col md={12}>
            <Input
              setter={setTitle}
              value={title}
              placeholder={"Enter title here"}
              label={"Title"}
              form
            />
          </Col>
          <Col md={12}>
            <TextArea
              setter={setDescription}
              value={description}
              placeholder={"Enter description here"}
              label={"Description"}
              form
            />
          </Col>

          <Col md={12} className={classes.jCenter}>
            <Button
              variant="secondary"
              className={classes.loginBtn}
              onClick={handler}
              disabled={isLoading}>
              {isLoading ? "Wait..." : data ? "Edit" : "Add"}
            </Button>
          </Col>
        </Row>
      </ModalSkeleton>
    </>
  );
}

export default AddOrEditWhyChooseUsModal;
