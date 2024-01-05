import React, { useState } from "react";
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import styles from "./Notifications.module.css";
import { IoIosNotificationsOutline } from "react-icons/io";
import PaginationComponent from "../../Components/PaginationComponent";
import { Get } from "../../Axios/AxiosFunctions";
import { BaseURL, liveURLWEB } from "../../config/apiUrl";
import NoData from "../../Components/NoData/NoData";
import { recordsLimit } from "../../config/apiUrl";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Loader } from "../../Components/Loader";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state?.authReducer);
  const [notifications, setNotifications] = useState([]);
  const [totalNotifications, setTotalNotifications] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = React.useState(1);

  const getNotifications = async () => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(`notifications/all?page=${page}&limit=${recordsLimit}`),
      accessToken
    );
    setIsLoading(false);
    if (response !== undefined) {
      setNotifications(response?.data.data);
      setTotalNotifications(response?.data.totalCount);
    }
  };
  useEffect(() => {
    getNotifications();
  }, [page]);
  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.__header}>
          <h1>Notifications</h1>
        </div>
        <div className={styles.__content}>
          {isLoading ? (
            <Loader className={styles.loader} />
          ) : notifications.length > 0 ? (
            notifications.map((element) => (
              <div
                className={styles.notificationBox}
                onClick={() => {
                  if (element?.flag == "booking") {
                    window.open(
                      `${liveURLWEB}/booking/${element?.booking}`,
                      "_blank"
                    );
                  } else {
                    if (["register", "subscription"].includes(element?.flag)) {
                      navigate(`/all-service-providers`);
                    }
                  }
                }}>
                <div className={styles.notification}>
                  <div className={styles.notificationIcon}>
                    <IoIosNotificationsOutline
                      size={30}
                      className={styles.icon}
                    />
                  </div>
                  <div className={styles.notificatinText}>
                    {element?.message}
                  </div>
                </div>
                <div className={styles.time}>
                  {moment(element?.createdAt).format("DD MMM YYYY hh:mm")}{" "}
                </div>
              </div>
            ))
          ) : (
            <NoData text="Notifications Not Found" className={styles.loader} />
          )}
        </div>
      </div>
      {!isLoading && notifications.length > 0 && (
        <div className={[styles.paginationDiv]}>
          <PaginationComponent
            totalPages={Math.ceil(totalNotifications / recordsLimit)}
            currentPage={page}
            setCurrentPage={setPage}
            defaultActiveColor="var(--clr-primary)"
          />
        </div>
      )}
    </SidebarSkeleton>
  );
}

export default Notifications;
