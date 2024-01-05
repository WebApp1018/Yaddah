import { Container, Row, Col } from "react-bootstrap";
import React, { useEffect } from "react";
import styles from "./ServiceProviderServices.module.css";
//Components
import PageHeader from "../../components/PageHeader/PageHeader";
import WithHeader__card from "../../components/CardWithHeader/CardWithHeader";
import { Get } from "../../Axios/AxiosFunctions";
//Images

import { useState } from "react";
import Tabs from "../../components/Tabs";
import { BaseURL, recordsLimit } from "../../config/apiUrl";
import { Loader } from "../../components/Loader";
import PaginationComponent from "../../components/PaginationComponent";
import NoData from "../../components/NoData/NoData";
import { useNavigate, useParams } from "react-router-dom";

const ServiceProviderServices = () => {
  const spId = useParams()?.id;
  const navigate=useNavigate()

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalService, setTotalService] = useState(0);

  const getServices = async () => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(`service/sp/${spId}?page=${page}&limit=${recordsLimit}`)
    );
    if (response !== undefined) {
      setServices(response?.data.data);
      setTotalService(response?.data?.totalRecords);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getServices();
  }, [page]);

  return (
    <>
      <PageHeader item={{ bold: "Services" }} />

      {isLoading ? (
        <Loader className={styles.loader} />
      ) : (
        <>
          <section className={styles.services__section}>
            <Container className="mt-5">
              {services?.length > 0 ? (
                <Row>
                  {services?.map((e, key) => (
                    <Col lg={4} sm={6} xs={12} key={key} onClick={()=>{
                    }}>
                      <WithHeader__card item={e} showBtn={true} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <NoData text={"No Services Found"} />
              )}
            </Container>
            {!isLoading && services.length > 0 && (
              <div className={[styles.paginationDiv]}>
                <PaginationComponent
                  totalPages={Math.ceil(totalService / recordsLimit)}
                  currentPage={page}
                  setCurrentPage={setPage}
                  defaultActiveColor="var(--clr-primary)"
                />
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
};

export default ServiceProviderServices;
