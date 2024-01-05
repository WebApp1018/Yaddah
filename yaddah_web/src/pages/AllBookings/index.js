import React, { useState } from "react";
import SidebarSkeleton from "../../components/SidebarSkeleton";
import PaginationComponent from "../../components/PaginationComponent";
import styles from "./AllBookings.module.css";
import SearchInput from "../../components/SearchInput";
import DropDown from "../../components/DropDown";
import { Button } from "../../components/Button/Button";
import { Table } from "react-bootstrap";
import moment from "moment";
import { recordsLimit } from "../../config/apiUrl";
import useDebounce from "../../CustomHooks/useDebounce";
import { Get } from "../../Axios/AxiosFunctions";
import { BaseURL } from "../../config/apiUrl";
import NoData from "../../components/NoData/NoData";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { bookingFilterOptions } from "../../constant/staticData";
import { Loader } from "../../components/Loader";
import { useNavigate, useLocation } from "react-router-dom";
import { BiFilterAlt } from "react-icons/bi";

let isFilterInitialized = true;

function AllBookings() {
  const navigate = useNavigate();
  const locationStatus = useLocation()?.state?.value;
  const { accessToken, user } = useSelector((state) => state?.authReducer);
  const [filter, setFilter] = useState(bookingFilterOptions[0]);
  const [page, setPage] = React.useState(1);
  const [searchInput, setSearchInput] = useState("");
  const debounceVal = useDebounce(searchInput, 500);
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const getBookings = async (pg = page, status = filter?.value) => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(
        user?.role == "customer"
          ? `booking?search=${searchInput}&status=${status}&page=${pg}&limit=${recordsLimit}`
          : `booking/sp/all?search=${searchInput}&status=${status}&page=${pg}&limit=${recordsLimit}`
      ),
      accessToken
    );
    setIsLoading(false);
    if (response !== undefined) {
      setBookings(response?.data.data);
      setTotalBookings(response?.data.totalRecords);
    }
  };
  useEffect(() => {
    getBookings();
  }, [page]);

  useEffect(() => {
    if (!isFilterInitialized) {
      setPage(1);
      getBookings(1);
    }
    isFilterInitialized = false;
  }, [debounceVal]);

  useEffect(() => {
    if (locationStatus) {
      setFilter(
        bookingFilterOptions?.find((item) => item?.value == locationStatus)
      );
    }
  }, [locationStatus]);
  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.__header}>
          <h1>{user?.role !== "customer" ? "All Bookings" : "My Bookings"}</h1>
          <div className={styles.headerRight}>
            <SearchInput value={searchInput} setter={setSearchInput} />
            <DropDown
              value={filter}
              setter={(e) => {
                setFilter(e);
                setPage(1);
                getBookings(1, e?.value);
              }}
              options={bookingFilterOptions}
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
        <div className={styles.__content}>
          {isLoading ? (
            <Loader className={styles.loader} />
          ) : bookings?.length == 0 ? (
            <NoData className={styles.loader} text={"No Bookings Found"} />
          ) : (
            <Table responsive="xxl" borderless="true">
              <thead>
                <tr>
                  <th> Name </th>
                  <th> Email </th>
                  <th> Booking Number </th>
                  <th> Price </th>
                  <th> Booking Date </th>
                  <th> Status </th>
                  <th> Action </th>
                </tr>
              </thead>

              <tbody>
                {bookings?.map((item, key) => (
                  <tr key={key}>
                    <td>{item?.customer?.fullName}</td>
                    <td> {item?.customer?.email} </td>
                    <td className="text-capitalize"> {item?.bookingNumber} </td>
                    <td> ${item?.price} </td>
                    <td> {moment(item?.createdAt).format("ll hh:mm a")} </td>
                    <td className="t-t-c">
                      {item?.status === "pending" ? "booked" : item?.status}
                    </td>
                    <td>
                      <Button
                        label={"View Details"}
                        customStyle={{
                          backgroundColor: "var(--clr-primary)",
                          color: "var(--clr-font-inverted)",
                          fontFamily: "var(--ff-poppins-semibold)",
                          padding: "13px",
                        }}
                        onClick={() => {
                          navigate(`/booking/${item?._id}`);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
      {!isLoading && bookings.length > 0 && (
        <div className={[styles.paginationDiv]}>
          <PaginationComponent
            totalPages={Math.ceil(totalBookings / recordsLimit)}
            currentPage={page}
            setCurrentPage={setPage}
            defaultActiveColor="var(--clr-primary)"
          />
        </div>
      )}
    </SidebarSkeleton>
  );
}

export default AllBookings;
