import React from "react";
import moment from "moment/moment";
import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
//Components
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import styles from "./WhyChooseUsCrud.module.css";
import { Button } from "../../Components/Button/Button";
import TableSkeleton from "../../Components/TableSkeletonBootstrap";
import {
  apiHeader,
  BaseURL,
  CreateFormData,
  imageUrl,
  recordsLimit,
} from "../../config/apiUrl";
import NoData from "../../Components/NoData/NoData";
import {  Get, Patch, Post } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AddOrEditWhyChooseUsModal from "../../modals/AddOrEditWhyChooseUsModal";

const WhyChooseUsCrud = () => {
  const { accessToken } = useSelector((state) => state.authReducer);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  // Get Faqs
  const getData = async () => {
    setIsLoading(true);
    const response = await Get(BaseURL(`why-choose-us`), accessToken);
    if (response !== undefined) {
      setData(response?.data.data);
    }
    setIsLoading(false);
  };
  // Add or Edit Data

  const addOrEditData = async (e) => {
    const url = BaseURL(
      selectedItem ? `why-choose-us/${selectedItem?._id}` : "why-choose-us"
    );
    const apiFunc = selectedItem ? Patch : Post;
    const formData = await CreateFormData(e);

    const response = await apiFunc(url, formData, apiHeader(accessToken, true));
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
        `Why Choose Us ${selectedItem ? "edited" : "created"} successfully`
      );
      setData(newData);
      setIsModalOpen("");
    }
  };
  // Delete FAQ

  useEffect(() => {
    getData();
  }, []);

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
          <h1>Why Choose Us</h1>
          <div className={styles.headerRight}>
            {data?.length < 3 && (
              <Button
                label={"+ Why Choose Us"}
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
                  <th style={{ width: "10%" }}>Icon</th>
                  <th style={{ width: "20%" }}>Title </th>
                  <th style={{ width: "30%" }}>Description</th>
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
                        <NoData text="No Why Choose Us Data Found" />
                      </td>
                    </tr>
                  ) : (
                    data?.map((e, i) => (
                      <tr>
                        <td style={{ width: "10%" }}>
                          <div className={styles.imgDiv}>
                            <img src={imageUrl(e?.logo)} />
                          </div>
                        </td>
                        <td
                          style={{ width: "20%", textTransform: "capitalize" }}>
                          {e?.title}
                        </td>
                        <td style={{ width: "30%" }}>{e?.description}</td>
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
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              )}
            </Table>
          </div>
        </div>
      </div>
      {isModalOpen == "add-or-edit" && (
        <AddOrEditWhyChooseUsModal
          show={isModalOpen == "add-or-edit"}
          setShow={() => setIsModalOpen("")}
          data={selectedItem}
          onClick={addOrEditData}
        />
      )}
    </SidebarSkeleton>
  );
};

export default WhyChooseUsCrud;
