import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./Home.module.css";
import ReactHtmlParser from "react-html-parser";
import { bannerAccent } from "../../constant/imagePath";
//Components
import About__us from "../../components/sections/About/About__section";
import WithHeader__card from "../../components/CardWithHeader/CardWithHeader";
import ChooseUs from "../../components/sections/Choose_us/Choose__us";
import TrustSection from "../../components/sections/Trust/Trust__section";
import HomeSearch from "../../components/HomeSearch";
import { useSelector } from "react-redux";
import { BaseURL, imageUrl } from "../../config/apiUrl";
import MultiImageCarousel from "../../components/MultiImageCarousel";
import { useNavigate } from "react-router-dom";
import ServiceProviderCard from "../../components/ServiceProviderCard/ServiceProviderCard";
import { Get } from "../../Axios/AxiosFunctions";
import { Button } from "../../components/Button/Button";

const Home = () => {
  const navigate = useNavigate();
  const { allCategories } = useSelector((state) => state.commonReducer);
  const home = useSelector((state) => state?.commonReducer?.cms?.home);

  const [isLoadingSps, setIsLoadingSps] = React.useState(false);
  const [serviceProvidersData, setServiceProvidersData] = React.useState([]);

  // get Sps
  const getSps = async () => {
    const url = BaseURL(`users/get/service-providers?page=1&limit=9`);
    setIsLoadingSps(true);
    const response = await Get(url);
    setIsLoadingSps(false);

    if (response) {
      setServiceProvidersData(response?.data?.data);
    }
  };

  useEffect(() => {
    getSps();
  }, []);

  return (
    <>
      <section className={styles.banner__section}>
        <Container>
          <Row>
            <Col lg={6}>
              <div className={styles.banner__content}>
                {ReactHtmlParser(home?.home_section1_title)}
                <p>{home?.home_section1_description}</p>
                <HomeSearch categoryOptions={allCategories} />
              </div>
            </Col>
            <Col lg={6}>
              <div className={styles.banner__image}>
                <img
                  src={imageUrl(home?.home_section1_image)}
                  className={styles.banner__subject}
                  alt=""
                />
                <img
                  src={bannerAccent}
                  className={styles.banner__accent}
                  alt=""
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className={styles.images}>
        <Container fluid className="px-0">
          <MultiImageCarousel
            images={home?.home_slider_images}
            autoPlay={true}
          />
        </Container>
      </section>
      <About__us
        data={{
          image: home?.home_section2_image,
          title: home?.home_section2_title,
          description: home?.home_section2_description,
        }}
      />
       {/* SPs */}
       <section className={styles.category__section}>
        <Container>
          <Row>
            <Col lg={12}>
              <h2>
                {ReactHtmlParser(
                  '<h2><span style="color: var(--clr-primary);">Choose</span>&nbsp;Service Provider</h2>'
                )}
              </h2>
            </Col>
            {serviceProvidersData?.map((item, key) => (
              <Col
                lg={4}
                className={styles.categories}
                key={key}
                onClick={() => {
                  navigate(`/service-provider/services/${item?._id}`);
                }}
              >
                <ServiceProviderCard item={item} />
              </Col>
            ))}

            <Col
              lg={12}
              className="text-center"
              style={{
                "margin-top": "-20px",
              }}
            >
              <Button
                label={"View All"}
                onClick={() => navigate("/service-providers")}
              />
            </Col>
          </Row>
        </Container>
      </section>
      {/* End of SPs */}
      <section className={styles.category__section}>
        <Container>
          <Row>
            <Col lg={12}>
              <h2>{ReactHtmlParser(home?.home_section3_title)}</h2>
            </Col>
            {allCategories?.slice(0, 9)?.map((item, key) => (
              <Col
                lg={4}
                className={styles.categories}
                key={key}
                onClick={() => {
                  navigate("/services", {
                    state: {
                      category: item?._id,
                    },
                  });
                }}
              >
                <WithHeader__card item={item} />
              </Col>
            ))}
            <Col
              lg={12}
              className="text-center"
              style={{
                "margin-top": "-20px",
              }}
            >
              <Button
                label={"View All"}
                onClick={() => navigate("/categories")}
              />
            </Col>
          </Row>
        </Container>
      </section>
     
      <ChooseUs
        data={{
          title: home?.home_section4_title,
          image: home?.home_section4_image,
          bgImage: home?.home_section4_bgImage,
          whyChoose: home?.whyChooseUs,
        }}
      />
      <TrustSection
        data={{
          title: home?.home_section5_title,
          description: home?.home_section5_description,
          image: home?.home_section5_image,
          bgImage: home?.home_section5_bgImage,
          stats: [
            {
              value: home?.home_section5_counter1,
              label: home?.home_section5_counter1_value1,
            },
            {
              value: home?.home_section5_counter2,
              label: home?.home_section5_counter2_value2,
            },
            {
              value: home?.home_section5_counter3,
              label: home?.home_section5_counter3_value3,
            },
            {
              value: home?.home_section5_counter4,
              label: home?.home_section5_counter4_value4,
            },
          ],
        }}
      />
    </>
  );
};

export default Home;

const spsData = Array(10).fill({
  _id: Math.random(),
  fullName: "John Doe",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",
  photo: "https://picsum.photos/200",
  userRating: "preferred",
  services: Array(6).fill({
    _id: Math.random(),
    name: "Service Name",
    price: 100,
  }),
});
