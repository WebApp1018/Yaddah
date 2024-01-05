import React from "react";
import { useState, useEffect } from "react";
import styles from "./MyServices.module.css";
import SidebarSkeleton from "../../components/SidebarSkeleton";
//Component
import SearchInput from "../../components/SearchInput";
import DropDown from "../../components/DropDown";
import { Button } from "../../components/Button/Button";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { apiHeader, BaseURL } from "../../config/apiUrl";
import NoData from "../../components/NoData/NoData";
import PaginationComponent from "../../components/PaginationComponent";
import useDebounce from "../../CustomHooks/useDebounce";
import { recordsLimit } from "../../config/apiUrl";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { staffFilterOptions } from "../../constant/staticData";
import { Loader } from "../../components/Loader";
import StaffDetailModal from "../../Modals/StaffDetailModal";
import { toast } from "react-toastify";
import { Table } from "react-bootstrap";
import TableSkeleton from "../../components/TableSkeletonBootstrap";
import { BiFilterAlt } from "react-icons/bi";

let isInitialRender = true;

const MyServices = () => {
  const navigate = useNavigate();
  const { accessToken, user } = useSelector((state) => state.authReducer);

  const [filter, setFilter] = useState(staffFilterOptions[0]);
  const [page, setPage] = React.useState(1);
  const [searchInput, setSearchInput] = useState("");
  const debounceVal = useDebounce(searchInput, 500);
  const [data, setData] = useState([]);
  const [totalStaff, setTotalStaff] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [tableLoading, setTableLoading] = useState("");

  const getServices = async (pg = page, status = filter?.value) => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(
        `service/service-provider/all?status=${status}&page=${pg}&limit=${recordsLimit}&search=${searchInput}`
      ),
      accessToken
    );
    setIsLoading(false);
    if (response !== undefined) {
      setData(response?.data.data);
      setTotalStaff(response?.data.totalRecords);
    }
  };
  useEffect(() => {
    getServices();
  }, [page]);

  useEffect(() => {
    if (!isInitialRender) {
      setPage(1);
      getServices(1);
    }
    isInitialRender = false;
  }, [debounceVal]);

  async function activeDeactivateService(e) {
    const url = BaseURL(`service/activate-deactivate/${e?._id}`);
    const response = await Patch(
      url,
      { status: !e?.isActive },
      apiHeader(accessToken)
    );
    if (response) {
      const newData = [...data];

      if (filter?.value == "all") {
        newData?.splice(
          newData?.findIndex((item) => item?._id == response?.data?.data?._id),
          1,
          {
            ...newData?.find((item) => item?._id == response?.data?.data?._id),
            isActive: !e?.isActive,
          }
        );
      } else {
        newData?.splice(
          newData?.findIndex((item) => item?._id == response?.data?.data?._id),
          1
        );
      }
      setData(newData);
      toast.success(
        `Service ${e?.isActive ? "deactivated" : "activated"} successfully `
      );
    }
  }

  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.header}>
          <h1>My Services</h1>
          <div className={styles.headerRight}>
            <SearchInput setter={setSearchInput} value={searchInput} />
            <Button
              label={"+Add New Service"}
              className={styles.DownloadReport}
              customStyle={{
                backgroundColor: "var(--clr-secondary)",
                color: "var(--clr-font-inverted)",
                fontFamily: "var(--ff-poppins-semibold)",
                padding: "16px",
              }}
              onClick={() => navigate("/create-service")}
            />
            <DropDown
              value={filter}
              setter={(e) => {
                setPage(1);
                setFilter(e);
                getServices(1, e?.value);
              }}
              options={staffFilterOptions}
              placeholder="Filter"
              customStyle={{
                backgroundColor: "var(--clr-secondary)",
                color: "var(---white-color)",
                fontFamily: "var(--ff-poppins-semibold)",
                height: "52px",
                width: "170px",
                borderRadius: "8px",
                border: "none",
              }}
              RightIcon={<BiFilterAlt />}
              indicatorColor={"white"}
              textColor={"var(--clr-font-inverted)"}
            />
          </div>
        </div>
        <div>
          {isLoading ? (
            <Loader className={styles.loader} />
          ) : data?.length > 0 ? (
            <>
              <div className={styles.__content}>
                <Table responsive="xxl" borderless="true">
                  <thead>
                    <tr>
                      <th>Service Name </th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  {isLoading ? (
                    <TableSkeleton rowsCount={10} colsCount={5} />
                  ) : (
                    <tbody>
                      {data?.map((item) => (
                        <tr>
                          <td>{item?.name}</td>
                          <td>{item?.category?.name}</td>
                          <td> ${item?.price} </td>
                          <td> {item?.isActive ? "Active" : "Deactive"} </td>

                          <td>
                            <div className={styles.userCard__button__wrapper}>
                              <Button
                                label={
                                  tableLoading == item?._id
                                    ? "Wait..."
                                    : !item?.isActive
                                    ? "Activate"
                                    : "Deactivate"
                                }
                                className={styles.userCard__button}
                                onClick={async () => {
                                  setTableLoading(item?._id);
                                  await activeDeactivateService(item);
                                  setTableLoading("");
                                }}
                              />
                              <Button
                                label={"Edit"}
                                className={styles.userCard__button_green}
                                onClick={() => {
                                  navigate(`/edit-service/${item?._id}`);
                                }}
                              />
                              <Button
                                className={styles.userCard__button_green}
                                label={"View Details"}
                                // className={[
                                //   styles.userCard__button,
                                //   styles.userCard__button__bordered,
                                // ].join(" ")}
                                onClick={() => {
                                  navigate(`/service/${item?._id}`);
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </Table>
              </div>
            </>
          ) : (
            <NoData text="No Services Found" className={styles.loader} />
          )}
        </div>
      </div>
      {!isLoading && data.length > 0 && (
        <div className={[styles.paginationDiv]}>
          <PaginationComponent
            totalPages={Math.ceil(totalStaff / recordsLimit)}
            currentPage={page}
            setCurrentPage={setPage}
            defaultActiveColor="var(--clr-primary)"
          />
        </div>
      )}
      <StaffDetailModal
        show={isModalOpen}
        setShow={() => setIsModalOpen(false)}
        data={selectedItem}
      />
    </SidebarSkeleton>
  );
};

export default MyServices;
