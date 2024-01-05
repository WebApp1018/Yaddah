import React, { useState } from "react";
import SidebarSkeleton from "../../components/SidebarSkeleton";
import PaginationComponent from "../../components/PaginationComponent";
import styles from "./UserTransactions.module.css";
import { Table } from "react-bootstrap";
import moment from "moment";
import { recordsLimit } from "../../config/apiUrl";
import { Get } from "../../Axios/AxiosFunctions";
import { BaseURL } from "../../config/apiUrl";
import NoData from "../../components/NoData/NoData";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Loader } from "../../components/Loader";

function UserTransactions() {
  const { accessToken } = useSelector((state) => state?.authReducer);
  const [page, setPage] = React.useState(1);
  const [apiData, setApiData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  // getData
  const getData = async (pg = page) => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(`users/transactions?page=${pg}&limit=${recordsLimit}`),
      accessToken
    );
    setIsLoading(false);
    if (response !== undefined) {
      setApiData(response?.data.data);
      setTotalRecords(response?.data?.totalCount);
    }
  };
  useEffect(() => {
    getData();
  }, [page]);

  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.__header}>
          <h1>My Transactions</h1>
        </div>
        <div className={styles.__content}>
          {isLoading ? (
            <Loader className={styles.loader} />
          ) : apiData?.length == 0 ? (
            <NoData className={styles.loader} text={"No Transactions Found"} />
          ) : (
            <Table responsive="xxl" borderless="true">
              <thead>
                <tr>
                  <th> Service </th>
                  <th> Amount </th>
                  <th> Created At</th>
                  <th> Status </th>
                </tr>
              </thead>

              <tbody>
                {apiData?.map((item) => (
                  <tr>
                    <td
                      className={styles.hvButton}
                      onClick={() =>
                        window.open(`/booking/${item?.booking?._id}`, "_blank")
                      }
                    >
                      {item?.booking?.service?.name}
                    </td>
                    <td> {parseFloat(item?.amount).toFixed(2)} </td>
                    <td> {moment(item?.createdAt).format("ll hh:mm a")} </td>
                    <td> {item?.status} </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
      {!isLoading && apiData.length > 0 && (
        <div className={[styles.paginationDiv]}>
          <PaginationComponent
            totalPages={Math.ceil(totalRecords / recordsLimit)}
            currentPage={page}
            setCurrentPage={setPage}
            defaultActiveColor="var(--clr-primary)"
          />
        </div>
      )}
    </SidebarSkeleton>
  );
}

export default UserTransactions;
