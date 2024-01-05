import React, { useState } from "react";
import SidebarSkeleton from "../../components/SidebarSkeleton";
import styles from "./Notification.module.css";
import { IoIosNotificationsOutline } from "react-icons/io";
import PaginationComponent from "../../components/PaginationComponent";
import { Get } from "../../Axios/AxiosFunctions";
import { BaseURL } from "../../config/apiUrl";
import NoData from "../../components/NoData/NoData";
import { recordsLimit } from "../../config/apiUrl";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Loader } from "../../components/Loader";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function Notification() {
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
            notifications.map((element, key) => (
              <div
                key={key}
                className={styles.notificationBox}
                onClick={() => {
                  if (element?.flag == "booking") {
                    navigate(`/booking/${element?.booking}`);
                  }
                }}
              >
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
            <NoData text="Notifications Not Found" className={styles.noData} />
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

export default Notification;
