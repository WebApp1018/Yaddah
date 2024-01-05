import React, { useEffect, useState } from "react";
import styles from "./CmsFooter.module.css";
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import { Row, Col } from "react-bootstrap";
import { Button } from "../../Components/Button/Button";
import { Input } from "../../Components/Input/Input";
import { TextArea } from "../../Components/TextArea";
import { apiHeader, BaseURL, falsyArray } from "../../config/apiUrl";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Loader } from "../../Components/Loader";
import validator from "validator";
import CustomPhoneInput from "../../Components/CustomPhoneInput";
import { useNavigate } from "react-router-dom";

function CmsFooter() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state?.authReducer);
  const [isLoading, setIsLoading] = useState(false);

  const [CMSData, setCMSData] = useState({
    description: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  async function getData() {
    const url = BaseURL("cms/pages/all?pages=footer");
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
      phone: CMSData?.phone?.includes("+")
        ? CMSData?.phone
        : `+${CMSData?.phone}`,
    };

    if (params.hasOwnProperty("home_slider_images"))
      delete params.home_slider_images;
    for (let key in params) {
      if (falsyArray.includes(params[key])) {
        return toast.error(`Please fill all the fields`);
      }
    }
    if (!validator.isMobilePhone(params["phone"])) {
      return toast.error(`Phone Number is not valid`);
    }
    if (!validator.isEmail(params["email"])) {
      return toast.error(`Email is not valid`);
    }
    setIsUpdating(true);
    const response = await Patch(
      BaseURL("cms/page/update"),
      params,
      apiHeader(accessToken, true)
    );

    if (response) {
      toast.success("Footer updated successfully");
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
              <h1>Footer</h1>
            </div>
            <div className={styles.__content}>
              <Row className={styles.rowGap}>
                <Col lg={6}>
                  <TextArea
                    value={CMSData?.description}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        description: e,
                      }));
                    }}
                    label={"Description"}
                    form
                  />
                </Col>
                <Col md={12}>
                  <h5>Contact Us Section</h5>
                </Col>
                <Col md={6}>
                  <CustomPhoneInput
                    label="Phone Number"
                    value={CMSData?.phone}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        phone: e,
                      }));
                    }}
                    form
                  />
                </Col>

                <Col md={6}>
                  <Input
                    label="Email Address"
                    value={CMSData?.email}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        email: e,
                      }));
                    }}
                    form
                  />
                </Col>
                <Col md={12}>
                  <Input
                    label="Address"
                    value={CMSData?.address}
                    setter={(e) => {
                      setCMSData((prev) => ({
                        ...prev,
                        address: e,
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

export default CmsFooter;
