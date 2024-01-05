import React from "react";
import { useState } from "react";
import styles from "./Packages.module.css";
//Components
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import PricingCard from "../../Components/PricingCard";
import { Button } from "../../Components/Button/Button";
import { useSelector } from "react-redux";
import { BaseURL } from "../../config/apiUrl";
import { useEffect } from "react";
import { Get } from "../../Axios/AxiosFunctions";
import { Loader } from "../../Components/Loader";
const Packages = () => {
  const { accessToken } = useSelector((state) => state.authReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [Packages, setPackages] = useState([]);

  const [IsBtnActive, setIsBtnActive] = useState("Annual");
  const getPackages = async () => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(`package/admin/all?type=${IsBtnActive}`),
      accessToken
    );

    setIsLoading(false);
    if (response !== undefined) {
      setPackages(response?.data?.data);
    }
  };
  useEffect(() => {
    getPackages();
  }, [IsBtnActive]);

  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.packages__header}>
          <h1>Packages</h1>
          <div className={styles.headerRight}>
            <Button
              variant={IsBtnActive === "Annual" && "secondary"}
              onClick={(e) => {
                setIsBtnActive("Annual");
              }}
            >
              Annual Plans
            </Button>
            <Button
              variant={IsBtnActive === "Monthly" && "secondary"}
              onClick={(e) => {
                setIsBtnActive("Monthly");
              }}
            >
              Monthly Plans
            </Button>
          </div>
        </div>
        {isLoading ? (
          <Loader className={styles.loader} />
        ) : (
          <div className={styles.pricing__wrapper}>
            {Packages.map((e) => (
              <PricingCard item={e} />
            ))}
          </div>
        )}
      </div>
    </SidebarSkeleton>
  );
};

export default Packages;
