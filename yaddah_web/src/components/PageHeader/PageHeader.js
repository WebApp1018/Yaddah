import React from "react";
import styles from "./PageHeader.module.css";
import { Container } from "react-bootstrap";

const PageHeader = ({ item,fromCms }) => {
  return (
    <section className={styles.banner__section}>
      <Container>
        {!fromCms?<h1>
          <span>{item.bold}</span> {item.italic}{" "}
        </h1>:
        item
        }
      </Container>
    </section>
  );
};

export default PageHeader;
