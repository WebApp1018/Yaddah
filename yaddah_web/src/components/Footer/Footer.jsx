import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { logoWhite } from "../../constant/imagePath";
import Newsletter from "../Newsletter";
import styles from "./footer.module.css";
import { BsFillEnvelopeFill } from "react-icons/bs";
import { AiFillPhone } from "react-icons/ai";
import { RiMapPin2Fill } from "react-icons/ri";
import { SocialIcon } from "react-social-icons";
import { useSelector } from "react-redux";

const Footer = () => {
  const footerCms = useSelector((state) => state?.commonReducer?.cms?.footer);

  return (
    <>
      <footer className={styles.footer__section}>
        <Container>
          <Row>
            <Col md={12}>
              <Newsletter />
            </Col>
            <Col lg={3} md={12}>
              <div className={styles.__logo_wrapper}>
                <img src={logoWhite} className={styles.footer__logo} alt="" />
                <p>{footerCms?.description}</p>
              </div>
            </Col>
            <Col lg={3} md={4} sm={4}>
              <div className={styles.links__wrapper}>
                <p>Quick Links</p>
                <ul className={styles.quickLinks}>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="about-us">About Us</Link>
                  </li>
                  <li>
                    <Link to="pricing">Pricing</Link>
                  </li>
                  <li>
                    <Link to="contact-us">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </Col>
            <Col lg={3} md={4} sm={4}>
              <div
                className={`${[
                  styles.links__wrapper,
                  styles.social__links,
                ].join(" ")}`}
              >
                <p>Social Links</p>
                <ul>
                  {footerCms?.socialLinks?.map((item, key) => (
                    <li key={`social-links${key}`}>
                      <SocialIcon
                        url={item?.link}
                        bgColor="var(--clr-font-inverted)"
                        target={"_blank"}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
            <Col lg={3} md={4} sm={4}>
              <div className={styles.links__wrapper}>
                <p>Contact Us</p>
                <ul>
                  <li>
                    <a href={`mailto:${footerCms?.email}`} target={"_blank"}>
                      <BsFillEnvelopeFill />
                      {footerCms?.email}
                    </a>
                  </li>
                  <li>
                    <a href={`tel:${footerCms?.phone}`}>
                      <AiFillPhone />
                      {footerCms?.phone}
                    </a>
                  </li>
                  <li>
                    <Link to={""}>
                      <RiMapPin2Fill />
                      {footerCms?.address}
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
      <div className={styles.footer__sub}>
        <Container>
          <Row>
            <Col lg={12}>
              <p>Copyright © {new Date().getFullYear()}. All Rights Reserved</p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Footer;
