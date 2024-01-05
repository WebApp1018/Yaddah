import React, { useState } from "react";
import styles from "./Revenue.module.css";
import { Row, Col, Table } from "react-bootstrap";
import { useEffect } from "react";
//Components
import PaginationComponent from "../../components/PaginationComponent";

import { Button } from "../../components/Button/Button";
import SidebarSkeleton from "../../components/SidebarSkeleton";
import moment from "moment/moment";
import DashboardStatBox from "../../components/DashboardStatBox";
import { Skeleton } from "@mui/material";
import TableSkeleton from "../../components/TableSkeletonBootstrap";
import NoData from "../../components/NoData/NoData";
import { BaseURL, recordsLimit } from "../../config/apiUrl";
// icons

import { Get } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import {
  newServiceProviderRequestSvg,
  totalEarningsSvg,
  totalUsersSvg,
} from "../../constant/imagePath";
import { Link, useNavigate } from "react-router-dom";

const Earnings = () => {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.authReducer);
  const [earning, setEarning] = useState([]);
  const [earningCount, setEarningCount] = useState(30);
  const [revenue, setRevenue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [page, setPage] = useState(1);

  const revenueData = [
    {
      icon: totalUsersSvg,
      data: "$" + (revenue?.totalEarnings || 0),
      desc: "Total Earnings",
    },
    {
      icon: totalEarningsSvg,
      data: "$" + (revenue?.thisMonth || 0),
      desc: "Ongoing Monthly Earnings",
    },
    {
      icon: newServiceProviderRequestSvg,
      data: "$" + (revenue?.lastMonth || 0),
      desc: "Last Month Earnings",
    },
  ];

  const getEarning = async (pg = page) => {
    pg == 1 && setIsLoading(true);
    pg >= 1 && setTableLoading(true);
    const response = await Get(
      BaseURL(
        `users/transactions?page=${pg}&limit=${recordsLimit}&earnings=true`
      ),
      accessToken
    );
    setIsLoading(false);
    if (response !== undefined) {
      setEarning(response?.data.data);
      setEarningCount(response?.data.totalCount);
      setRevenue(response?.data?.earnings);
    }
    pg == 1 && setIsLoading(false);
    pg >= 1 && setTableLoading(false);
  };
  useEffect(() => {
    getEarning();
  }, [page]);

  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.header}>
          <h1>Earnings</h1>
        </div>
        <div className={styles.statBox__wrapper}>
          <Row className={styles.gap}>
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((item) => (
                    <Col md={12} lg={6} xxl={4}>
                      <Skeleton
                        className={styles.skeletonBox}
                        height={"180px"}
                        width={"100%"}
                        variant={"rectangular"}
                      />
                    </Col>
                  ))
              : revenueData?.map((item) => (
                  <Col md={12} lg={6} xxl={4}>
                    <DashboardStatBox item={item} />
                  </Col>
                ))}
          </Row>
        </div>
        <div className={styles.earing__table__wrapper}>
          <Table responsive="xxl" borderless="true">
            <thead>
              <tr>
                <th> Customer Name </th>
                <th> Service Name</th>
                <th> Amount </th>
                <th> Created At </th>
                <th> Action </th>
              </tr>
            </thead>
            {tableLoading ? (
              <TableSkeleton rowsCount={recordsLimit} colsCount={5} />
            ) : earning.length > 0 ? (
              <tbody>
                {earning?.map((e) => (
                  <tr>
                    <td>
                        {`${e.customer?.userName}`}
                    </td>
                    <td>
                      <Link to={`/service/${e?.booking?.service?._id}`}>
                        {e.booking?.service?.name}
                      </Link>
                    </td>
                    <td> ${e?.amount} </td>
                    <td> {moment(e?.createdAt).format("LLL")} </td>
                    <td>
                      <Button
                        label={"View Booking"}
                        customStyle={{
                          backgroundColor: "var(--clr-primary)",
                          color: "var(--clr-font-inverted)",
                          fontFamily: "var(--ff-poppins-semibold)",
                          padding: "13px",
                        }}
                        onClick={() => {
                          navigate(`/booking/${e?.booking?._id}`);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={5}>
                    <NoData text={"No Earnings Found"} />
                  </td>
                </tr>
              </tbody>
            )}
          </Table>
        </div>
      </div>
      {!isLoading && earning.length > 0 && (
        <div className={[styles.paginationDiv]}>
          <PaginationComponent
            totalPages={Math.ceil(earningCount / recordsLimit)}
            currentPage={page}
            setCurrentPage={setPage}
            defaultActiveColor="var(--clr-primary)"
          />
        </div>
      )}
    </SidebarSkeleton>
  );
};

export default Earnings;
