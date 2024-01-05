import React from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import About__us from "../../components/sections/About/About__section";
import ChooseUs from "../../components/sections/Choose_us/Choose__us";
import TrustSection from "../../components/sections/Trust/Trust__section";
import { useSelector } from "react-redux";
import ReactHtmlParser from "react-html-parser";

const AboutUs = () => {
  const aboutCMS = useSelector((state) => state?.commonReducer?.cms?.aboutUs);

  return (
    <>
      <PageHeader item={ReactHtmlParser(aboutCMS?.about_section1_heading)} fromCms />
      <About__us
        data={{
          image: aboutCMS?.about_section2_image,
          title: aboutCMS?.about_section2_title,
          description: aboutCMS?.about_section2_description,
        }}
      />
      <ChooseUs data={{
        title:aboutCMS?.about_section3_title,
        image:aboutCMS?.about_section3_image,
        bgImage:aboutCMS?.about_section3_bgImage,
        whyChoose:aboutCMS?.whyChooseUs

      }}/>
      <TrustSection
      data={{
        title:aboutCMS?.about_section4_title,
        description:aboutCMS?.about_section4_description,
        image:aboutCMS?.about_section4_image,
        bgImage:aboutCMS?.about_section4_bgImage,
        stats:[
          {
            value:aboutCMS?.about_section4_counter1,
            label:aboutCMS?.about_section4_counter1_value1
          },
          {
            value:aboutCMS?.about_section4_counter2,
            label:aboutCMS?.about_section4_counter2_value2
          },
          {
            value:aboutCMS?.about_section4_counter3,
            label:aboutCMS?.about_section4_counter3_value3
          },
          {
            value:aboutCMS?.about_section4_counter4,
            label:aboutCMS?.about_section4_counter4_value4
          },
        ]
      }}
       />
    </>
  );
};

export default AboutUs;
