import React, { useState } from "react";
import styles from "./Revenue.module.css";
import { Row, Col, Table } from "react-bootstrap";
import { useEffect } from "react";
import { DropDown } from "../../Components/DropDown/DropDown";
import PaginationComponent from "../../Components/PaginationComponent";
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import moment from "moment/moment";
import StatBox from "../../Components/StatBox";
import { Skeleton } from "@mui/material";
import TableSkeleton from "../../Components/TableSkeletonBootstrap";
import NoData from "../../Components/NoData/NoData";
import { BaseURL, recordsLimit } from "../../config/apiUrl";
import {
  newServiceProviderRequestSvg,
  totalEarningsSvg,
  totalUsersSvg,
} from "../../constant/imagePath";
import { Get } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import { Button } from "../../Components/Button/Button";
import { GenerateExcelFile } from "../../Helper/CommonFunction";

const Earnings = () => {
  const { accessToken } = useSelector((state) => state.authReducer);
  const [data, setData] = useState([]);
  const [earningCount, setEarningCount] = useState(30);
  const [revenue, setRevenue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    label: "All",
    value: "all",
  });
  const [showGenerateReport, setShowGenerateReport] = useState(false);

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

  const getEarning = async (pg = page, status = filter) => {
    pg == 1 && setIsLoading(true);
    pg >= 1 && setTableLoading(true);
    const response = await Get(
      BaseURL(
        `users/admin/revenues?page=${pg}&limit=${recordsLimit}&status=${status?.value}`
      ),
      accessToken
    );
    setIsLoading(false);
    if (response !== undefined) {
      setData(response?.data.data);
      setEarningCount(response?.data.totalCount);
      setRevenue(response?.data?.earnings);
    }
    pg == 1 && setIsLoading(false);
    pg >= 1 && setTableLoading(false);
  };
  useEffect(() => {
    getEarning();
  }, []);

  const filterOptions = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Silver",
      value: "Silver",
    },
    {
      label: "Gold",
      value: "Gold",
    },
    {
      label: "Platinum",
      value: "Platinum",
    },
  ];

  const HandleSubmitGenerateReport = async () => {
    setShowGenerateReport(true);
    const response = await Get(
      BaseURL(`users/admin/all-revenues?status=${filter?.value}`),
      accessToken
    );
    if (response !== undefined) {
      const jsonData = [];
      response?.data?.data?.map((item) => {
        jsonData.push({
          "Service Provider": item?.serviceProvider?.userName,
          Email: item?.serviceProvider?.email,
          Package: item?.packageType,
          Duration: item?.duration,
          Amount: `$${item?.amount}`,
          Date: moment(item?.createdAt).format("LLL"),
        });
      });
      HandleCreateExcelFileAndDownload(jsonData);
    } else {
      setShowGenerateReport(false);
    }
  };

  const HandleCreateExcelFileAndDownload = async (data) => {
    const fileUrl = await GenerateExcelFile(data);

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `${filter?.label}PackagesRevenueReport.xlsx`;
    link.click();

    // Clean up
    URL.revokeObjectURL(fileUrl);
    setShowGenerateReport(false);
  };

  return (
    <>
      <SidebarSkeleton>
        <style>{`
      .${styles.earing__table__wrapper} tbody{
        overflow-y:auto;

      }
      `}</style>
        <div className={styles.content__wrapper}>
          <div className={styles.header}>
            <h1>Revenue</h1>
            <div className={styles.headerRight}>
              <DropDown
                value={filter}
                setter={(e) => {
                  setPage(1);
                  setFilter(e);
                  getEarning(1, e);
                }}
                options={filterOptions}
                placeholder="Filter"
                customStyle={{
                  backgroundColor: "var(--clr-secondary)",
                  color: "var(--clr-font-inverted)",
                  fontFamily: "var(--ff-poppins-semibold)",
                  height: "50px",
                  width: "150px",
                }}
                indicatorColor={"white"}
              />
              <Button
                label={"Download Report"}
                className={styles.DownloadReport}
                customStyle={{
                  backgroundColor: "var(--clr-secondary)",
                  color: "var(--clr-font-inverted)",
                  fontFamily: "var(--ff-poppins-semibold)",
                  border: "none",
                }}
                onClick={HandleSubmitGenerateReport}
              />
            </div>
          </div>
          <div className={styles.statBox__wrapper}>
            <Row>
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
                      <StatBox item={item} />
                    </Col>
                  ))}
            </Row>
          </div>
          <div className={styles.earing__table__wrapper}>
            <Table responsive="xxl" borderless="true">
              <thead>
                <tr>
                  <th> Service Provider </th>
                  <th> Email </th>
                  <th> Package </th>
                  <th> Duration </th>
                  <th> Date </th>
                  <th> Amount </th>
                </tr>
              </thead>
              {tableLoading ? (
                <TableSkeleton rowsCount={recordsLimit} colsCount={5} />
              ) : data.length > 0 ? (
                <tbody>
                  {data?.map((e) => (
                    <tr>
                      <td>{`${e?.serviceProvider?.userName}`}</td>
                      <td>{e?.serviceProvider?.email} </td>
                      <td className="text-capitalize">{e?.packageType}</td>
                      <td className="text-capitalize"> {e?.duration} </td>
                      <td> {moment(e?.createdAt).format("LLL")} </td>
                      <td className="text-capitalize"> ${e?.amount} </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan={5}>
                      <NoData text={"No Revenue Found"} />
                    </td>
                  </tr>
                </tbody>
              )}
            </Table>
          </div>
        </div>
        {!isLoading && data?.length > 0 && (
          <div className={[styles.paginationDiv]}>
            <PaginationComponent
              totalPages={Math.ceil(earningCount / recordsLimit)}
              currentPage={page}
              setCurrentPage={(e) => {
                setPage(e);
                getEarning(e);
              }}
              defaultActiveColor="var(--clr-primary)"
            />
          </div>
        )}
      </SidebarSkeleton>
      {showGenerateReport && (
        <div className={`${styles?.downloadLoadingContianer}`}>
          <span>Please Wait While Generating Report...</span>
        </div>
      )}
    </>
  );
};

export default Earnings;
