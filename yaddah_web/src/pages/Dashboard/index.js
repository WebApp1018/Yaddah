import React, { useState } from "react";
import styles from "./Dashboard.module.css";
import SidebarSkeleton from "../../components/SidebarSkeleton";
import { Row, Col } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

//Components
import StatBox from "../../components/DashboardStatBox";
import Notification from "../../components/DashboardNotification";
import { BsBell } from "react-icons/bs";
import NoData from "../../components/NoData/NoData";
import { Get } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import { BaseURL } from "../../config/apiUrl";
import { useEffect } from "react";
import { Loader } from "../../components/Loader";
import {
  totalSubServiceProviderSvg,
  newServiceProviderRequestSvg,
  newUserRequestSvg,
  totalEarningsSvg,
  totalUsersSvg,
  chatDahboardSvg,
} from "../../constant/imagePath";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { accessToken, user } = useSelector((state) => state?.authReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState([]);
  const [latestNotification, setLatestNotifications] = useState([]);

  const getDashboard = async () => {
    setIsLoading(true);
    const response = await Get(
      BaseURL(
        user?.role == "customer" ? `users/customer/stats` : `users/sp/stats`
      ),
      accessToken
    );
    if (response !== undefined) {
      const resData = response?.data?.data;
      setStats(resData?.statistics);
      setLatestNotifications(resData?.notifications);
      setTotalEarnings(resData?.totalEarnings);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getDashboard();
  }, []);
  const spDashboardData = [
    {
      icon: totalUsersSvg,
      data: stats?.find((item) => item?.name == "Total Bookings")?.value || 0,
      desc: "Total Bookings",
      onClick: () => navigate("/all-bookings"),
    },
    {
      icon: totalEarningsSvg,
      data:
        "$" + !!stats?.find((item) => item?.name == "Total Earnings")?.value
          ? stats?.find((item) => item?.name == "Total Earnings")?.value
          : 0,
      desc: "Total Earnings",
      onClick: () => navigate("/earning"),
    },
    {
      icon: newUserRequestSvg,
      data: stats?.find((item) => item?.name == "Total Venues")?.value || 0,
      desc: "Total Venues",
      onClick: () => navigate("/venue"),
    },
    {
      icon: newServiceProviderRequestSvg,
      data:
        stats?.find((item) => item?.name == "Total Number Of Staffs")?.value ||
        0,
      desc: "Total Number Of Staffs",
      onClick: () => navigate("/staff"),
    },
    {
      icon: chatDahboardSvg,
      data: stats?.find((item) => item?.name == "Total Chats")?.value || 0,
      desc: "Total Chats",
      onClick: () => navigate("/chats"),
    },
    {
      icon: totalSubServiceProviderSvg,
      // data: stats?.find((item) => item?.name == "Subscription")?.value
      //   ? "Active"
      //   : "Expire",
      data: stats?.find((item) => item?.name == "Subscription")?.value,
      desc: "Subscription",
      onClick: () => navigate("/subscription"),
    },
  ];
  const CusDashboardData = [
    {
      icon: totalUsersSvg,
      data: stats?.find((item) => item?.name == "Total Bookings")?.value || 0,
      desc: "Total Bookings",
      onClick: () => navigate("/my-bookings", { state: { value: "all" } }),
    },
    {
      icon: totalUsersSvg,
      data:
        stats?.find((item) => item?.name == "Completed Bookings")?.value || 0,
      desc: "Completed Bookings",
      onClick: () =>
        navigate("/my-bookings", { state: { value: "completed" } }),
    },
    {
      icon: totalUsersSvg,
      data: stats?.find((item) => item?.name == "Pending Bookings")?.value || 0,
      desc: "Pending Bookings",
      onClick: () => navigate("/my-bookings", { state: { value: "pending" } }),
    },
  ];

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
      },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Earning",
        },
        suggestedMin: 0,
        suggestedMax: 10000,
      },
    },
  };
  const labels = totalEarnings?.map((item) => item?.day);
  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: [
          totalEarnings?.find((item) => item?.day == "Sun")?.amount,
          totalEarnings?.find((item) => item?.day == "Mon")?.amount,
          totalEarnings?.find((item) => item?.day == "Tue")?.amount,
          totalEarnings?.find((item) => item?.day == "Wed")?.amount,
          totalEarnings?.find((item) => item?.day == "Thu")?.amount,
          totalEarnings?.find((item) => item?.day == "Fri")?.amount,
          totalEarnings?.find((item) => item?.day == "Sat")?.amount,
        ],
        borderColor: "#245357",
        backgroundColor: "#245357",
      },
    ],
  };

  return (
    <SidebarSkeleton>
      {isLoading ? (
        <Loader className={styles.loader} />
      ) : (
        <div className={styles.content__wrapper}>
          <div className={styles.statBox__wrapper}>
            <Row className={styles.gap}>
              {(user?.role == "customer"
                ? CusDashboardData
                : spDashboardData
              )?.map((item, i) => (
                <Col sm={12} md={6} xxl={4} onClick={item?.onClick} key={i}>
                  <StatBox item={item} />
                </Col>
              ))}
            </Row>
          </div>
          <div
            className={[
              styles.detailBox__wrapper,
              user?.role == "customer" && styles.customerBox,
            ].join(" ")}
          >
            <Row>
              {user?.role !== "customer" && (
                <Col xxl={6} className="mb-xxl-0 mb-3">
                  <div className={styles.graphBox__wrapper}>
                    <div className={styles.__header}>
                      <p>Total Earnings</p>
                    </div>
                    <div className={styles.graphBox}>
                      <Line options={options} data={data} />
                    </div>
                  </div>
                </Col>
              )}
              <Col xxl={user?.role === "customer" ? 12 : 6}>
                <div className={styles.notification__wrapper}>
                  <div className={styles.__header}>
                    <p>Latest Notification</p>
                  </div>
                  {latestNotification?.length > 0 ? (
                    <div className={styles.notification}>
                      {latestNotification?.map((e, key) => (
                        <Notification item={e} icon={<BsBell />} key={key} />
                      ))}
                    </div>
                  ) : (
                    <NoData
                      text="Notification not available"
                      className={styles.noData}
                    />
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </SidebarSkeleton>
  );
};

export default Dashboard;
