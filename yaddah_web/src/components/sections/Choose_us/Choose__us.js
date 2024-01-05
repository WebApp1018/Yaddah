import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import IconBox from "../../IconBox/IconBox";
import {
  whyChooseUsSvg,
} from "../../../constant/imagePath";
import ReactHtmlParser from "react-html-parser";
import styles from "./Choose__us.module.css";
import { ReactSVG } from "react-svg";
import { imageUrl } from "../../../config/apiUrl";
const ChooseUs = ({ data }) => {

  return (
    <section
      className={styles.why__choose__us__section}
      style={{
        backgroundImage: `linear-gradient(#ffffffe3, #ffffffe3), url(${imageUrl(
          data?.bgImage
        )})`,
      }}
    >
      <Container className={styles.why__choose__us__container}>
        <Row>
          <Col lg={12}>
            <h2>
              {ReactHtmlParser(data?.title)}
            </h2>
          </Col>
          <Col lg={6}>
            <div className={styles.section__list}>
              {data?.whyChoose?.map((e) => (
                <IconBox item={e} />
              ))}
            </div>
          </Col>
        </Row>
        <img
          src={imageUrl(data?.image)}
          className={styles.why__choose__us__subject}
          alt=""
        />
      </Container>
      <ReactSVG className={styles.why__choose__us__svg} src={whyChooseUsSvg} />
    </section>
  );
};

export default ChooseUs;
