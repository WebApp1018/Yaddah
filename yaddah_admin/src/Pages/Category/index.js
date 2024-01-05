import React, { useEffect, useState } from "react";
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import styles from "./Category.module.css";
import SearchInput from "../../Components/SearchInput";
import { Button } from "../../Components/Button/Button";
import Card from "../../Components/Card";
import { Row, Col } from "react-bootstrap";
import NoData from "../../Components/NoData/NoData";
import PaginationComponent from "../../Components/PaginationComponent";
import useDebounce from "../../CustomHooks/useDebounce";
import { BaseURL, recordsLimit } from "../../config/apiUrl";
import { Get } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DropDown } from "../../Components/DropDown/DropDown";
import { categoryFilterOptions } from "../../constant/staticData";
import { Loader } from "../../Components/Loader";
import CategoryDetailModal from "../../modals/CategoryDetailModal";

function Category() {
  const { accessToken } = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [page, setPage] = React.useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState(categoryFilterOptions[0]);
  const debounceVal = useDebounce(searchInput, 500);
  const [totalCategories, setTotalCategories] = useState(30);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const getCategories = async (pg = page, sts = status?.value) => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(
        `category/admin/all?isActive=${sts}&search=${searchInput}&page=${pg}&limit=${recordsLimit}`
      ),
      accessToken
    );
    if (response !== undefined) {
      setCategories(response?.data.data);
      setTotalCategories(response?.data.totalCount);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getCategories();
  }, [page]);

  useEffect(() => {
    if (debounceVal) {
      getCategories();
    }
  }, [debounceVal]);

  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.header}>
          <h1>Category</h1>
          <div className={styles.headerRight}>
            <SearchInput value={searchInput} setter={setSearchInput} />
            <DropDown
              value={status}
              setter={(e) => {
                setStatus(e);
                setPage(1);
                getCategories(1, e?.value);
              }}
              options={categoryFilterOptions}
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
              label={"Create new Category"}
              customStyle={{
                backgroundColor: "var(--clr-secondary)",
                color: "var(--clr-font-inverted)",
                fontFamily: "var(--ff-poppins-semibold)",
                padding: "16px",
                border: "none",
              }}
              onClick={() => {
                navigate("/create-category");
              }}
            />
          </div>
        </div>
        <div className={styles.categoryCard__wrapper}>
          {isLoading ? (
            <Loader className={styles.loader} />
          ) : (
            <Row className={styles.gap}>
              {categories.length > 0 ? (
                categories?.map((item) => (
                  <Col xxl={4} xl={6} className="mb-xxl-0 mb-5">
                    <Card
                      item={item}
                      onEdit={() => navigate(`/edit-category/${item?.slug}`)}
                      onView={() => {
                        setSelectedItem(item);
                        setIsModalOpen(true);
                      }}
                    />
                  </Col>
                ))
              ) : (
                <NoData text="No Category Found" />
              )}
            </Row>
          )}
        </div>
      </div>
      {!isLoading && categories.length > 0 && (
        <div className={[styles.paginationDiv]}>
          <PaginationComponent
            totalPages={Math.ceil(totalCategories / recordsLimit)}
            currentPage={page}
            setCurrentPage={setPage}
            defaultActiveColor="var(--clr-primary)"
          />
        </div>
      )}
      <CategoryDetailModal
        show={isModalOpen}
        setShow={() => setIsModalOpen(false)}
        data={selectedItem}
      />
    </SidebarSkeleton>
  );
}

export default Category;
