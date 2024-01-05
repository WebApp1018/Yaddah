import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import SidebarSkeleton from "../../Components/SidebarSkeleton";
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
import { Skeleton } from "@mui/material";
import StatBox from "../../Components/StatBox";
import Notification from "../../Components/Notification";
import { BsBell } from "react-icons/bs";
import NoData from "../../Components/NoData/NoData";
import { Get } from "../../Axios/AxiosFunctions";
import { BaseURL } from "../../config/apiUrl";
import { useSelector } from "react-redux";
import {
  newServiceProviderRequestSvg,
  newUserRequestSvg,
  totalEarningsSvg,
  totalServiceProvidersSvg,
  totalSubServiceProviderSvg,
  totalUsersSvg,
} from "../../constant/imagePath";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { accessToken, user } = useSelector((state) => state?.authReducer);
  const [stats, setStats] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState([]);
  const [latestNotification, setLatestNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const adminStats = [
    (user?.role == "admin" ||
      user?.permissions?.includes("CustomerManagement")) && {
      icon: totalUsersSvg,
      data: stats?.find((item) => item?.name == "Total Customers")?.value || 0,
      desc: "total users",
      onClick: () => navigate("/customer-management"),
    },
    (user?.role == "admin" ||
      user?.permissions?.includes("ServiceProviderManagement")) && {
      icon: totalServiceProvidersSvg,
      data:
        stats?.find((item) => item?.name == "Total Service Providers")?.value ||
        0,
      desc: "total service provider",
      onClick: () => navigate("/all-service-providers"),
    },
    (user?.role == "admin" ||
      user?.permissions?.includes("CustomerManagement")) && {
      icon: newUserRequestSvg,
      data:
        stats?.find((item) => item?.name == "New Customer Requests")?.value ||
        0,
      desc: "new users requests",
      onClick: () =>
        navigate("/customer-management", {
          state: { status: "pending" },
        }),
    },
    (user?.role == "admin" ||
      user?.permissions?.includes("ServiceProviderManagement")) && {
      icon: newServiceProviderRequestSvg,
      data:
        stats?.find((item) => item?.name == "New Service Provider Requests")
          ?.value || 0,
      desc: "new service provider request",
      onClick: () =>
        navigate("/all-service-providers", {
          state: { status: "pending" },
        }),
    },
    (user?.role == "admin" ||
      user?.permissions?.includes("ServiceProviderManagement")) && {
      icon: totalSubServiceProviderSvg,
      data:
        stats?.find((item) => item?.name == "Total Subscribed Service Provider")
          ?.value || 0,
      desc: "total subcribed service provider",
      onClick: () =>
        navigate("/all-service-providers", {
          state: { status: "accepted" },
        }),
    },
  ].filter((item) => item);

  const dashboardData = [
    ...adminStats,
    {
      icon: totalEarningsSvg,
      data: "$" + (stats?.find((item) => item?.name == "Earnings")?.value || 0),
      desc: "earnings",
      onClick: () => navigate("/revenue"),
    },
  ];

  const getDashboard = async () => {
    setIsLoading(true);
    const response = await Get(BaseURL(`users/admin/stats`), accessToken);
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
      <div className={styles.content__wrapper}>
        <div className={styles.statBox__wrapper}>
          <Row>
            {isLoading
              ? Array(6)
                  .fill(0)
                  .map((item) => (
                    <Col md={6} xxl={4} className={styles.skeleton}>
                      <Skeleton variant="rounded" width={`100%`} height={170} />
                    </Col>
                  ))
              : dashboardData?.map((item) => (
                  <Col md={6} xxl={4} onClick={() => item?.onClick()}>
                    <StatBox item={item} />
                  </Col>
                ))}
          </Row>
        </div>
        <div className={styles.detailBox__wrapper}>
          <Row>
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
            <Col xxl={6}>
              <div className={styles.notification__wrapper}>
                <div className={styles.__header}>
                  <p>Latest Notification</p>
                </div>
                <div className={styles.notification}>
                  {isLoading ? (
                    Array(6)
                      .fill(0)
                      .map((item) => (
                        <Skeleton
                          className={styles.notificationSkelton}
                          variant="rounded"
                          width={`100%`}
                          height={40}
                        />
                      ))
                  ) : latestNotification?.length > 0 ? (
                    latestNotification?.map((e) => (
                      <Notification item={e} icon={<BsBell />} />
                    ))
                  ) : (
                    <NoData text="Notifications not found" />
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </SidebarSkeleton>
  );
};

export default Home;
