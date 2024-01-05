import React, { useState } from "react";
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import classes from "./SettingsPage.module.css";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { BaseURL, apiHeader } from "../../config/apiUrl";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Loader } from "../../Components/Loader";
import SMList from "../../Components/SMList/SMList";
import { Col, Row } from "react-bootstrap";
import EmailSettings from "../../Components/EmailSettings/EmailSettings";
import StorageSettings from "../../Components/StorageSettings/StorageSettings";
import MapSettings from "../../Components/MapSettings/MapSettings";
import PaymentSettings from "../../Components/PaymentSettings/PaymentSettings";
import DatabaseSettings from "../../Components/DatabaseSettings/DatabaseSettings";
import { toast } from "react-toastify";

function SettingsPage() {
  const { accessToken } = useSelector((state) => state?.authReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState([
    {
      title: "Email",
      isSelected: true,
    },
    {
      title: "Storage",
      isSelected: false,
    },
    {
      title: "Map",
      isSelected: false,
    },
    {
      title: "Payment",
      isSelected: false,
    },
    {
      title: "Database",
      isSelected: false,
    },
  ]);
  const [configData, setConfigData] = useState([]);
  const [isApiCalling, setIsApiCalling] = useState(false);
  const [previouslySelectedEmailProvider, setPreviouslySelectedEmailProvider] =
    useState(null);

  // getAppconfig
  const getAppconfig = async () => {
    const url = BaseURL("configs");

    setIsLoading(true);
    const response = await Get(url, accessToken);
    setIsLoading(false);

    if (response) {
      setConfigData(response?.data?.data);
    }
  };

  useEffect(() => {
    getAppconfig();
  }, []);

  // handleSMListSelect
  const handleSMListSelect = (title) => {
    const newPage = page.map((item) => {
      if (item.title === title) {
        return {
          ...item,
          isSelected: true,
        };
      } else {
        return {
          ...item,
          isSelected: false,
        };
      }
    });

    setPage(newPage);
  };

  // handleConfigSubmit
  const handleConfigSubmit = async (data, showAlert = true) => {
    const url = BaseURL("configs/update");

    setIsApiCalling(true);
    const response = await Patch(url, data, apiHeader(accessToken), showAlert);
    setIsApiCalling(false);

    if (response) {
      setConfigData(response?.data?.data);
      showAlert && toast.success("Config Updated Successfully.");
    }
  };

  return (
    <SidebarSkeleton>
      {isLoading && <Loader />}

      {!isLoading && (
        <div className={classes.content__wrapper}>
          <h1>Settings</h1>

          {/* Top Bar */}
          <section className={classes.settingsTopBar}>
            <Row>
              {page.map((item, index) => (
                <Col md={3} sm={4} key={index}>
                  <SMList
                    title={item.title}
                    onClick={handleSMListSelect}
                    isSelected={item.isSelected}
                  />
                </Col>
              ))}
            </Row>
          </section>

          {/* Settings */}
          <section className={classes.settings__wrapper}>
            {page[0].isSelected && (
              <EmailSettings
                data={configData}
                isLoading={isApiCalling}
                onClick={handleConfigSubmit}
                setPreviouslySelectedEmailProvider={
                  setPreviouslySelectedEmailProvider
                }
              />
            )}
            {page[1].isSelected && (
              <StorageSettings
                data={configData?.find((e) => e?.keyType === "s3")}
                isLoading={isApiCalling}
                onClick={handleConfigSubmit}
              />
            )}
            {page[2].isSelected && (
              <MapSettings
                data={configData?.find((e) => e?.keyType === "map")}
                isLoading={isApiCalling}
                onClick={handleConfigSubmit}
              />
            )}
            {page[3].isSelected && (
              <PaymentSettings
                data={configData?.find((e) => e?.keyType === "paypal")}
                isLoading={isApiCalling}
                onClick={handleConfigSubmit}
              />
            )}
            {page[4].isSelected && (
              <DatabaseSettings
                isLoading={isApiCalling}
                onClick={handleConfigSubmit}
                data={configData?.find((e) => e?.keyType === "database")}
              />
            )}
          </section>
        </div>
      )}
    </SidebarSkeleton>
  );
}

export default SettingsPage;
