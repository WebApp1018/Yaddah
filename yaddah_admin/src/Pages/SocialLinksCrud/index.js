import React from "react";
import moment from "moment/moment";
import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
//Components
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import styles from "./SocialLinksCrud.module.css";
import { Button } from "../../Components/Button/Button";
import TableSkeleton from "../../Components/TableSkeletonBootstrap";
import { apiHeader, BaseURL, recordsLimit } from "../../config/apiUrl";
import NoData from "../../Components/NoData/NoData";
import { Delete, Get, Patch, Post } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import PaginationComponent from "../../Components/PaginationComponent";
import AreYouSureModal from "../../modals/AreYouSureModal";
import { toast } from "react-toastify";
import AddOrEditSocialLinkModal from "../../modals/AddOrEditSocialLinkModal";

const SocialLinksCrud = () => {
  const { accessToken } = useSelector((state) => state.authReducer);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState("");
  const [isModalLoading, setIsModalLoading] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  // Get Faqs
  const getData = async () => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(`social-link?page=${page}&limit=${recordsLimit}`),
      accessToken
    );
    if (response !== undefined) {
      setData(response?.data.data);
      setTotalCount(response?.data?.totalCount);
    }
    setIsLoading(false);
  };
  // Add or Edit Data

  const addOrEditData = async (e) => {
    const url = BaseURL(
      selectedItem ? `social-link/${selectedItem?._id}` : "social-link"
    );
    const apiFunc = selectedItem ? Patch : Post;

    const response = await apiFunc(url, e, apiHeader(accessToken));
    if (response !== undefined) {
      const newData = [...data];
      if (selectedItem) {
        newData?.splice(
          newData?.findIndex((item) => item?._id == response?.data?.data?._id),
          1,
          response?.data?.data
        );
      } else {
        newData?.unshift(response?.data?.data);
      }
      toast.success(
        `Social Link ${selectedItem ? "edited" : "created"} successfully`
      );
      setData(newData);
      setIsModalOpen("");
    }
  };
  // Delete FAQ
  const deleteSocialLink = async () => {
    setIsModalLoading(true);
    const response = await Delete(
      BaseURL(`social-link/${selectedItem?._id}`),
      null,
      apiHeader(accessToken)
    );
    if (response !== undefined) {
      const newData = [...data];
      newData?.splice(
        newData?.findIndex((item) => item?._id == response?.data?.data?._id),
        1
      );
      setData(newData);
      setIsModalOpen("");
      toast.success("Social Link deleted successfully");
    }
    setIsModalLoading(false);
  };

  useEffect(() => {
    getData();
  }, [page]);

  return (
    <SidebarSkeleton>
      <style>{`
      .${styles.table__wrapper} tbody {
                height:calc(100vh - 450px);
                overflow-y:auto;
      }
      `}</style>
      <div className={styles.content__wrapper}>
        <div className={styles.header}>
          <h1>Social Links</h1>
          <div className={styles.headerRight}>
            {data?.length < 5 && (
              <Button
                label={"+ ADD Social Links"}
                className={styles.DownloadReport}
                customStyle={{
                  backgroundColor: "var(--clr-secondary)",
                  color: "var(--clr-font-inverted)",
                  fontFamily: "var(--ff-poppins-semibold)",
                  border: "none",
                }}
                onClick={() => {
                  setSelectedItem(null);
                  setIsModalOpen("add-or-edit");
                }}
              />
            )}
          </div>
        </div>
        <div className={styles.faq__table__wrapper}>
          <div className={styles.table__wrapper}>
            <Table borderless="true">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>S.No</th>
                  <th style={{ width: "20%" }}>Platform Type</th>
                  <th style={{ width: "30%" }}>Link</th>
                  <th style={{ width: "10%" }}>Created At</th>
                  <th style={{ width: "30%" }}>Action</th>
                </tr>
              </thead>

              {isLoading ? (
                <TableSkeleton rowsCount={recordsLimit} colsCount={5} />
              ) : (
                <tbody>
                  {data?.length == 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <NoData text="No Social Links Found" />
                      </td>
                    </tr>
                  ) : (
                    data?.map((e, i) => (
                      <tr>
                        <td style={{ width: "10%" }}>{i + 1}</td>
                        <td
                          style={{ width: "20%", textTransform: "capitalize" }}>
                          {e?.platformType}
                        </td>
                        <td style={{ width: "30%" }}>{e?.link}</td>
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
                              setIsModalOpen("add-or-edit");
                            }}>
                            Edit
                          </Button>
                          <Button
                            className={["btn__solid", styles.btn__primary].join(
                              " "
                            )}
                            onClick={() => {
                              setSelectedItem(e);
                              setIsModalOpen("delete");
                            }}>
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
      {isModalOpen == "add-or-edit" && (
        <AddOrEditSocialLinkModal
          show={isModalOpen == "add-or-edit"}
          setShow={() => setIsModalOpen("")}
          data={selectedItem}
          onClick={addOrEditData}
          removeAddedFilter={data?.map((item) => item?.platformType)}
        />
      )}
      {isModalOpen == "delete" && (
        <AreYouSureModal
          show={isModalOpen == "delete"}
          setShow={() => setIsModalOpen("")}
          isApiCall={isModalLoading}
          onClick={deleteSocialLink}
          subTitle={"Do you want to delete this social link?"}
        />
      )}
    </SidebarSkeleton>
  );
};

export default SocialLinksCrud;
