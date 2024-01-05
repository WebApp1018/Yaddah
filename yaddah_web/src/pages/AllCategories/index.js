import { Container, Row, Col } from "react-bootstrap";
import React, { useEffect } from "react";
import styles from "./AllCategories.module.css";
//Components
import PageHeader from "../../components/PageHeader/PageHeader";
import { Get } from "../../Axios/AxiosFunctions";
//Images

import { useState } from "react";
import { BaseURL, recordsLimit } from "../../config/apiUrl";
import { Loader } from "../../components/Loader";
import PaginationComponent from "../../components/PaginationComponent";
import NoData from "../../components/NoData/NoData";
import ServiceProviderCard from "../../components/ServiceProviderCard/ServiceProviderCard";
import { useNavigate } from "react-router-dom";
import WithHeader__card from "../../components/CardWithHeader/CardWithHeader";

const AllCategories = () => {
  const navigate = useNavigate();
  const [sps, setSps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalService, setTotalService] = useState(0);

  const getSps = async () => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(`category?page=${page}&limit=${recordsLimit}`)
    );
    if (response !== undefined) {
      setSps(response?.data.data);
      setTotalService(response?.data?.totalCount);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getSps();
  }, [page]);

  return (
    <>
      <PageHeader item={{ bold: "Categories" }} />

      {isLoading ? (
        <Loader className={styles.loader} />
      ) : (
        <>
          <section className={styles.services__section}>
            <Container className={styles.mt5}>
              {sps?.length > 0 ? (
                <Row>
                  {sps?.map((e, key) => (
                      <Col
                      lg={4}
                      className={styles.categories}
                      key={key}
                      onClick={() => {
                        navigate("/services", {
                          state: {
                            category: e?._id,
                          },
                        });
                      }}
                    >
                      <WithHeader__card item={e} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <NoData text={"No Categories Found"} />
              )}
            </Container>
            {!isLoading && sps.length > 0 && (
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

export default AllCategories;
