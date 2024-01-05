import React from "react";
import { useEffect, useState } from "react";
import styles from "./Rating.module.css";
//Components
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import SearchInput from "../../Components/SearchInput";
import { DropDown } from "../../Components/DropDown/DropDown";
import PaginationComponent from "../../Components/PaginationComponent";
import { BaseURL, imageUrl, recordsLimit } from "../../config/apiUrl";
import useDebounce from "../../CustomHooks/useDebounce";
import { Button } from "../../Components/Button/Button";
import ToggleListCardView from "../../Components/ToggleListCardView";

//Demo User Data
import NoData from "../../Components/NoData/NoData";
import { Table } from "react-bootstrap";
import TableSkeleton from "../../Components/TableSkeletonBootstrap";
import { EmptyProfile } from "../../constant/imagePath";
import { ratingFilterOptions } from "../../constant/staticData";
import { useSelector } from "react-redux";
import { Get } from "../../Axios/AxiosFunctions";
import ServiceProviderDetailModal from "../../modals/ServiceProviderDetailModal";
import RatingCard from "../../Components/RatingCard";
import { Loader } from "../../Components/Loader";
let isInitialRender = true;

const Rating = () => {
  const { accessToken } = useSelector((state) => state.authReducer);

  const [user, setUser] = useState([]);

  const [listView, setlistView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = React.useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [totalRatings, setTotalRatings] = useState(0);
  const debounceVal = useDebounce(searchInput, 500);
  const [filter, setFilter] = useState(ratingFilterOptions[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const getRating = async (pg = page, status = filter.value) => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(
        `users/rating?status=${status}&search=${searchInput}&page=${page}&limit=${recordsLimit}`
      ),
      accessToken
    );
    setIsLoading(false);
    if (response !== undefined) {
      setUser(response?.data.data.filter((item) => item.userRating !== "none"));
      setTotalRatings(response?.data.totalCount);
    }
  };

  useEffect(() => {
    getRating();
  }, [page]);

  useEffect(() => {
    if (!isInitialRender) {
      setPage(1);
      getRating(1);
    }
    isInitialRender = false;
  }, [debounceVal]);

  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.header}>
          <h1>Rating</h1>
          <div className={styles.headerRight}>
            <SearchInput value={searchInput} setter={setSearchInput} />
            <DropDown
              value={filter}
              setter={(e) => {
                setPage(1);
                setFilter(e);
                getRating(1, e?.value);
              }}
              options={ratingFilterOptions}
              placeholder="Filter"
              customStyle={{
                backgroundColor: "var(--clr-secondary)",
                color: "var(--clr-font-inverted)",
                fontFamily: "var(--ff-poppins-semibold)",
                height: "50px",
                width: "160px",
              }}
              indicatorColor={"white"}
            />
          </div>
        </div>
        {user.length > 0 && (
          <div className={styles.listToggle}>
            <ToggleListCardView toggleState={listView} setter={setlistView} />
          </div>
        )}
        {isLoading ? (
          <Loader className={styles.loader} />
        ) : user.length > 0 ? (
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
                    {user?.map((item) => (
                      <tr>
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
                          </div>
                        </td>
                        {item.userRating !== "null" && (
                          <div
                            className={styles.userCard__badge}
                            data-badge={item?.userRating.replace(/-/g, " ")}
                          ></div>
                        )}
                      </tr>
                    ))}
                  </tbody>
                )}
              </Table>
            </div>
          ) : (
            <div className={styles.userCard__wrapper}>
              {user.map((item, index) => (
                <RatingCard
                  key={index}
                  viewProfileClick={() => {
                    setSelectedItem(item);
                    setIsModalOpen(true);
                  }}
                  item={item}
                  isShowBadge={true}
                />
              ))}
            </div>
          )
        ) : (
          <NoData text="No Rating Available" />
        )}
      </div>
      {!isLoading && user.length > 0 && (
        <div className={[styles.paginationDiv]}>
          <PaginationComponent
            totalPages={Math.ceil(totalRatings / recordsLimit)}
            currentPage={page}
            setCurrentPage={setPage}
            defaultActiveColor="var(--clr-primary)"
          />
        </div>
      )}
      <ServiceProviderDetailModal
        show={isModalOpen}
        setShow={() => setIsModalOpen(false)}
        data={selectedItem}
        setData={setSelectedItem}
        serviceProviders={user}
        setServiceProviders={setUser}
        filter={filter}
      />
    </SidebarSkeleton>
  );
};

export default Rating;
