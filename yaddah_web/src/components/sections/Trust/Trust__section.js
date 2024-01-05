import React from "react";
import styles from "./Trust__section.module.css";
import { Container, Row, Col } from "react-bootstrap";
import StatBox from "../../StatBox/StatBox";
import { imageUrl } from "../../../config/apiUrl";
import ReactHtmlParser from "react-html-parser";

const TrustSection = ({ data }) => {

  const statBoxData = [
    {
      lead: "25",
      desc: "jobs",
    },
    {
      lead: "36",
      desc: "provider",
    },
    {
      lead: "500+",
      desc: "happy customers",
    },
    {
      lead: "89",
      desc: "jobs",
    },
  ];
  return (
    <>
      <style>
        {
          `
       .${styles.trust__section__wrapper}:before {
        background-image: url(${imageUrl(data?.bgImage)});
      }
       `}
      </style>
      <section className={styles.trust__section}>
        <Container>
          <div className={styles.trust__section__wrapper}>
            <Row>
              <Col md={12}>
                <div className={styles.trust__section__header}>
                  {ReactHtmlParser(data?.title)}
                  <p>
                    {data?.description}
                  </p>
                </div>
                <div className={styles.statBox__parentDiv}>
                  {data?.stats?.map((item) => {
                    return (
                      <StatBox item={{ lead: item?.label, desc: item?.value }} />
                    )
                  })}
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>
    </>
  );
};

export default TrustSection;
