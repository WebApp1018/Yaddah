import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import ReactElasticCarousel from "react-elastic-carousel";
import { isMobileViewHook } from "../../CustomHooks/isMobileViewHook";
import classes from "./Carousel.module.css";

function Carousel({ data,Component, containerClass = ""}) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    isMobileViewHook(setIsMobile, 992);
  }, []);

  return (
    <div className={classes.box}>
      <style>{`
            .rec-slider-container{
            padding:0px;
            }
            .rec-carousel-item{
                display:flex;
                align-items:center;
            }
            .rec-dot_active{
                background-color:#f75f4159 !important;
                box-shadow: 0 0 1px 3px var(--primary-color) !important;
            }
            `}</style>
      <Container
        fluid
        className={`${containerClass ? containerClass : classes.container} `}
      >
        
          <ReactElasticCarousel
            showArrows={false}
            breakPoints={[
              { width: 1, itemsToShow: 1 },
              { width: 360, itemsToShow: 2, itemPadding: [0, 10] },
              { width: 400, itemsToShow: 3, itemPadding: [0, 12] },
            ]}
          >
            {data?.map((item, key) => (
              <div  key={key}>
                <Component item={item}/>
              </div>
            ))}
          </ReactElasticCarousel>
        
      </Container>
    </div>
  );
}

export default Carousel;
