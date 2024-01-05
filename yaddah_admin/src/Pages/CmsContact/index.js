import React, { useEffect, useState } from "react";
import styles from "./CmsContact.module.css";
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import { Row, Col } from "react-bootstrap";
import { Button } from "../../Components/Button/Button";
import { Input } from "../../Components/Input/Input";
import QuillInput from "../../Components/QuillInput";
import { TextArea } from "../../Components/TextArea";
import {
  apiHeader,
  BaseURL,
  capitalizeFirstLetter,
  CreateFormData,
  falsyArray,
  formRegEx,
  formRegExReplacer,
} from "../../config/apiUrl";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Loader } from "../../Components/Loader";
import validator from "validator";
import CustomPhoneInput from "../../Components/CustomPhoneInput";
import { useNavigate } from "react-router-dom";

function CmsContact() {
  const navigate = useNavigate();

  const { accessToken } = useSelector((state) => state?.authReducer);
  const [isLoading, setIsLoading] = useState(false);

  const [CMSData, setCMSData] = useState({
    contact_section_heading: "",
    contact_section_phone1: "",
    contact_section_phone2: "",
    contact_section_email1: "",
    contact_section_email2: "",
    contact_section_address: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);

  async function getData() {
    const url = BaseURL("cms/pages/all?pages=contact_us");
    setIsLoading(true);
    const response = await Get(url, accessToken);
    if (response) {
      setCMSData(response?.data?.data?.pages);
      setIsLoading(false);
    }
  }

  async function updateData() {
    const params = {
      ...CMSData,
      contact_section_heading: CMSData?.contact_section_heading,
      contact_section_phone1: CMSData?.contact_section_phone1?.includes("+")
        ? CMSData?.contact_section_phone1
        : `+${CMSData?.contact_section_phone1}`,
      contact_section_phone2: CMSData?.contact_section_phone2?.includes("+")
        ? CMSData?.contact_section_phone2
        : `+${CMSData?.contact_section_phone2}`,
      contact_section_email1: CMSData?.contact_section_email1,
      contact_section_email2: CMSData?.contact_section_email2,
      contact_section_address: CMSData?.contact_section_address,
    };

    if (params.hasOwnProperty('home_slider_images')) delete params.home_slider_images;
    for (let key in params) {
      if (falsyArray.includes(params[key])) {
        return toast.error(`please fill all the fields`);
      }
    }
    const phones = {
      phoneNumber1: CMSData.contact_section_phone1,
      phoneNumber2: CMSData.contact_section_phone2,
    };
    for (let key in phones) {
      if (!validator.isMobilePhone(phones[key])) {
        return toast.error(
          `${capitalizeFirstLetter(
            key?.replace(formRegEx, formRegExReplacer)
          )} is not a valid phone number`
        );
      }
    }

    const emails = {
      emailAddress1: CMSData.contact_section_email1,
      emailAddress2: CMSData.contact_section_email2,
    };
    for (let key in emails) {
      if (!validator.isEmail(emails[key])) {
        return toast.error(
          `${capitalizeFirstLetter(
            key?.replace(formRegEx, formRegExReplacer)
          )} is not a valid email`
        );
      }
    }
    const formData = await CreateFormData(params);
    setIsUpdating(true);
    const response = await Patch(
      BaseURL("cms/page/update"),
      formData,
      apiHeader(accessToken, true)
    );

    if (response) {
      toast.success("Contact US page updated successfully");
      setCMSData(response?.data?.data);
      navigate(-1);
    }
    setIsUpdating(false);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        {isLoading ? (
          <Loader className={styles.loader} />
        ) : (
          <>
            <div className={styles.__header}>
              <h1>Contact US Page</h1>
            </div>
            <div className={styles.__content}>
              <Row className={styles.rowGap}>
                <Col md={12}>
                  <h5>Hero Section</h5>
                </Col>
                <Col lg={6}>
                  <QuillInput
                    value={CMSData?.contact_section_heading}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        contact_section_heading: e,
                      }));
                    }}
                    label={"Heading"}
                    form
                  />
                </Col>
                <Col md={12}>
                  <h5>Info Section</h5>
                </Col>
                <Col md={6}>
                  <CustomPhoneInput
                    label="Phone Number 1"
                    value={CMSData?.contact_section_phone1}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        contact_section_phone1: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <CustomPhoneInput
                    label="Phone Number 2"
                    value={CMSData?.contact_section_phone2}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        contact_section_phone2: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Email Address 1"
                    value={CMSData?.contact_section_email1}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        contact_section_email1: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Email Address 2"
                    value={CMSData?.contact_section_email2}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        contact_section_email2: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={12}>
                  <TextArea
                    label="Office Address"
                    value={CMSData?.contact_section_address}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        contact_section_address: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col lg={6}>
                  <Button
                    label={isUpdating ? "Updating..." : "Update"}
                    disabled={isUpdating}
                    customStyle={{
                      backgroundColor: "var(--clr-secondary)",
                      border: "none",
                      color: "var(--clr-font-inverted)",
                      width: "100%",
                    }}
                    onClick={updateData}
                  />
                </Col>
              </Row>
            </div>
          </>
        )}
      </div>
    </SidebarSkeleton>
  );
}

export default CmsContact;
