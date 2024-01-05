import React from "react";
import moment from "moment/moment";
import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
//Components
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import styles from "./Reports.module.css";
import { Button } from "../../Components/Button/Button";
import TableSkeleton from "../../Components/TableSkeletonBootstrap";
import {
  apiHeader,
  BaseURL,
  imageUrl,
  recordsLimit,
} from "../../config/apiUrl";
import NoData from "../../Components/NoData/NoData";
import { Delete, Get, Post } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import PaginationComponent from "../../Components/PaginationComponent";
import AreYouSureModal from "../../modals/AreYouSureModal";
import { toast } from "react-toastify";
import AddReportModal from "../../modals/AddReportModal";
import { ImFolderDownload } from "react-icons/im";
import { FileDownloadFromUrl } from "../../Helper/FileDownloadFromUrl";
import SearchInput from "../../Components/SearchInput";
import useDebounce from "../../CustomHooks/useDebounce";

let isInitialRender = true;
const typeFilter = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Subscription",
    value: "subscription",
  },
  {
    label: "Booking",
    value: "booking",
  },
];
const Reports = () => {
  const { accessToken } = useSelector((state) => state.authReducer);
  const [reports, setReports] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [reportType, setReportType] = useState(typeFilter[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState("");
  const [isModalOpen, setIsModalOpen] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const debounceVal = useDebounce(searchInput, 500);

  // Get Reports
  const getReports = async (
    pg = page,
    typeReport = reportType.value,
    search = searchInput
  ) => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(
        `users/admin/reports/all?page=${page}&limit=${recordsLimit}&type=${typeReport}&search=${search}`
      ),
      accessToken
    );
    if (response !== undefined) {
      // setReports(response?.data.data);
      setTotalCount(response?.data?.totalRecords);
    }
    setIsLoading(false);
  };

  const AddReport = async (params, typeReport) => {
    const url = BaseURL(
      typeReport == "subscription"
        ? `users/generateSubscriptionReportOfSP`
        : "users/generateBookingReportOfSP"
    );

    const response = await Post(url, params, apiHeader(accessToken));
    if (response !== undefined) {
      const newReport = [...reports];

      newReport?.unshift(response?.data?.data);
      setIsModalOpen("");
      toast.success(`Report created successfully`);
      setReports(newReport);
    }
  };
  const deleteReport = async () => {
    setIsModalLoading(true);
    const response = await Delete(
      BaseURL(`users/admin/report/delete/${selectedItem?._id}`),
      null,
      apiHeader(accessToken)
    );
    if (response !== undefined) {
      const newReport = reports.filter(
        (item) => item?._id !== selectedItem?._id
      );

      setReports(newReport);
      setIsModalOpen("");
      toast.success("Report deleted successfully");
    }
    setIsModalLoading(false);
  };

  useEffect(() => {
    getReports();
  }, [page]);
  useEffect(() => {
    if (!isInitialRender) {
      setPage(1);
      getReports(1);
    }
    isInitialRender = false;
  }, [debounceVal]);
  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.header}>
          <h1>Reports</h1>
          <div className={styles.headerRight}>
            <SearchInput
              placeholder="Search by file name"
              value={searchInput}
              setter={setSearchInput}
            />

           
            <Button
              label={"Generate Report"}
              className={styles.DownloadReport}
              customStyle={{
                backgroundColor: "var(--clr-secondary)",
                color: "var(--clr-font-inverted)",
                fontFamily: "var(--ff-poppins-semibold)",
                border: "none",
              }}
              onClick={() => {
                setSelectedItem(null);
                setIsModalOpen("add");
              }}
            />
          </div>
        </div>
        <div className={styles.faq__table__wrapper}>
          <div className={styles.table__wrapper}>
            <Table borderless="true">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>S.No</th>
                  <th style={{ width: "20%" }}>File Name</th>
                  <th style={{ width: "15%" }}>StartDate</th>
                  <th style={{ width: "15%" }}>End Date</th>
                  <th style={{ width: "10%" }}>Report Type</th>
                  <th style={{ width: "20%" }}>File</th>
                  <th style={{ width: "10%" }}>Action</th>
                </tr>
              </thead>

              {isLoading ? (
                <TableSkeleton rowsCount={recordsLimit} colsCount={5} />
              ) : (
                <tbody>
                  {reports?.length > 0 &&
                 
                    reports?.map((e, i) => (
                      <tr>
                        <td style={{ width: "10%" }}>{i + 1}</td>
                        <td style={{ width: "20%" }}>{e?.fileName}</td>
                        <td style={{ width: "15%" }}>
                          {moment(e?.startDate).format("DD MMM YYYY hh:mm")}
                        </td>
                        <td style={{ width: "15%" }}>
                          {moment(e?.endDate).format("DD MMM YYYY hh:mm")}
                        </td>
                        <td style={{ width: "10%" }}>{e?.reportType}</td>
                        <td style={{ width: "20%" }}>
                          <ImFolderDownload
                            style={{ cursor: "pointer" }}
                            size={25}
                            color="var(--clr-secondary)"
                            onClick={() =>
                              FileDownloadFromUrl(
                                `${imageUrl(e?.file)}`,
                                e?.file
                              )
                            }
                          />
                        </td>
                        <td style={{ width: "20%" }}>
                          <Button
                            className={["btn__solid", styles.btn__primary].join(
                              " "
                            )}
                            onClick={() => {
                              setSelectedItem(e);
                              setIsModalOpen("delete");
                            }}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              )}
            </Table>
            {reports.length === 0 && <NoData text="No Reports Found" />}
          </div>
          

          {!isLoading && reports?.length > 0 && (
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
      {isModalOpen == "add" && (
        <AddReportModal
          show={isModalOpen == "add"}
          setShow={() => setIsModalOpen("")}
          data={selectedItem}
          onClick={AddReport}
        />
      )}
      <AreYouSureModal
        show={isModalOpen == "delete"}
        setShow={() => setIsModalOpen("")}
        isApiCall={isModalLoading}
        onClick={deleteReport}
        subTitle={"Do you want to delete this Report?"}
      />
    </SidebarSkeleton>
  );
};

export default Reports;
