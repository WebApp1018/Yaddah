import React from "react";
import moment from "moment/moment";
import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
//Components
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import styles from "./NewsletterScreen.module.css";
import TableSkeleton from "../../Components/TableSkeletonBootstrap";
import { BaseURL, recordsLimit } from "../../config/apiUrl";
import NoData from "../../Components/NoData/NoData";
import {  Get} from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import PaginationComponent from "../../Components/PaginationComponent";

const NewsletterScreen = () => {
  const { accessToken } = useSelector((state) => state.authReducer);
  const [apiData, setApiData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // getData
  const getData = async () => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(`newsletter/admin/all?page=${page}&limit=${recordsLimit}`),
      accessToken
    );
    if (response !== undefined) {
      setApiData(response?.data.data);
      setTotalCount(response?.data?.totalCount);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, [page]);

  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.header}>
          <h1>Newsletter</h1>
        </div>
        <div className={styles.faq__table__wrapper}>
          <div className={styles.table__wrapper}>
            <Table borderless="true">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>S.No</th>
                  <th style={{ width: "20%" }}>Email</th>
                  <th style={{ width: "10%" }}>Created At</th>
                </tr>
              </thead>

              {isLoading ? (
                <TableSkeleton rowsCount={recordsLimit} colsCount={5} />
              ) : (
                <tbody>
                  {apiData?.length == 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <NoData text="No record Found" />
                      </td>
                    </tr>
                  ) : (
                    apiData?.map((e, i) => (
                      <tr>
                        <td style={{ width: "10%" }}>{i + 1}</td>
                        <td style={{ width: "20%" }}>{e?.email}</td>
                        <td style={{ width: "10%" }}>
                          {moment(e?.createdAt).format("DD MMM YYYY hh:mm")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              )}
            </Table>
          </div>
          {!isLoading && apiData?.length > 0 && (
            <div className={[styles.paginationDiv]}>
              <PaginationComponent
                totalPages={Math.ceil(totalCount / recordsLimit)}
                currentPage={page}
                setCurrentPage={setPage}
                defaultActiveColor="var(--clr-primary)"
              />
            </div>
          )}
        </div>
      </div>
    </SidebarSkeleton>
  );
};

export default NewsletterScreen;
