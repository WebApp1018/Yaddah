import React from "react";
import { useState, useEffect } from "react";
import styles from "./Staff.module.css";
import SidebarSkeleton from "../../components/SidebarSkeleton";
//Component
import UserCard from "../../components/UserCard";
import SearchInput from "../../components/SearchInput";
import DropDown from "../../components/DropDown";
import { Button } from "../../components/Button/Button";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { apiHeader, BaseURL, imageUrl } from "../../config/apiUrl";
import NoData from "../../components/NoData/NoData";
import PaginationComponent from "../../components/PaginationComponent";
import useDebounce from "../../CustomHooks/useDebounce";
import { recordsLimit } from "../../config/apiUrl";
import ToggleListCardView from "../../components/ToggleListCardView";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { staffFilterOptions } from "../../constant/staticData";
import { Loader } from "../../components/Loader";
import StaffDetailModal from "../../Modals/StaffDetailModal";
import { toast } from "react-toastify";
import { Table } from "react-bootstrap";
import TableSkeleton from "../../components/TableSkeletonBootstrap";
import { EmptyProfile } from "../../constant/imagePath";
import { setAllStaffs } from "../../redux/common/commonSlice";
import { BiFilterAlt } from "react-icons/bi";

let isInitialRender = true;

const AllStaffs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.authReducer);
  const { allStaffs } = useSelector((state) => state.commonReducer);
  const [listView, setlistView] = useState(false);

  const [filter, setFilter] = useState(staffFilterOptions[0]);
  const [page, setPage] = React.useState(1);
  const [searchInput, setSearchInput] = useState("");
  const debounceVal = useDebounce(searchInput, 500);
  const [staff, setStaff] = useState([]);
  const [totalStaff, setTotalStaff] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [tableLoading, setTableLoading] = useState("");

  function setStaffToReducer(d, type = "edit") {
    const newData = [...allStaffs];
    if (type == "edit") {
      if (newData?.findIndex((item) => item?._id == d?._id) == -1) {
        newData.push(d);
      } else {
        newData.splice(
          newData?.findIndex((item) => item?._id == d?._id),
          1,
          d
        );
      }
    } else {
      newData.splice(
        newData?.findIndex((item) => item?._id == d?._id),
        1
      );
    }
    dispatch(setAllStaffs(newData));
  }

  const getStaff = async (pg = page, status = filter?.value) => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(
        `staff/service-provider/all?search=${searchInput}&status=${status}&page=${pg}&limit=${recordsLimit}`
      ),
      accessToken
    );
    setIsLoading(false);
    if (response !== undefined) {
      setStaff(response?.data.data);
      setTotalStaff(response?.data.totalCount);
    }
  };
  useEffect(() => {
    getStaff();
  }, [page]);

  useEffect(() => {
    if (!isInitialRender) {
      setPage(1);
      getStaff(1);
    }
    isInitialRender = false;
  }, [debounceVal]);

  //   useEffect(() => {
  //     setUser(
  //       userData.filter(
  //         (e) => e.userType === "serviceProvider" && e.status === "approved"
  //       )
  //     );
  //   }, []);

  async function activeDeactivateStaff(e) {
    const url = BaseURL(`staff/activate-deactivate/${e?._id}`);
    const response = await Patch(
      url,
      { status: !e?.isActive },
      apiHeader(accessToken)
    );
    if (response) {
      const newData = [...staff];

      if (filter?.value == "all") {
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
      setStaffToReducer(
        response?.data?.data,
        response?.data?.data?.isActive ? "edit" : "delete"
      );
      setStaff(newData);
      toast.success(
        `Staff ${e?.isActive ? "deactivated" : "activated"} successfully `
      );
    }
  }

  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.header}>
          <h1>Staff</h1>
          <div className={styles.headerRight}>
            <SearchInput
              setter={setSearchInput}
              value={searchInput}
              className={styles.searchInput}
            />
            <Button
              label={"+Add new staff"}
              className={styles.DownloadReport}
              onClick={() => navigate("/create-staff")}
            />
            <DropDown
              value={filter}
              setter={(e) => {
                setPage(1);
                setFilter(e);
                getStaff(1, e?.value);
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
          ) : staff?.length > 0 ? (
            <>
              <div className={styles.listToggle}>
                <ToggleListCardView
                  toggleState={listView}
                  setter={setlistView}
                />
              </div>
              {listView ? (
                <div className={styles.__content}>
                  <Table responsive="xxl" borderless="true">
                    <thead>
                      <tr>
                        <th>Profile </th>
                        <th> Name </th>
                        <th> Phone No </th>
                        <th> Email </th>
                        <th>Status</th>
                        <th> Action </th>
                      </tr>
                    </thead>

                    {isLoading ? (
                      <TableSkeleton rowsCount={10} colsCount={5} />
                    ) : (
                      <tbody>
                        {staff?.map((item, key) => (
                          <tr key={key}>
                            <td className={styles.userCard__button__wrapper}>
                              <div className={styles.image__wrapper}>
                                <img
                                  className={styles.image__wrapper}
                                  src={imageUrl(item?.image)}
                                  alt=""
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = EmptyProfile;
                                  }}
                                />
                              </div>
                            </td>
                            <td>{item?.staffName}</td>
                            <td> {item?.phoneNo} </td>
                            <td> {item?.email} </td>
                            <td> {item?.isActive ? "Active" : "Deactive"} </td>

                            <td>
                              <div className={styles.userCard__button__wrapper}>
                                <Button
                                  label={"Edit"}
                                  className={styles.userCard__button}
                                  onClick={() =>
                                    navigate(`/edit-staff/${item?._id}`)
                                  }
                                />
                                <Button
                                  label={
                                    tableLoading == item?._id
                                      ? "Wait..."
                                      : !item?.isActive
                                      ? "Activate"
                                      : "Deactivate"
                                  }
                                  className={[
                                    styles.userCard__button,
                                    styles.userCard__button__bordered,
                                  ].join(" ")}
                                  onClick={async () => {
                                    setTableLoading(item?._id);
                                    await activeDeactivateStaff(item);
                                    setTableLoading("");
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
              ) : (
                <div className={styles.userCard__wrapper}>
                  {staff?.map((e, key) => (
                    <UserCard
                      key={key}
                      item={e}
                      onOptions={(item) => {
                        if (item == "View Detail") {
                          setSelectedItem(e);
                          setIsModalOpen(true);
                        }
                      }}
                      onEdit={() => navigate(`/edit-staff/${e?._id}`)}
                      onStatusChange={async () => {
                        await activeDeactivateStaff(e);
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <NoData text="No Staff Found" className={styles.loader} />
          )}
        </div>
      </div>
      {!isLoading && staff.length > 0 && (
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

export default AllStaffs;
