import React from "react";
import moment from "moment/moment";
import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
//Components
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import styles from "./ContactUs.module.css";
import TableSkeleton from "../../Components/TableSkeletonBootstrap";
import { BaseURL, recordsLimit } from "../../config/apiUrl";
import NoData from "../../Components/NoData/NoData";
import { Get } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import PaginationComponent from "../../Components/PaginationComponent";
import ContactUsDetailModal from "../../modals/ContactUsDetailModal";

const ContactUs = () => {
  const { accessToken } = useSelector((state) => state.authReducer);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailModalData, setDetailModalData] = useState(null);

  // Get Faqs
  const getContact = async () => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(`contact-us/admin/all?page=${page}&limit=${recordsLimit}`),
      accessToken
    );
    if (response !== undefined) {
      setData(response?.data.data);
      setTotalCount(response?.data?.totalCount);
    }
    setIsLoading(false);
  };
  // Add or Edit FAQ

  useEffect(() => {
    getContact();
  }, [page]);

  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.header}>
          <h1>Contact Us</h1>
        </div>
        <div className={styles.faq__table__wrapper}>
          <div className={styles.table__wrapper}>
            <Table borderless="true">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>S.No</th>
                  <th style={{ width: "15%" }}>Name</th>
                  <th style={{ width: "15%" }}>Email</th>
                  <th style={{ width: "15%" }}>Phone</th>
                  <th style={{ width: "15%" }}>Website</th>
                  <th style={{ width: "20%" }}>Message</th>
                  <th style={{ width: "15%" }}>Created At</th>
                </tr>
              </thead>

              {isLoading ? (
                <TableSkeleton rowsCount={recordsLimit} colsCount={7} />
              ) : (
                <tbody>
                  {data?.length == 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <NoData text="No Contact Found" />
                      </td>
                    </tr>
                  ) : (
                    data?.map((e, i) => (
                      <tr
                        className="c-p"
                        key={i}
                        onClick={() => {
                          setIsDetailsModalOpen(true);
                          setDetailModalData(e);
                        }}
                      >
                        <td style={{ width: "5%" }}>{i + 1}</td>
                        <td className="t-t-c" style={{ width: "15%" }}>
                          {e?.name}
                        </td>
                        <td style={{ width: "15%" }}>{e?.email}</td>
                        <td style={{ width: "15%" }}>{e?.phoneNo}</td>
                        <td style={{ width: "15%" }}>{e?.website}</td>
                        <td style={{ width: "20%" }}>{e?.message}</td>
                        <td style={{ width: "15%" }}>
                          {moment(e?.createdAt).format("DD MMM YYYY hh:mm A")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              )}
            </Table>
          </div>
       

          {!isLoading && data?.length > 0 && (
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

      {isDetailsModalOpen && (
        <ContactUsDetailModal
          show={isDetailsModalOpen}
          setShow={setIsDetailsModalOpen}
          data={detailModalData}
        />
      )}
    </SidebarSkeleton>
  );
};

export default ContactUs;
