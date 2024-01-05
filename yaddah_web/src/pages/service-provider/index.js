import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Checkbox } from "../../components/Checkbox/Checkbox";
import { Input } from "../../components/Input/Input";
import Maps from "../../components/MapAndPlaces";
import styles from "./ServiceProvider.module.css";

const BecomeAServiceProvider = () => {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [userName, setUserName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [verifyEmail, setVerifyEamil] = useState("");
  const [zipCode, setZipCode] = useState("");
  console.log(zipCode, "zipp");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [acceptTerms, setAcceptTerms] = useState("");

  return (
    <section className={styles.section}>
      <Container>
        <h1>Service Provider</h1>
        <Row className={styles.rowGap}>
          <Col md={6}>
            <Input
              setter={setFullName}
              state={fullName}
              placeholder={"Enter fullname"}
              label={"FullName"}
              form
            />
          </Col>

          <Col md={6}>
            <Input
              setter={setUserName}
              state={userName}
              placeholder={"Enter username"}
              label={"Username"}
              form
            />
          </Col>
          <Col md={6}>
            <Maps
              setAddress={setAddress}
              address={address}
              placeholder={"Enter address"}
              label={"Address"}
              type={"places"}
            />
          </Col>
          <Col md={6}>
            <Input
              setter={setCountry}
              state={country}
              placeholder={"Enter country"}
              label={"Country"}
              form
            />
          </Col>
          <Col md={6}>
            <Input
              setter={setCity}
              state={city}
              placeholder={"Enter city"}
              label={"City"}
              form
            />
          </Col>
          <Col md={6}>
            <Input
              setter={setState}
              state={state}
              placeholder={"Enter state"}
              label={"State"}
              form
            />
          </Col>
          <Col md={6}>
            <Input
              setter={setZipCode}
              state={zipCode}
              placeholder={"Enter zip code"}
              label={"Zip(Post) Code"}
              form
              type="tel"
            />
          </Col>
          <Col md={6}>
            <Input
              setter={setEmail}
              state={email}
              placeholder={"Enter email"}
              label={"Email"}
              form
            />
          </Col>
          <Col md={6}>
            <Input
              setter={setVerifyEamil}
              state={verifyEmail}
              placeholder={"Enter verify email"}
              label={"Verify Email"}
              form
            />
          </Col>

          <Col md={6}>
            <Input
              setter={setPassword}
              state={password}
              type={"password"}
              placeholder={"Enter password"}
              label={"Password"}
              form
            />
          </Col>
          <Col md={6}>
            <Input
              setter={setVerifyPassword}
              state={verifyPassword}
              type={"password"}
              label={"Verify Password"}
              placeholder={"Enter verify password"}
              form
            />
          </Col>
          <Col md={6}>
            <Input
              setter={setMobile}
              state={mobile}
              label={"Mobile"}
              placeholder={"Enter mobile"}
              form
            />
          </Col>
          <Col md={6}>
            <Checkbox
              setValue={setAcceptTerms}
              value={acceptTerms}
              label={"I Accept The Terms & Conditions"}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default BecomeAServiceProvider;
