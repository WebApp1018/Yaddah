import React, { useEffect, useState } from "react";
import styles from "./CmsAbout.module.css";
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import { Row, Col } from "react-bootstrap";
import { Button } from "../../Components/Button/Button";
import UploadImageBox from "../../Components/UploadImageBox";
import { Input } from "../../Components/Input/Input";
import QuillInput from "../../Components/QuillInput";
import { TextArea } from "../../Components/TextArea";
import {
  apiHeader,
  BaseURL,
  CreateFormData,
  falsyArray,
} from "../../config/apiUrl";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Loader } from "../../Components/Loader";
import { useNavigate } from "react-router-dom";

function CmsAbout() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state?.authReducer);
  const [isLoading, setIsLoading] = useState(false);

  const [CMSData, setCMSData] = useState({
    about_section1_heading: "",

    //Section-2
    about_section2_title: "",
    about_section2_description: "",
    about_section2_image: "",

    //Section-3
    about_section3_title: "",
    about_section3_bgImage: null,
    about_section3_image: null,

    //Section --- 4
    about_section4_title: "",
    about_section4_description: "",
    about_section4_bgImage: "",
    about_section4_counter1: "",
    about_section4_counter1_value1: "",
    about_section4_counter2: "",
    about_section4_counter2_value2: "",
    about_section4_counter3: "",
    about_section4_counter3_value3: "",
    about_section4_counter4: "",
    about_section4_counter4_value4: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // getData
  async function getData() {
    const url = BaseURL("cms/pages/all?pages=about_us");
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
    };
    if (params.hasOwnProperty('home_slider_images')) delete params.home_slider_images;

    for (let key in params) {
      if (falsyArray.includes(params[key])) {
        console.log("params[key] ", params[key]);
        return toast.error(`Please fill all the fields.`);
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
      toast.success("About US page updated successfully");
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
              <h1>About US Page</h1>
            </div>
            <div className={styles.__content}>
              <Row className={styles.rowGap}>
                <Col md={12}>
                  <h5>Hero Section</h5>
                </Col>
                <Col lg={6}>
                  <QuillInput
                    value={CMSData?.about_section1_heading}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section1_heading: e,
                      }));
                    }}
                    label={"Heading"}
                    form
                  />
                </Col>
                <Col md={12}>
                  <h5>About US Section</h5>
                </Col>
                <Col lg={12}>
                  <QuillInput
                    label="Title"
                    value={CMSData?.about_section2_title}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section2_title: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col lg={6}>
                  <UploadImageBox
                    label="Image"
                    state={CMSData?.about_section2_image}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section2_image: e,
                      }));
                    }}
                    form
                    containerClass={styles.section1Image}
                  />
                </Col>
                <Col md={6}>
                  <TextArea
                    label="Description"
                    value={CMSData?.about_section2_description}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section2_description: e,
                      }));
                    }}
                    form
                    className={styles.h215}
                  />
                </Col>

                <Col md={12}>
                  <h5>Why Choose Us Section</h5>
                </Col>
                <Col md={6}>
                  <QuillInput
                    label="Title"
                    value={CMSData?.about_section3_title}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section3_title: e,
                      }));
                    }}
                    form
                    containerClass={styles.section1Image}
                  />
                </Col>
                <Col md={6}>
                  <UploadImageBox
                    label="Background Image"
                    state={CMSData?.about_section3_bgImage}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section3_bgImage: e,
                      }));
                    }}
                    form
                    containerClass={styles.section1Image}
                  />
                </Col>
                <Col md={6}>
                  <UploadImageBox
                    label="Person Image"
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section3_image: e,
                      }));
                    }}
                    state={CMSData?.about_section3_image}
                    form
                    containerClass={styles.section1Image}
                  />
                </Col>
                <Col md={12}>
                  <h5>Trusted Section</h5>
                </Col>
                <Col md={12}>
                  <QuillInput
                    label={"Title"}
                    value={CMSData?.about_section4_title}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section4_title: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <UploadImageBox
                    label="Background Image"
                    state={CMSData?.about_section4_bgImage}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section4_bgImage: e,
                      }));
                    }}
                    form
                    containerClass={styles.section1Image}
                  />
                </Col>
                <Col lg={6}>
                  <TextArea
                    label="Description"
                    value={CMSData?.about_section4_description}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section4_description: e,
                      }));
                    }}
                    form
                    className={styles.h215}
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Counter 1 Title"
                    value={CMSData?.about_section4_counter1}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section4_counter1: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Counter 1 Value"
                    value={CMSData?.about_section4_counter1_value1}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section4_counter1_value1: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Counter 2 Title"
                    value={CMSData?.about_section4_counter2}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section4_counter2: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Counter 2 Value"
                    value={CMSData?.about_section4_counter2_value2}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section4_counter2_value2: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Counter 3 Title"
                    value={CMSData?.about_section4_counter3}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section4_counter3: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Counter 3 Value"
                    value={CMSData?.about_section4_counter3_value3}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section4_counter3_value3: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Counter 4 Title"
                    value={CMSData?.about_section4_counter4}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section4_counter4: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Counter 4 Value"
                    value={CMSData?.about_section4_counter4_value4}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        about_section4_counter4_value4: e,
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

export default CmsAbout;
