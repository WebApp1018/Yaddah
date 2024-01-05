import React from "react";
import moment from "moment/moment";
import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
//Components
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import styles from "./faqs.module.css";
import { Button } from "../../Components/Button/Button";
import TableSkeleton from "../../Components/TableSkeletonBootstrap";
import { apiHeader, BaseURL, recordsLimit } from "../../config/apiUrl";
import NoData from "../../Components/NoData/NoData";
import { Delete, Get, Patch, Post } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import PaginationComponent from "../../Components/PaginationComponent";
import AddOrEditFaqModal from "../../modals/AddOrEditFaqModal";
import AreYouSureModal from "../../modals/AreYouSureModal";
import { toast } from "react-toastify";

const Faqs = () => {
  const { accessToken } = useSelector((state) => state.authReducer);
  const [faq, setFaq] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState("");
  const [isModalLoading, setIsModalLoading] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  // Get Faqs
  const getFaq = async () => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(`faqs/admin/all?page=${page}&limit=${recordsLimit}`),
      accessToken
    );
    if (response !== undefined) {
      setFaq(response?.data.data);
      setTotalCount(response?.data?.totalCount);
    }
    setIsLoading(false);
  };
  // Add or Edit FAQ

  const addOrEditFaq = async (e) => {
    const url = BaseURL(
      selectedItem ? `faqs/${selectedItem?._id}` : "faqs/admin/create"
    );
    const apiFunc = selectedItem ? Patch : Post;

    const response = await apiFunc(url, e, apiHeader(accessToken));
    if (response !== undefined) {
      const newFaqs = [...faq];
      if (selectedItem) {
        newFaqs?.splice(
          newFaqs?.findIndex((item) => item?._id == response?.data?.data?._id),
          1,
          response?.data?.data
        );
      } else {
        newFaqs?.unshift(response?.data?.data);
      }
      toast.success(`FAQ ${selectedItem ? "edited" : "created"} successfully`);
      setFaq(newFaqs);
      setIsModalOpen("");
    }
  };
  // Delete FAQ
  const deleteFaq = async () => {
    setIsModalLoading(true);
    const response = await Delete(
      BaseURL(`faqs/${selectedItem?._id}`),
      null,
      apiHeader(accessToken)
    );
    if (response !== undefined) {
      const newFaqs = [...faq];
      newFaqs?.splice(
        newFaqs?.findIndex((item) => item?._id == response?.data?.data?._id),
        1
      );
      setFaq(newFaqs);
      setIsModalOpen("");
      toast.success("FAQ deleted successfully");
    }
    setIsModalLoading(false);
  };

  useEffect(() => {
    getFaq();
  }, [page]);

  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.header}>
          <h1>FAQs</h1>
          <div className={styles.headerRight}>
            <Button
              label={"+ ADD FAQS"}
              className={styles.DownloadReport}
              customStyle={{
                backgroundColor: "var(--clr-secondary)",
                color: "var(--clr-font-inverted)",
                fontFamily: "var(--ff-poppins-semibold)",
                border: "none",
              }}
              onClick={() => {
                setSelectedItem(null);
                setIsModalOpen("faq");
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
                  <th style={{ width: "20%" }}>Question</th>
                  <th style={{ width: "30%" }}>Answer</th>
                  <th style={{ width: "10%" }}>Created At</th>
                  <th style={{ width: "30%" }}>Action</th>
                </tr>
              </thead>

              {isLoading ? (
                <TableSkeleton rowsCount={recordsLimit} colsCount={5} />
              ) : (
                <tbody>
                  {faq?.length == 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <NoData text="No FAQs Found" />
                      </td>
                    </tr>
                  ) : (
                    faq?.map((e, i) => (
                      <tr>
                        <td style={{ width: "10%" }}>{i + 1}</td>
                        <td style={{ width: "20%" }}>{e?.question}</td>
                        <td style={{ width: "30%" }}>{e?.answer}</td>
                        <td style={{ width: "10%" }}>
                          {moment(e?.createdAt).format("DD MMM YYYY hh:mm")}
                        </td>
                        <td style={{ width: "30%" }}>
                          <Button
                            className={[
                              "btn__solid",
                              styles.btn__secondary,
                            ].join(" ")}
                            onClick={() => {
                              setSelectedItem(e);
                              setIsModalOpen("faq");
                            }}
                          >
                            Edit
                          </Button>
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
                    ))
                  )}
                </tbody>
              )}
            </Table>
          </div>

          {!isLoading && faq?.length > 0 && (
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
      {isModalOpen == "faq" && (
        <AddOrEditFaqModal
          show={isModalOpen == "faq"}
          setShow={() => setIsModalOpen("")}
          data={selectedItem}
          onClick={addOrEditFaq}
        />
      )}
      <AreYouSureModal
        show={isModalOpen == "delete"}
        setShow={() => setIsModalOpen("")}
        isApiCall={isModalLoading}
        onClick={deleteFaq}
        subTitle={"Do you want to delete this FAQ?"}
      />
    </SidebarSkeleton>
  );
};

export default Faqs;
