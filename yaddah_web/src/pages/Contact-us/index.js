import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import PageHeader from "../../components/PageHeader/PageHeader";
import styles from "./ContactUs.module.css";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoIosMail } from "react-icons/io";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Input } from "../../components/Input/Input";
import { TextArea } from "../../components/TextArea";
import CustomPhoneInput from "../../components/CustomPhoneInput/index";
import { Button } from "../../components/Button/Button";
import { toast } from "react-toastify";
import {
  apiHeader,
  BaseURL,
  capitalizeFirstLetter,
  formRegEx,
  formRegExReplacer,
} from "../../config/apiUrl";
import { Post } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import ReactHtmlParser from "react-html-parser";
import validator from "validator";

const ContactUs = () => {
  const contactCMS = useSelector(
    (state) => state?.commonReducer?.cms?.contactUs
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const SendMessage = async (e) => {
    e.preventDefault();
    const url = BaseURL("contact-us");
    const params = {
      name,
      email,
      phoneNo: phone,
      website,
      message,
    };
    for (const key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error(
          `${capitalizeFirstLetter(
            key?.replace(formRegEx, formRegExReplacer)
          )} can not be empty!`
        );
      }
    }

    if (!validator.isEmail(email)) {
      return toast.error("Please enter a valid email address!");
    }
    // validate phone number
    if (!validator.isMobilePhone(phone)) {
      return toast.error("Please enter a valid phone number!");
    }

    // validate website url
    if (!validator.isURL(website)) {
      return toast.error("Please enter a valid website url!");
    }

    setIsLoading(true);
    const response = await Post(url, params, apiHeader());
    if (response !== undefined) {
      setName("");
      setEmail("");
      setMessage("");
      setPhone("");
      setWebsite("");
      toast.success("Successfully submitted");
    }
    setIsLoading(false);
  };

  return (
    <>
      <PageHeader
        item={ReactHtmlParser(contactCMS?.contact_section_heading)}
        fromCms
      />

      <section className={styles.contactUs__section}>
        <Container>
          <div className={styles.contact__container}>
            <Row className={styles.contactRow}>
              <Col lg={4} md={6}>
                <div className={styles.contact__card}>
                  <BsFillTelephoneFill />
                  <p>Phone Number</p>
                  <p>{contactCMS?.contact_section_phone1}</p>
                  <p>{contactCMS?.contact_section_phone2}</p>
                </div>
              </Col>
              <Col lg={4} md={6}>
                <div className={styles.contact__card}>
                  <IoIosMail />
                  <p>Email Address</p>
                  <p>{contactCMS?.contact_section_email1}</p>
                  <p>{contactCMS?.contact_section_email2}</p>
                </div>
              </Col>
              <Col lg={4} md={6}>
                <div className={styles.contact__card}>
                  <FaMapMarkerAlt />
                  <p>Office Address</p>
                  <p>{contactCMS?.contact_section_address}</p>
                </div>
              </Col>
            </Row>
          </div>
          <div className={styles.contact__form}>
            <Form>
              <Row>
                <Col md={6} className={styles.inputCol}>
                  <Input
                    type={"text"}
                    state={name}
                    setter={setName}
                    placeholder="Name*"
                  />
                </Col>
                <Col md={6} className={styles.inputCol}>
                  <Input
                    type={"email"}
                    state={email}
                    setter={setEmail}
                    placeholder="Email*"
                  />
                </Col>
                <Col md={6} className={styles.inputCol}>
                  <CustomPhoneInput
                    value={phone}
                    setter={setPhone}
                    customClass={styles.phone}
                  />
                </Col>
                <Col md={6} className={styles.inputCol}>
                  <Input
                    type={"text"}
                    state={website}
                    setter={setWebsite}
                    placeholder="Website*"
                  />
                </Col>
                <Col md={12} className={styles.inputCol}>
                  <TextArea
                    value={message}
                    setter={setMessage}
                    placeholder="Message*"
                  />
                </Col>
              </Row>
              <div className={styles.sendMsgBtn}>
                <Button
                  onClick={SendMessage}
                  label={isLoading ? "Sending..." : "Send a Message"}
                  width={185}
                  customStyle={{
                    width: "185px",
                    backgroundColor: "var(--clr-primary)",
                  }}
                  disabled={isLoading}
                />
              </div>
            </Form>
          </div>
        </Container>
      </section>
    </>
  );
};

export default ContactUs;
