import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.snow.css";
import "./App.css";
import "./assets/Styles/style.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-indiana-drag-scroll/dist/style.css";
import React, { useEffect, useState, lazy, Suspense } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-image-lightbox/style.css";
//Components
import { Loader } from "./components/Loader";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./Helper/ProtectedRoute.js";
import WebSkeleton from "./components/WebSkeleton";
//Pages
import Staff from "./pages/Staff";
import Venue from "./pages/Venue";
import AddVenue from "./pages/AddVenue";
import CustomerSignup from "./pages/CustomerSignup";
import { useDispatch, useSelector } from "react-redux";
import {
  saveChatCounter,
  saveNotiData,
  setAllCategories,
  setAllStaffs,
  setAllVenues,
  setCms,
} from "./redux/common/commonSlice";
import { apiUrl, BaseURL } from "./config/apiUrl";
import { Get } from "./Axios/AxiosFunctions";
import OnHold from "./pages/OnHold/OnHold";
import { io } from "socket.io-client";
import { signOutRequest, updateUser } from "./redux/auth/authSlice";
import {
  setGoogleMapsApiKey,
  setPaypalClientId,
} from "./redux/setting/settingSlice";
import UpdatePassword from "./pages/UpdatePassword/UpdatePassword";
import OnHoldCustomer from "./pages/OnHoldCustomer";
import AllCategories from "./pages/AllCategories";
import BeforeLoginRoute from "./Helper/BeforeLoginRoute";

const Home = lazy(() => import("./pages/Home"));
const AboutUs = lazy(() => import("./pages/About-us"));
const ContactUs = lazy(() => import("./pages/Contact-us"));
const Faq = lazy(() => import("./pages/Faq"));
const Services = lazy(() => import("./pages/Services"));
const ServiceProviderServices = lazy(() =>
  import("./pages/ServiceProviderServices")
);
const BecomeAServiceProvider = lazy(() => import("./pages/service-provider"));
const Login = lazy(() => import("./pages/login"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AllBookings = lazy(() => import("./pages/AllBookings"));
const Subcription = lazy(() => import("./pages/Subcription"));
const Revenue = lazy(() => import("./pages/Revenue"));
const Chat = lazy(() => import("./pages/Chats"));
const Setting = lazy(() => import("./pages/Setting"));
const Notifications = lazy(() => import("./pages/Notofications"));
const UserTransactions = lazy(() =>
  import("./pages/UserTransactions/UserTransactions")
);
const AddService = lazy(() => import("./pages/AddService"));
const AddStaffPage = lazy(() => import("./pages/AddStaffPage/AddStaffPage"));
const MyServices = lazy(() => import("./pages/MyServices"));
const ServiceDetailScreen = lazy(() =>
  import("./pages/ServiceDetailScreen/ServiceDetailScreen")
);
const BookingDetailPage = lazy(() =>
  import("./pages/BookingDetailPage/BookingDetailPage")
);
const AllServiceProviders = lazy(() => import("./pages/AllServiceProviders"));
const NotFound = lazy(() => import("./pages/NotFound"));

export let socket = null;
function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCmsLoading, setIsCmsLoading] = useState(false);
  const { isLogin, accessToken, user } = useSelector(
    (state) => state.authReducer
  );

  const getAllCommonData = async () => {
    const [catResponse] = await Promise.allSettled([
      Get(BaseURL("category"), null, false),
    ]);
    if (catResponse?.value !== undefined) {
      dispatch(setAllCategories(catResponse?.value?.data?.data));
    }
  };
  const getCmsData = async () => {
    setIsCmsLoading(true);
    const response = await Get(BaseURL("cms/pages/all?all=true"));

    if (response !== undefined) {
      const cms = {
        home: response?.data?.pages?.find((item) => item?.pageName === "home"),
        aboutUs: response?.data?.pages?.find(
          (item) => item?.pageName === "about_us"
        ),
        services: response?.data?.pages?.find(
          (item) => item?.pageName === "services"
        ),
        faq: response?.data?.pages?.find((item) => item?.pageName === "faq"),
        contactUs: response?.data?.pages?.find(
          (item) => item?.pageName === "contact_us"
        ),
        footer: response?.data?.pages?.find(
          (item) => item?.pageName === "footer"
        ),
      };
      dispatch(setCms(cms));
      setIsCmsLoading(false);
    }
  };
  const getAllCommonDataAfterLogin = async () => {
    const [catResponse, staffResponse, venueResponse] =
      await Promise.allSettled([
        Get(BaseURL("category"), accessToken, false),
        user?.role == "service-provider" &&
          Get(
            BaseURL("staff/service-provider/all?status=true"),
            accessToken,
            false
          ),
        user?.role == "service-provider" &&
          Get(
            BaseURL("venue/service-provider/all?status=true"),
            accessToken,
            false
          ),
      ]);
    if (catResponse?.value !== undefined) {
      dispatch(setAllCategories(catResponse?.value?.data?.data));
    }
    if (staffResponse?.value) {
      dispatch(setAllStaffs(staffResponse?.value?.data?.data));
    }
    if (venueResponse?.value) {
      dispatch(setAllVenues(venueResponse?.value?.data?.data));
    }
  };

  const fetchNotificationsForCount = async () => {
    const url = BaseURL("notifications/all?page=1&limit=5&noCountUpdate=true");
    let response = await Get(url, accessToken, false);

    if (response !== undefined) {
      response?.data?.newNotifications > 0 &&
        dispatch(saveNotiData(response?.data?.newNotifications));
    }
  };

  const getMe = async () => {
    const url = BaseURL("users/me");
    Get(url, accessToken, false, "true")
      .then((response) => {
        const apiUser = response?.data?.data?.user;
        dispatch(updateUser(apiUser));
      })
      .catch((err) => {
        if (err?.message == "logout") {
          dispatch(signOutRequest());
          navigate("/");
        }
      });
  };

  // getAppconfig7
  const getAppConfig = async () => {
    const pUrl = BaseURL("configs/paypal");
    const mUrl = BaseURL("configs/map");

    const [paypalResponse, mapResponse] = await Promise.allSettled([
      Get(pUrl, accessToken, false),
      Get(mUrl, accessToken, false),
    ]);

    if (paypalResponse?.value !== undefined) {
      let mode = paypalResponse?.value?.data?.data?.paypal?.MODE;
      let CLIENT_ID_LIVE =
        paypalResponse?.value?.data?.data?.paypal?.CLIENT_ID_LIVE;
      let CLIENT_ID_SANDBOX =
        paypalResponse?.value?.data?.data?.paypal?.CLIENT_ID_SANDBOX;
      if (mode === "sandbox") dispatch(setPaypalClientId(CLIENT_ID_SANDBOX));
      else dispatch(setPaypalClientId(CLIENT_ID_LIVE));
    }
    if (mapResponse?.value !== undefined) {
      dispatch(
        setGoogleMapsApiKey(mapResponse?.value?.data?.data?.map?.MAP_KEY)
      );
    }
  };

  useEffect(() => {
    if (isLogin) {
      socket = io(apiUrl, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 180000,
        reconnectionDelayMax: 300000,
      });
      socket?.emit("join", user?._id);
      socket?.on("new-notification", (notification) => {
        if (
          notification?.receiver == user?._id &&
          window.location.pathname !== "/notifications" &&
          ["booking"].includes(notification?.flag)
        ) {
          dispatch(saveNotiData());
        }
        //something went wrong here

        if (
          notification?.receiver == user?._id &&
          notification?.flag == "chat" &&
          window.location.pathname !== "/chat"
        ) {
          dispatch(saveChatCounter(notification));
          dispatch(saveNotiData());
        }
      });

      socket.on("user-blocked", (updatedUser) => {
        if (updatedUser?._id === user?._id && updatedUser?.isBlockedByAdmin) {
          toast.error(
            "Your account has been blocked by Yaddah Team. Please contact support for more details."
          );
          dispatch(signOutRequest());
          window.location.pathname = "/";
        }
      });

      fetchNotificationsForCount();
      getAllCommonDataAfterLogin();
      getMe();
    }
    // getToken();
    // getCmsData();
    return () => {
      if (isLogin) {
        socket?.off("new-notification");
      }
    };
  }, [isLogin]);

  useEffect(() => {
    getAllCommonData();
    getCmsData();
    getAppConfig();
  }, []);

  const serviceProvierRoutes = [
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/my-services",
      element: <MyServices />,
    },
    {
      path: "/all-bookings",
      element: <AllBookings />,
    },
    {
      path: "/subscription",
      element: <Subcription />,
    },
    // {
    //   path: "/revenue",
    //   element: <Revenue />,
    // },
    {
      path: "/create-staff",
      element: <AddStaffPage />,
    },
    {
      path: "/staff",
      element: <Staff />,
    },
    {
      path: "/edit-staff/:id",
      element: <AddStaffPage />,
    },
    {
      path: "/venue",
      element: <Venue />,
    },
    {
      path: "/chats",
      element: <Chat />,
    },
    {
      path: "/create-service",
      element: <AddService />,
    },
    {
      path: "/edit-service/:id",
      element: <AddService />,
    },
    {
      path: "/create-venue",
      element: <AddVenue />,
    },
    {
      path: "/edit-venue/:id",
      element: <AddVenue />,
    },
    {
      path: "/settings",
      element: <Setting />,
    },
    {
      path: "/notifications",
      element: <Notifications />,
    },
    {
      path: "/earning",
      element: <Revenue />,
    },
    {
      path: "/update-password",
      element: <UpdatePassword />,
    },
  ];
  const customerRoutes = [
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/my-bookings",
      element: <AllBookings />,
    },
    {
      path: "/chats",
      element: <Chat />,
    },
    {
      path: "/settings",
      element: <Setting />,
    },
    {
      path: "/notifications",
      element: <Notifications />,
    },
    {
      path: "/transactions",
      element: <UserTransactions />,
    },
    {
      path: "/update-password",
      element: <UpdatePassword />,
    },
  ];

  return (
    <>
      <ToastContainer />
      <ScrollToTop />
      {isCmsLoading ? (
        <Loader className={"mvh-100"} />
      ) : (
        <Suspense fallback={<Loader className={"mvh-100"} />}>
          <Routes>
            <Route element={<WebSkeleton />}>
              <Route exact={true} path="/" element={<Home />} />
              <Route
                exact={true}
                path="/service-providers"
                element={<AllServiceProviders />}
              />
              <Route
                exact={true}
                path="/categories"
                element={<AllCategories />}
              />
              <Route exact={true} path="/about-us" element={<AboutUs />} />
              <Route exact={true} path="/contact-us" element={<ContactUs />} />
              <Route exact={true} path="/faq" element={<Faq />} />
              <Route exact={true} path="/services" element={<Services />} />
              <Route
                exact={true}
                path="/service-provider/services/:id"
                element={<ServiceProviderServices />}
              />
              <Route
                path="/become-a-service-provider"
                element={<BecomeAServiceProvider />}
              />
              <Route
                path="/signup"
                // element={<BeforeLoginRoute element={<CustomerSignup />} />}
                element={<CustomerSignup />}
              />
              <Route
                exact={true}
                path="/login"
                element={<BeforeLoginRoute element={<Login />} />}
              />
              <Route exact={true} path="/pricing" element={<Pricing />} />
              <Route path="/service/:id" element={<ServiceDetailScreen />} />
              <Route path="/on-hold" element={<OnHold />} />
              <Route path="/on-hold-customer" element={<OnHold />} />
            </Route>
            <Route path="/booking/:id" element={<BookingDetailPage />} />

            {/* For Service Provider */}
            {user?.role == "customer" && user?.status == "pending" && (
              <Route path="/dashboard" element={<OnHoldCustomer />} />
            )}
            {/* For Service Provider */}
            {user?.role == "service-provider" && user?.status == "pending" && (
              <Route path="/dashboard" element={<OnHold />} />
            )}

            {user?.role == "service-provider" &&
              serviceProvierRoutes?.map((item, index) => (
                <Route
                  key={index}
                  path={item?.path}
                  exact
                  element={
                    <ProtectedRoute
                      user={isLogin}
                      role={"service-provider"}
                      redirectTo="/login"
                      element={item?.element}
                      path={item?.path}
                    />
                  }
                />
              ))}
            {/* For Service Provider */}

            {user?.role == "customer" &&
              customerRoutes?.map((item, index) => (
                <Route
                  key={index}
                  path={item?.path}
                  exact
                  element={
                    <ProtectedRoute
                      user={isLogin}
                      role={"customer"}
                      redirectTo="/login"
                      element={item?.element}
                    />
                  }
                />
              ))}

            {/* <RouteWe
                  role={"service-provider"}
                  redirectTo="/login"
                  element={<Dashboard />}
                />
              }
            />
            <Route path="/my-services" exact element={<MyServices />} />
            <Route path="/all-bookings" exact element={<AllBookings />} />
            <Route path="/subcription" exact element={<Subcription />} />
            <Route path="/revenue" exact element={<Revenue />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/create-staff" element={<AddStaffPage />} />
            <Route path="/edit-staff/:id" element={<AddStaffPage />} />
            <Route path="/venue" element={<Venue />} />
            <Route path="/chats" element={<Chat />} />
            <Route path="/create-service" element={<AddService />} />
            <Route path="/edit-service/:id" element={<AddService />} />
            <Route path="/create-venue" element={<AddVenue />} />
            <Route path="/edit-venue/:id" element={<AddVenue />} />
            <Route path="/add-category" element={<AddCategoryPage />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/earning" element={<Revenue />} />
            <Route path="/booking/:id" element={<BookingDetailPage />} /> */}

            {/* For Customer */}
            {/* <Route
              element={
                <ProtectedRoute
                  user={isLogin}
                  redirectTo="/login"
                  role={"customer"}
                />
              }
            >
              <Route path="/dashboard" exact element={<Dashboard />} />
              <Route path="/settings" element={<Setting />} />
            </Route> */}

            {/* <Route path="/staff" element={<Staff />} />
            <Route path="/venue" element={<Venue />} />
            <Route path="/earning" element={<Revenue />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/create-staff" element={<AddStaffPage />} />
            <Route path="/edit-staff/:id" element={<AddStaffPage />} />
            <Route path="/add-category" element={<AddCategoryPage />} />
            <Route path="/settings" element={<Setting />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      )}
    </>
  );
}

export default App;
