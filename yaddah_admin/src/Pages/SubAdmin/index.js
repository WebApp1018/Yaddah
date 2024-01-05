import React from "react";
import styles from "./SubAdmin.module.css";
import { useState, useEffect } from "react";
import { apiHeader, BaseURL, imageUrl } from "../../config/apiUrl";
//Components
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import UserCard from "../../Components/UserCard";
import SearchInput from "../../Components/SearchInput";
import { DropDown } from "../../Components/DropDown/DropDown";
import { Button } from "../../Components/Button/Button";
//DemoUserData
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../../Components/PaginationComponent";
import { recordsLimit } from "../../config/apiUrl";
import useDebounce from "../../CustomHooks/useDebounce";
import ToggleListCardView from "../../Components/ToggleListCardView";

//DemoUserData
import NoData from "../../Components/NoData/NoData";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import { subAdminFilterOptions } from "../../constant/staticData";
import { Loader } from "../../Components/Loader";
import SubAdminDetailModal from "../../modals/SubAdminDetailModal";
import { toast } from "react-toastify";
import TableSkeleton from "../../Components/TableSkeletonBootstrap";
import { Table } from "react-bootstrap";
import { EmptyProfile } from "../../constant/imagePath";
let isInitialRender = true;

const SubAdmin = () => {
  const { accessToken } = useSelector((state) => state.authReducer);

  const navigate = useNavigate();
  const [listView, setlistView] = useState(false);
  const [user, setUser] = useState([]);
  const [status, setStatus] = useState(subAdminFilterOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [innerLoading, setInnerLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [page, setPage] = React.useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [totalSubAdmins, setTotalSubAdmins] = useState(0);
  const debounceVal = useDebounce(searchInput, 500);

  const getSubAdmin = async (pg = page, sts = status?.value) => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(
        `users/admin/all?status=${sts}&role=sub-admin&search=${searchInput}&page=${pg}&limit=${recordsLimit}`
      ),
      accessToken
    );

    if (response !== undefined) {
      setUser(response?.data.data);
      setTotalSubAdmins(response?.data.totalCount);
    }
    setIsLoading(false);
  };

  const activateDeactivateStatus = async (item, index, sts) => {
    const params = {
      status: sts,
    };
    setInnerLoading(item?._id);
    const response = await Patch(
      BaseURL(`users/admin/block-unblock-user/${item._id}`),
      params,
      apiHeader(accessToken)
    );
    if (response) {
      const newData = [...user];
      if (status?.value == "all") {
        newData?.splice(
          newData?.findIndex((item) => item?._id == response?.data?.data?._id),
          1,
          response?.data?.data
        );
      } else {
        newData?.splice(
          newData?.findIndex((item) => item?._id == response?.data?.data?._id),
          1
        );
      }
      setUser(newData);
      toast.success(
        `Sub Admin ${
          response?.data?.data?.isBlockedByAdmin ? "Deactivated" : "Activated"
        } Successfully`
      );
    }
    setInnerLoading("");
  };

  useEffect(() => {
    getSubAdmin();
  }, [page]);

  useEffect(() => {
    if (!isInitialRender) {
      setPage(1);
      getSubAdmin(1);
    }
    isInitialRender = false;
  }, [debounceVal]);

  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.__header}>
          <h3>Sub Admin Management</h3>
          <div className={styles.headerRight}>
            <SearchInput value={searchInput} setter={setSearchInput} />
            <DropDown
              value={status}
              setter={(e) => {
                setPage(1);
                setStatus(e);
                getSubAdmin(1, e?.value);
              }}
              options={subAdminFilterOptions}
              placeholder="Filter"
              customStyle={{
                backgroundColor: "var(--clr-secondary)",
                color: "var(--clr-font-inverted)",
                fontFamily: "var(--ff-poppins-semibold)",
                height: "50px",
                width: "170px",
              }}
              indicatorColor={"white"}
            />
            <Button
              label={"Create New Sub Admin"}
              className={styles.DownloadReport}
              customStyle={{
                backgroundColor: "var(--clr-secondary)",
                color: "var(--clr-font-inverted)",
                fontFamily: "var(--ff-poppins-semibold)",
                border: "none",
              }}
              onClick={() => navigate("/create-sub-admin")}
            />
          </div>
        </div>
        <div className={styles.listToggle}>
          <ToggleListCardView toggleState={listView} setter={setlistView} />
        </div>
        {isLoading ? (
          <Loader className={styles.loader} />
        ) : user?.length > 0 ? (
          listView ? (
            <div className={styles.__content}>
              <Table responsive="xxl" borderless="true">
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th> User Name </th>
                    <th> Full Name </th>
                    <th> Email </th>
                    <th>Status</th>
                    <th> Action </th>
                  </tr>
                </thead>

                {isLoading ? (
                  <TableSkeleton rowsCount={10} colsCount={5} />
                ) : (
                  <tbody>
                    {user?.map((item, index) => (
                      <tr key={index}>
                        <td className={styles.userCard__button__wrapper}>
                          {/* <div className={styles.image__wrapper}> */}
                          <img
                            className={styles.image__wrapper}
                            src={imageUrl(item?.photo)}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = EmptyProfile;
                            }}
                            alt=""
                          />
                          {/* </div> */}
                        </td>
                        <td>{item?.userName}</td>
                        <td> {item?.fullName || "Not Added Yet"} </td>
                        <td> {item?.email} </td>
                        <td> {item?.status} </td>

                        <td>
                          {/* {item?.status === "accepted" && ( */}
                          <div className={styles.userCard__button__wrapper}>
                            <Button
                              onClick={() => {
                                setSelectedItem(item);
                                setIsModalOpen(true);
                              }}
                              className={styles.userCard__button}
                            >
                              View Profile
                            </Button>
                            {item?.isBlockedByAdmin ? (
                              <Button
                                onClick={() => {
                                  activateDeactivateStatus(item, index, false);
                                }}
                                label={
                                  innerLoading === item?._id
                                    ? "Wait.."
                                    : "Activate"
                                }
                                className={[
                                  styles.userCard__button,
                                  styles.userCard__button__bordered,
                                ].join(" ")}
                              />
                            ) : (
                              <Button
                                onClick={() => {
                                  activateDeactivateStatus(item, index, true);
                                }}
                                label={
                                  innerLoading === item?._id
                                    ? "Wait.."
                                    : "Deactivate"
                                }
                                className={[
                                  styles.userCard__button,
                                  styles.userCard__button__bordered,
                                ].join(" ")}
                              />
                            )}
                          </div>
                          {/* )} */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </Table>
            </div>
          ) : (
            <div className={styles.userCard__wrapper}>
              {user?.map((item, index) => (
                <UserCard
                  flag={"subAdmin"}
                  item={item}
                  viewProfileClick={() => {
                    setSelectedItem(item);
                    setIsModalOpen(true);
                  }}
                  activateDeactivateStatus={async (status) => {
                    await activateDeactivateStatus(item, index, status);
                  }}
                />
              ))}
            </div>
          )
        ) : (
          <NoData text="No Sub Admin Available" />
        )}
      </div>

      {!isLoading && user?.length > 0 && (
        <div className={[styles.paginationDiv]}>
          <PaginationComponent
            totalPages={Math.ceil(totalSubAdmins / recordsLimit)}
            currentPage={page}
            setCurrentPage={setPage}
            defaultActiveColor="var(--clr-primary)"
          />
        </div>
      )}
      <SubAdminDetailModal
        show={isModalOpen}
        setShow={() => setIsModalOpen(false)}
        data={selectedItem}
      />
    </SidebarSkeleton>
  );
};

export default SubAdmin;
