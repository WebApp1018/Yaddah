import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Button } from "../../Components/Button/Button";
import { DropDown } from "../../Components/DropDown/DropDown";
import { Input } from "../../Components/Input/Input";
import { socailPlatformOptions } from "../../constant/staticData";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./AddOrEditSocialLinkModal.module.css";

function AddOrEditSocialLinkModal({
  show,
  setShow,
  data,
  onClick,
  removeAddedFilter,
}) {
  const newSocailPlatformOptions = socailPlatformOptions?.filter((item) => {
    const exist = socailPlatformOptions?.find((e) =>
      removeAddedFilter?.includes(item?.value)
    );
    if (!exist) {
      return item;
    }
  });

  const [link, setLink] = useState("");
  const [platformType, setPlatformType] = useState(
    newSocailPlatformOptions[0] || []
  );
  const [isLoading, setIsLoading] = useState("");

  async function handler() {
    let params = {
      link,
      platformType: platformType?.value,
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
      setLink(data?.link);
      setPlatformType(
        socailPlatformOptions.find((item) => item?.value == data?.platformType)
      );
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
        header={`${data ? "Edit" : "Add"} Social Link`}
        borderRadius={"20px"}
        showCloseIcon>
        <Row className={classes.row}>
          <Col md={12}>
            <DropDown
              setter={setPlatformType}
              value={platformType}
              placeholder={"Enter platform type here"}
              label={"Platform Type"}
              options={newSocailPlatformOptions}
              form
            />
          </Col>
          <Col md={12}>
            <Input
              setter={setLink}
              value={link}
              placeholder={"Enter platform link here"}
              label={"Platform Link"}
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

export default AddOrEditSocialLinkModal;
