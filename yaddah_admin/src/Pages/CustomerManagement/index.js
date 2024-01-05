import styles from "./CustomerManagement.module.css";
import React from "react";
import { useState, useEffect } from "react";
// import { Get } from "../../Axios/AxiosFunctions";
import { apiHeader, BaseURL, imageUrl } from "../../config/apiUrl";
//Components
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import UserCard from "../../Components/UserCard";
import SearchInput from "../../Components/SearchInput";
import { DropDown } from "../../Components/DropDown/DropDown";
import { Button } from "../../Components/Button/Button";
import PaginationComponent from "../../Components/PaginationComponent";
import { recordsLimit } from "../../config/apiUrl";
import useDebounce from "../../CustomHooks/useDebounce";
import ToggleListCardView from "../../Components/ToggleListCardView";
import { Table } from "react-bootstrap";
import TableSkeleton from "../../Components/TableSkeletonBootstrap";
//DemoUserData
import NoData from "../../Components/NoData/NoData";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import { Loader } from "../../Components/Loader";
import { customerfilterOptions } from "../../constant/staticData";
import { toast } from "react-toastify";
import { EmptyProfile } from "../../constant/imagePath";
import CustomerDetailModal from "../../modals/CustomerDetailModal";
import { useLocation } from "react-router-dom";
import RejectServiceProviderModal from "../../modals/RejectServiceProviderModal";
let isInitialRender = true;

const CustomerManagment = () => {
  const { accessToken } = useSelector((state) => state.authReducer);
  const status = useLocation()?.state?.status;
  const [listView, setlistView] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [filter, setFilter] = useState(
    customerfilterOptions?.find((item) => item?.value == status) ||
      customerfilterOptions[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [innerLoading, setInnerLoading] = useState("");
  const [isActive, setIsActive] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [page, setPage] = React.useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [totalCustomer, setTotalCustomer] = useState(30);
  const debounceVal = useDebounce(searchInput, 500);

  const getCustomers = async (pg = page, status = filter?.value) => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(
        `users/admin/all?search=${searchInput}&role=customer&status=${status}&page=${pg}&limit=${recordsLimit}`
      ),
      accessToken
    );
    setIsLoading(false);
    if (response !== undefined) {
      setCustomer(response?.data.data);
      setTotalCustomer(response?.data.totalCount);
    }
  };

  const acceptRejectStatus = async (item, status, desc) => {
    const params = {
      status,
      ...(status == "rejected" && { reason: desc }),
    };
    setInnerLoading(item._id);
    setIsActive(status);
    const response = await Patch(
      BaseURL(`users/admin/accept-reject-user/${item._id}`),
      params,
      apiHeader(accessToken)
    );
    if (response) {
      const newData = [...customer];

      if (filter?.value == "all") {
        if (status !== "rejected") {
          newData?.splice(
            newData?.findIndex((element) => element?._id == item?._id),
            1,
            response?.data?.data
          );
        } else {
          newData?.splice(
            newData?.findIndex((element) => element?._id == item?._id),
            1
          );
        }
      } else {
        newData?.splice(
          newData?.findIndex((item) => item?._id == response?.data?.data?._id),
          1
        );
      }
      setCustomer(newData);
      toast.success(
        `Customer ${
          response?.data?.data?.status === "accepted" ? "Accepted" : "Rejected"
        } Successfully`
      );
    }
    setInnerLoading("");
    setIsActive("");
    setIsModalOpen("");
  };
  const activateDeactivateStatus = async (item, index, status) => {
    const params = {
      status,
    };
    setInnerLoading(item?._id);
    const response = await Patch(
      BaseURL(`users/admin/block-unblock-user/${item._id}`),
      params,
      apiHeader(accessToken)
    );
    if (response) {
      const newData = [...customer];

      if (filter?.value == "all" || filter?.value == "accepted") {
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
      setCustomer(newData);
      toast.success(
        `Customer ${
          response?.data?.data?.isBlockedByAdmin ? "Deactivated" : "Activated"
        } Successfully`
      );
    }
    setInnerLoading("");
  };
  useEffect(() => {
    getCustomers();
  }, [page, filter]);

  useEffect(() => {
    if (!isInitialRender) {
      setPage(1);
      getCustomers(1);
    }
    isInitialRender = false;
  }, [debounceVal]);

  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.__header}>
          <h3>Customer Management</h3>
          <div className={styles.headerRight}>
            <SearchInput value={searchInput} setter={setSearchInput} />
            <DropDown
              value={filter}
              setter={(e) => {
                setPage(1);
                setFilter(e);
                getCustomers(1, e?.value);
              }}
              options={customerfilterOptions}
              placeholder="Filter"
              customStyle={{
                backgroundColor: "var(--clr-secondary)",
                color: "var(--clr-font-inverted)",
                fontFamily: "var(--ff-poppins-semibold)",
                height: "50px",
                width: "190px",
              }}
              indicatorColor={"white"}
            />
          </div>
        </div>
        {customer.length > 0 && (
          <div className={styles.listToggle}>
            <ToggleListCardView toggleState={listView} setter={setlistView} />
          </div>
        )}

        {/* table View */}
        {isLoading ? (
          <Loader className={styles.loader} />
        ) : customer?.length > 0 ? (
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
                    {customer?.map((item, index) => (
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
                          {item?.status === "pending" && (
                            <div className={styles.userCard__button__wrapper}>
                              <Button
                                label={
                                  innerLoading === item?._id &&
                                  isActive === "accepted"
                                    ? "wait..."
                                    : "Accept"
                                }
                                onClick={() => {
                                  acceptRejectStatus(item, "accepted");
                                }}
                                className={styles.userCard__button}
                              />
                              <Button
                                label={
                                  innerLoading === item?._id &&
                                  isActive === "rejected"
                                    ? "wait..."
                                    : "Reject"
                                }
                                onClick={() => {
                                  acceptRejectStatus(item, "rejected");
                                }}
                                className={[
                                  styles.userCard__button,
                                  styles.userCard__button__bordered,
                                ].join(" ")}
                              />
                            </div>
                          )}
                          {item?.status === "rejected" && (
                            <div className={styles.userCard__button__wrapper}>
                              <Button
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsModalOpen("viewProfile");
                                }}
                                className={styles.userCard__button}
                              >
                                View Profile
                              </Button>
                            </div>
                          )}
                          {item?.status === "accepted" && (
                            <div className={styles.userCard__button__wrapper}>
                              <Button
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsModalOpen("viewProfile");
                                }}
                                className={styles.userCard__button}
                              >
                                View Profile
                              </Button>
                              {item?.isBlockedByAdmin ? (
                                <Button
                                  onClick={() => {
                                    activateDeactivateStatus(
                                      item,
                                      index,
                                      false
                                    );
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
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </Table>
            </div>
          ) : (
            <div className={styles.userCard__wrapper}>
              {customer?.map((item, index) => (
                <UserCard
                  item={item}
                  viewProfileClick={() => {
                    setSelectedItem(item);
                    setIsModalOpen("viewProfile");
                  }}
                  onAccept={async () =>
                    await acceptRejectStatus(item, "accepted")
                  }
                  onReject={async () => {
                    setSelectedItem(item);
                    setIsModalOpen("reject");

                    // await acceptRejectStatus(item, "rejected")
                  }}
                  activateDeactivateStatus={async (status) => {
                    await activateDeactivateStatus(item, index, status);
                  }}
                  isLoading={innerLoading}
                />
              ))}
            </div>
          )
        ) : (
          <NoData text="No Customer Available" />
        )}
      </div>

      {!isLoading && customer.length > 0 && (
        <div className={[styles.paginationDiv]}>
          <PaginationComponent
            totalPages={Math.ceil(totalCustomer / recordsLimit)}
            currentPage={page}
            setCurrentPage={setPage}
            defaultActiveColor="var(--clr-primary)"
          />
        </div>
      )}
      {isModalOpen == "reject" && (
        <RejectServiceProviderModal
          show={isModalOpen == "reject"}
          setShow={() => setIsModalOpen("")}
          onReject={async (e) =>
            await acceptRejectStatus(selectedItem, "rejected", e)
          }
        />
      )}
      <CustomerDetailModal
        show={isModalOpen == "viewProfile"}
        setShow={() => setIsModalOpen(false)}
        data={selectedItem}
      />
    </SidebarSkeleton>
  );
};

export default CustomerManagment;
