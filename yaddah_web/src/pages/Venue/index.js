import React, { useEffect, useState } from "react";
import SidebarSkeleton from "../../components/SidebarSkeleton";
import styles from "./Venue.module.css";
import SearchInput from "../../components/SearchInput";
import { Button } from "../../components/Button/Button";
import Card from "../../components/Card";
import { Row, Col } from "react-bootstrap";
import DropDown from "../../components/DropDown";
import { Get } from "../../Axios/AxiosFunctions";
import { BaseURL } from "../../config/apiUrl";
import NoData from "../../components/NoData/NoData";
import PaginationComponent from "../../components/PaginationComponent";
import useDebounce from "../../CustomHooks/useDebounce";
import { recordsLimit } from "../../config/apiUrl";
import { useNavigate } from "react-router-dom";
import { venueFilterOptions } from "../../constant/staticData";
import { useSelector } from "react-redux";
import { Loader } from "../../components/Loader";
import PublicVenueDetailModal from "../../Modals/PublicVenueDetailModal/PublicVenueDetailModal";
import { BiFilterAlt } from "react-icons/bi";

let isInitialRender = true;
function Venue() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.authReducer.accessToken);

  const [filter, setFilter] = useState(venueFilterOptions[0]);
  const [page, setPage] = React.useState(1);
  const [searchInput, setSearchInput] = useState("");
  const debounceVal = useDebounce(searchInput, 500);
  const [venues, setVenues] = useState([]);
  const [totalVenues, setTotalVenues] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const getVenues = async (pg = page, status = filter?.value) => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(
        `venue/service-provider/all?search=${searchInput}&status=${status}&page=${pg}&limit=${recordsLimit}`
      ),
      token
    );
    setIsLoading(false);
    if (response !== undefined) {
      setVenues(response?.data.data);
      setTotalVenues(response?.data.totalRecords);
    }
  };
  useEffect(() => {
    getVenues();
  }, [page]);

  useEffect(() => {
    if (!isInitialRender) {
      setPage(1);
      getVenues(1);
    }
    isInitialRender = false;
  }, [debounceVal]);

  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.header}>
          <h1>Venues</h1>
          <div className={styles.headerRight}>
            <SearchInput
              setter={setSearchInput}
              value={searchInput}
              className={styles.searchInput}
            />
            <Button
              label={"+ Add new Venue"}
              className={styles.DownloadReport}
              customStyle={{
                backgroundColor: "var(--clr-secondary)",
                color: "var(--clr-font-inverted)",
                fontFamily: "var(--ff-poppins-semibold)",
                padding: "16px",
              }}
              onClick={() => navigate("/create-venue")}
            />
            <DropDown
              value={filter}
              setter={(e) => {
                setPage(1);
                setFilter(e);
                getVenues(1, e?.value);
              }}
              options={venueFilterOptions}
              placeholder="Filter"
              customStyle={{
                backgroundColor: "var(--clr-secondary)",
                color: "var(--clr-font-inverted)",
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
        {isLoading ? (
          <Loader className={styles.loader} />
        ) : (
          <div className={styles.categoryCard__wrapper}>
            <Row>
              {venues.length > 0 ? (
                venues?.map((item) => (
                  <Col xxl={4} xl={6} className="mb-xxl-0 mb-5">
                    <Card
                      item={item}
                      onView={() => {
                        setSelectedItem(item);
                        setIsOpenModal(true);
                      }}
                    />
                  </Col>
                ))
              ) : (
                <NoData text="No Venues Found" className={styles.noData} />
              )}
            </Row>
          </div>
        )}
      </div>
      {!isLoading && venues.length > 0 && (
        <div className={[styles.paginationDiv]}>
          <PaginationComponent
            totalPages={Math.ceil(totalVenues / recordsLimit)}
            currentPage={page}
            setCurrentPage={setPage}
            defaultActiveColor="var(--clr-primary)"
          />
        </div>
      )}
      <PublicVenueDetailModal
        data={selectedItem}
        show={isOpenModal}
        setShow={setIsOpenModal}
      />
    </SidebarSkeleton>
  );
}

export default Venue;
