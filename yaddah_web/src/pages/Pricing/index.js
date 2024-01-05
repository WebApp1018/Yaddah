import React, { useEffect } from "react";
import { useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import styles from "./Pricing.module.css";
import { Container, Row, Col } from "react-bootstrap";
//Components
import PricingCard from "../../components/PricingCard";
import { Button } from "../../components/Button/Button";
import { Get } from "../../Axios/AxiosFunctions";
import { BaseURL } from "../../config/apiUrl";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/Loader";
import SidebarSkeleton from "../../components/SidebarSkeleton";
import { useSelector } from "react-redux";

const Pricing = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.authReducer.accessToken);
  const user = useSelector((state) => state.authReducer.user);
  const [anuallyPackage, setAnuallyPackage] = useState([]);
  const [monthlyPackage, setMonthlyPackage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPackages = async () => {
    setIsLoading(true);
    const annual = await Get(BaseURL(`package?type=Annual`));
    const monthly = await Get(BaseURL(`package?type=Monthly`));
    if (annual !== undefined && monthly !== undefined) {
      setAnuallyPackage(annual?.data.data);
      setMonthlyPackage(monthly?.data.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (token && user?.role === "customer") {
      return navigate(-1);
    }
    getPackages();
  }, []);

  const [buttonState, setButtonState] = useState("annual");

  // Wrapper + permission + UI
  let Wrapper = token ? SidebarSkeleton : React.Fragment;

  return (
    <Wrapper>
      {!token && <PageHeader item={{ bold: "Pricing" }} />}
      {token &&
        user?.packageType?.toLowerCase() === "none" &&
        user?.role !== "customer" && (
          <div className={styles?.pricing__packageExpired}>
            Please select a package to unlock your dashboard.
          </div>
        )}
      <section className={styles.pricing__section}>
        <Container>
          <Row>
            <Col md={12}>
              <div className={styles.pricing__header}>
                <h2>Subscription Plans</h2>
                <div className={styles.pricing__button}>
                  <Button
                    className={buttonState == "annual" && styles.active__button}
                    label={"Annual Plans"}
                    onClick={() => setButtonState("annual")}
                  />
                  <Button
                    className={
                      buttonState == "monthly" && styles.active__button
                    }
                    label={"Monthly Plans"}
                    onClick={() => setButtonState("monthly")}
                  />
                </div>
              </div>
            </Col>
          </Row>

          <div className={styles.pricing__card__wrapper}>
            {isLoading ? (
              <Loader className={styles.loader} />
            ) : (
              <Row className={styles.cardRow}>
                {buttonState === "annual" &&
                  anuallyPackage?.map((e, i) => (
                    <Col xl={3} md={6} sm={12} key={i}>
                      <PricingCard
                        index={i}
                        item={e}
                        onSelectPackage={(e) => {
                          navigate(`/signup`, {
                            state: {
                              package: e,
                              type: "sp",
                            },
                          });
                        }}
                      />
                    </Col>
                  ))}
                {buttonState === "monthly" &&
                  monthlyPackage?.map((e, i) => (
                    <Col xl={3} md={6} sm={12} key={i}>
                      <PricingCard
                        item={e}
                        onSelectPackage={(e) =>
                          navigate(`/signup`, {
                            state: {
                              package: e,
                              type: "sp",
                            },
                          })
                        }
                      />
                    </Col>
                  ))}
              </Row>
            )}
          </div>
        </Container>
      </section>
    </Wrapper>
  );
};

export default Pricing;
