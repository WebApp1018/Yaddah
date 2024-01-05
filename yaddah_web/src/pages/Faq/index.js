import React, { useState } from "react";
import { Container, Row, Col, Accordion, Form } from "react-bootstrap";
import styles from "./Faq.module.css";
import PageHeader from "../../components/PageHeader/PageHeader";
import { Input } from "../../components/Input/Input";
import { TextArea } from "../../components/TextArea";
import { Button } from "../../components/Button/Button";
import { toast } from "react-toastify";
import { Post } from "../../Axios/AxiosFunctions";
import { apiHeader, BaseURL } from "../../config/apiUrl";
import { faqData } from "../../config/Data";
import { useSelector } from "react-redux";
import validator from "validator";
import CustomPhoneInput from "../../components/CustomPhoneInput";
const Faq = () => {
  const faqCMS = useSelector((state) => state?.commonReducer?.cms?.faq);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [faqs, setFaqs] = useState(faqData);

  const SubmitNow = async (e) => {
    e.preventDefault();
    const url = BaseURL("contact-us");
    const params = {
      name,
      email,
      phoneNo: phone,
      website,
      message: question,
    };
    for (const key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error("Please fill all the fields!");
      }
    }
    if (!validator.isMobilePhone(params.phoneNo))
      return toast.error(`Please enter a valid phone no`);
    setIsLoading(true);
    const response = await Post(url, params, apiHeader());
    setIsLoading(false);
    if (response !== undefined) {
      setName("");
      setEmail("");
      setWebsite("");
      setPhone("");
      setQuestion("");
      toast.success("Your query has been submitted successfully");
    }
  };

  return (
    <>
      <style>
        {`
      button.accordion-button[aria-expanded='true'] {
border-bottom: 2px solid #00000052!important;
}
      `}
      </style>
      <PageHeader item={{ bold: `FAQ's` }} />
      <section className={styles.faq__section}>
        <Container>
          <Row>
            <Col md={6} className={styles.sectionCol}>
              <div className={styles.faq__accordian}>
                <p className={styles.accordian__header}>FAQ's</p>
                <Accordion
                  defaultActiveKey="0"
                  flush
                  className={styles.accordian}
                >
                  {faqCMS?.faqs?.map((item, index) => (
                    <Accordion.Item
                      className={styles.accordian__item}
                      eventKey={index}
                    >
                      <Accordion.Header>{item?.question}</Accordion.Header>
                      <Accordion.Body>{item?.answer}</Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </div>
            </Col>
            <Col md={6} className={styles.sectionCol}>
              <div className={styles.faq__query}>
                <p className={styles.accordian__header}>Ask Your Question</p>
                <Form>
                  <Input
                    className={styles.input}
                    state={name}
                    type={"text"}
                    setter={setName}
                    placeholder="Name*"
                  />
                  <Input
                    className={styles.input}
                    state={email}
                    setter={setEmail}
                    type={"email"}
                    placeholder="Mail*"
                  />
                  <CustomPhoneInput
                    value={phone}
                    setter={setPhone}
                    customClass={styles.phoneInput}
                  />
                  <Input
                    className={styles.input}
                    state={website}
                    setter={setWebsite}
                    type={"text"}
                    placeholder="Website*"
                  />
                  <TextArea
                    className={styles.input}
                    value={question}
                    setter={setQuestion}
                    placeholder="Your Questions*"
                  />

                  <Button
                    onClick={SubmitNow}
                    label={isLoading ? "Submitting..." : "Submit Now"}
                    customStyle={{
                      width: "185px",
                      backgroundColor: "var(--clr-font-inverted)",
                    }}
                    disabled={isLoading}
                  />
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Faq;
