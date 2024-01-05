import styles from "./AllServiceProviders.module.css";
import React from "react";
import { useState, useEffect } from "react";
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

//DemoUserData
import { serviceProviderfilterOptions } from "../../constant/staticData";
import NoData from "../../Components/NoData/NoData";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import { Loader } from "../../Components/Loader";
import { toast } from "react-toastify";
import TableSkeleton from "../../Components/TableSkeletonBootstrap";
import { EmptyProfile } from "../../constant/imagePath";
import { Table } from "react-bootstrap";
import ServiceProviderDetailModal from "../../modals/ServiceProviderDetailModal";
import RejectServiceProviderModal from "../../modals/RejectServiceProviderModal";
import { useLocation } from "react-router-dom";
import { AiFillCheckCircle } from "react-icons/ai";

let isInitialRender = true;
const AllServiceProvider = () => {
  const { accessToken } = useSelector((state) => state.authReducer);
  const status = useLocation()?.state?.status;
  const [listView, setlistView] = useState(false);
  const [serviceProvider, setServiceProvider] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = React.useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [totalServiceProvider, setTotalServiceProvider] = useState(0);
  const debounceVal = useDebounce(searchInput, 500);
  const [innerLoading, setInnerLoading] = useState("");
  const [isActive, setIsActive] = useState("");
  const [isModalOpen, setIsModalOpen] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const [filter, setFilter] = useState(
    serviceProviderfilterOptions?.find((item) => item?.value == status) ||
      serviceProviderfilterOptions[0]
  );

  // getServiceProviders
  const getServiceProviders = async (pg = page, status = filter?.value) => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(
        `users/admin/all?search=${searchInput}&role=service-provider&status=${status}&page=${pg}&limit=${recordsLimit}`
      ),
      accessToken
    );
    setIsLoading(false);
    if (response !== undefined) {
      setServiceProvider(response?.data.data);
      setTotalServiceProvider(response?.data.totalCount);
    }
  };

  const acceptRejectStatus = async (item, status, desc) => {
    const params = {
      status,
      ...(status == "rejected" && { reason: desc }),
    };
    setInnerLoading(item?._id);
    setIsActive(status);
    const response = await Patch(
      BaseURL(`users/admin/accept-reject-user/${item._id}`),
      params,
      apiHeader(accessToken)
    );
    if (response != undefined) {
      const newData = [...serviceProvider];

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
          newData?.findIndex((element) => element?._id == item?._id),
          1
        );
      }
      setServiceProvider(newData);
      toast.success(
        `Service Provider ${
          response?.data?.data?.status === "accepted" ? "Accepted" : "Rejected"
        } Successfully`
      );
    }
    setInnerLoading("");
    setIsModalOpen("");
  };
  const activateDeactivateStatus = async (item, status) => {
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
      const newData = [...serviceProvider];

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
      setServiceProvider(newData);

     
      toast.success(
        `Service Provider ${
          response?.data?.data?.isBlockedByAdmin ? "Deactivated" : "Activated"
        } Successfully`
      );
    }
    setIsModalOpen("");
    setInnerLoading("");
    setIsActive("");
  };
  useEffect(() => {
    getServiceProviders();
  }, [page]);

  useEffect(() => {
    if (!isInitialRender) {
      setPage(1);
      getServiceProviders(1);
    }
    isInitialRender = false;
  }, [debounceVal]);

  
  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.__header}>
          <h3>Service Provider Management</h3>
          <div className={styles.headerRight}>
            <SearchInput value={searchInput} setter={setSearchInput} />
            <DropDown
              value={filter}
              setter={(e) => {
                setPage(1);
                setFilter(e);
                getServiceProviders(1, e?.value);
              }}
              options={serviceProviderfilterOptions}
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
        {serviceProvider.length > 0 && (
          <div className={styles.listToggle}>
            <ToggleListCardView toggleState={listView} setter={setlistView} />
          </div>
        )}
        {isLoading ? (
          <Loader className={styles.loader} />
        ) : serviceProvider?.length > 0 ? (
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
                    {serviceProvider?.map((item, index) => {
                      const isEmailVerified =
                        item?.role === "service-provide" &&
                        item?.isEmailVerified;
                      return (
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
                          <td>
                            {item?.email}{" "}
                            {isEmailVerified && (
                              <span>
                                <AiFillCheckCircle fill="#00acee" size={16} />
                              </span>
                            )}
                          </td>
                          <td> {item?.status} </td>

                          <td>
                            {item?.status === "pending" && (
                              <div className={styles.userCard__button__wrapper}>
                                <Button
                                  onClick={() => {
                                    acceptRejectStatus(item, "accepted");
                                  }}
                                  label={
                                    innerLoading === item?._id &&
                                    isActive === "accepted"
                                      ? "wait..."
                                      : "Accept"
                                  }
                                  className={styles.userCard__button}
                                />
                                <Button
                                  onClick={() => {
                                    setIsModalOpen("reject");
                                    setSelectedItem(item);
                                  }}
                                  label={
                                    innerLoading === item?._id &&
                                    isActive === "rejected"
                                      ? "wait..."
                                      : "Reject"
                                  }
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
                                  className={styles.userCard__button}
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setIsModalOpen("detail");
                                  }}
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
                                    setIsModalOpen("detail");
                                  }}
                                  className={styles.userCard__button}
                                >
                                  View Profile
                                </Button>
                                {item?.isBlockedByAdmin ? (
                                  <Button
                                    onClick={() => {
                                      activateDeactivateStatus(item, false);
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
                                      activateDeactivateStatus(item, true);
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
                      );
                    })}
                  </tbody>
                )}
              </Table>
            </div>
          ) : (
            <div className={styles.userCard__wrapper}>
              {serviceProvider?.map((item, index) => (
                <UserCard
                  item={item}
                  viewProfileClick={() => {
                    setSelectedItem(item);
                    setIsModalOpen("detail");
                  }}
                  onAccept={async () => {
                    await acceptRejectStatus(item, "accepted");
                  }}
                  onReject={async () => {
                    setSelectedItem(item);
                    setIsModalOpen("reject");
                  }}
                  activateDeactivateStatus={async (status) => {
                    await activateDeactivateStatus(item, status);
                  }}
                />
              ))}
            </div>
          )
        ) : (
          <NoData text="No Service Provider Available" />
        )}
      </div>

      {!isLoading && serviceProvider?.length > 0 && (
        <div className={[styles.paginationDiv]}>
          <PaginationComponent
            totalPages={Math.ceil(totalServiceProvider / recordsLimit)}
            currentPage={page}
            setCurrentPage={setPage}
            defaultActiveColor="var(--clr-primary)"
          />
        </div>
      )}
      {isModalOpen == "detail" && (
        <ServiceProviderDetailModal
          show={isModalOpen == "detail"}
          setShow={() => setIsModalOpen("")}
          data={selectedItem}
          setData={setSelectedItem}
          serviceProviders={serviceProvider}
          setServiceProviders={setServiceProvider}
          filter={filter}
          ratingPage={false}
        />
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
    </SidebarSkeleton>
  );
};

export default AllServiceProvider;
