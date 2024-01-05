import React, { useEffect, useState } from "react";
import styles from "./CmsHome.module.css";
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

function CmsHome() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state?.authReducer);
  const [isLoading, setIsLoading] = useState(false);

  const [CMSData, setCMSData] = useState({
    //Section---1
    home_section1_image: null,
    home_section1_title: "",
    home_section1_description: "",
    //Section --- 2
    home_section2_title: "",
    home_section2_image: null,
    home_section2_description: "",
    //Section --- 3
    home_section3_title: "",
    //Section --- 4
    home_section4_title: "",
    home_section4_image: null,
    home_section4_bgImage: null,
    //Section --- 5
    home_section5_title: "",
    home_section5_description: "",
    home_section5_bgImage: null,
    home_section5_counter1: "",
    home_section5_counter1_value1: "",
    home_section5_counter2: "",
    home_section5_counter2_value2: "",
    home_section5_counter3: "",
    home_section5_counter3_value3: "",
    home_section5_counter4: "",
    home_section5_counter4_value4: "",
    home_slider_images: [],
  });
  const [deletedImages, setDeletedImages] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  async function getData() {
    const url = BaseURL("cms/pages/all?pages=home");
    setIsLoading(true);
    const response = await Get(url, accessToken);
    if (response) {
      setCMSData((prev) => ({ ...prev, ...response?.data?.data?.pages }));
      setIsLoading(false);
    }
  }

  async function updateData() {
    const params = {
      ...CMSData,
      home_slider_images: CMSData?.home_slider_images?.filter(
        (item) => item != null
      ),
    };
    for (let key in params) {
      if (falsyArray.includes(params[key])) {
        return toast.error(`please fill all the fields`);
      }
    }
    if (params?.sliderImages?.length < 4) {
      return toast.error("Please upload at least 4 slider images");
    }

    params.delSliderImages = deletedImages;
    const formData = await CreateFormData(params);
    setIsUpdating(true);
    const response = await Patch(
      BaseURL("cms/page/update"),
      formData,
      apiHeader(accessToken, true)
    );

    if (response) {
      toast.success("Home page updated successfully");
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
              <h1>Home Page</h1>
            </div>
            <div className={styles.__content}>
              <Row className={styles.rowGap}>
                <Col md={12}>
                  <h5>Hero Section</h5>
                </Col>
                <Col lg={6}>
                  <QuillInput
                    value={CMSData?.home_section1_title}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section1_title: e,
                      }));
                    }}
                    label={"Heading"}
                    form
                  />
                </Col>
                <Col lg={6}>
                  <UploadImageBox
                    label="Image"
                    state={CMSData?.home_section1_image}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section1_image: e,
                      }));
                    }}
                    form
                    containerClass={styles.section1Image}
                  />
                </Col>
                <Col lg={6}>
                  <TextArea
                    label="Description"
                    value={CMSData?.home_section1_description}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section1_description: e,
                      }));
                    }}
                    form
                  />
                </Col>

                <Col md={12}>
                  <div className={styles.spBtwACenter}>
                    <h5>Slider Image Section</h5>
                    {CMSData?.home_slider_images?.length < 7 && (
                      <a
                        onClick={() => {
                          setCMSData((prev) => ({
                            ...prev,
                            home_slider_images: [
                              ...prev?.home_slider_images,
                              null,
                            ],
                          }));
                        }}>
                        +Add More
                      </a>
                    )}
                  </div>
                </Col>
                {CMSData?.home_slider_images?.map((item, key) => (
                  <Col lg={4}>
                    <UploadImageBox
                      state={item}
                      setter={(e) => {
                        const newImages = [...CMSData?.home_slider_images];
                        newImages?.splice(key, 1, e);
                        setCMSData((prev) => ({
                          ...prev,
                          home_slider_images: newImages,
                        }));
                      }}
                      onEdit={(e) => {
                        if (typeof item == "string") {
                          setDeletedImages((prev) => [...prev, item]);
                        }
                        const newImages = [...CMSData?.home_slider_images];
                        newImages?.splice(key, 1, e);
                        setCMSData((prev) => ({
                          ...prev,
                          home_slider_images: newImages,
                        }));
                      }}
                      hideDeleteIcon
                      onDelete={() => {
                        if (typeof item == "string") {
                          setDeletedImages((prev) => [...prev, item]);
                        }
                        const newImages = [...CMSData?.home_slider_images];
                        newImages?.splice(key, 1);
                        setCMSData((prev) => ({
                          ...prev,
                          home_slider_images: newImages,
                        }));
                      }}
                      form
                      containerClass={styles.section1Image}
                    />
                  </Col>
                ))}

                <Col md={12}>
                  <h5>About US Section</h5>
                </Col>
                <Col lg={12}>
                  <QuillInput
                    label="Title"
                    value={CMSData?.home_section2_title}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section2_title: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col lg={6}>
                  <UploadImageBox
                    label="Image"
                    state={CMSData?.home_section2_image}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section2_image: e,
                      }));
                    }}
                    form
                    containerClass={styles.section1Image}
                  />
                </Col>
                <Col md={6}>
                  <TextArea
                    label="Description"
                    value={CMSData?.home_section2_description}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section2_description: e,
                      }));
                    }}
                    form
                    className={styles.h215}
                  />
                </Col>

                <Col md={12}>
                  <h5>Category Section</h5>
                </Col>
                <Col lg={6}>
                  <QuillInput
                    label="Title"
                    value={CMSData?.home_section3_title}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section3_title: e,
                      }));
                    }}
                    form
                  />
                </Col>

                <Col md={12}>
                  <h5>Why Choose Us Section</h5>
                </Col>
                <Col md={6}>
                  <QuillInput
                    label="Title"
                    value={CMSData?.home_section4_title}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section4_title: e,
                      }));
                    }}
                    form
                    containerClass={styles.section1Image}
                  />
                </Col>
                <Col md={6}>
                  <UploadImageBox
                    label="Background Image"
                    state={CMSData?.home_section4_bgImage}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section4_bgImage: e,
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
                        home_section4_image: e,
                      }));
                    }}
                    state={CMSData?.home_section4_image}
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
                    value={CMSData?.home_section5_title}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section5_title: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <UploadImageBox
                    label="Background Image"
                    state={CMSData?.home_section5_bgImage}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section5_bgImage: e,
                      }));
                    }}
                    form
                    containerClass={styles.section1Image}
                  />
                </Col>
                <Col lg={6}>
                  <TextArea
                    label="Description"
                    value={CMSData?.home_section5_description}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section5_description: e,
                      }));
                    }}
                    form
                    className={styles.h215}
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Counter 1 Title"
                    value={CMSData?.home_section5_counter1}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section5_counter1: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Counter 1 Value"
                    value={CMSData?.home_section5_counter1_value1}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section5_counter1_value1: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Counter 2 Title"
                    value={CMSData?.home_section5_counter2}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section5_counter2: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Counter 2 Value"
                    value={CMSData?.home_section5_counter2_value2}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section5_counter2_value2: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Counter 3 Title"
                    value={CMSData?.home_section5_counter3}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section5_counter3: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Counter 3 Value"
                    value={CMSData?.home_section5_counter3_value3}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section5_counter3_value3: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Counter 4 Title"
                    value={CMSData?.home_section5_counter4}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section5_counter4: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={6}>
                  <Input
                    label="Counter 4 Value"
                    value={CMSData?.home_section5_counter4_value4}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        home_section5_counter4_value4: e,
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

export default CmsHome;
