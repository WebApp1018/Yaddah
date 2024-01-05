import React from "react";
import styles from "./About.module.css";
import { Container, Row, Col } from "react-bootstrap";
import ReactHtmlParser from "react-html-parser";
import { imageUrl } from "../../../config/apiUrl";
import { useNavigate } from "react-router-dom";

const About__us = ({ data }) => {
  const navigate = useNavigate();
  return (
    <section className={styles.about__section}>
      <Container>
        <Row>
          <Col lg={6} className={`mb-lg-0 ${styles.main}`}>
            <div className={styles.about__content}>
              <h2>
                {ReactHtmlParser(data?.title)}
              </h2>
              <p>{data?.description}</p>
              <a
                className="btn__solid bg__primary c-p"
                onClick={() => {
                  navigate("/faq");
                }}>
                Learn More
              </a>
            </div>
          </Col>
          <Col lg={6}>
            <div className={styles.about__image}>
              <img src={imageUrl(data?.image)} alt="" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About__us;
