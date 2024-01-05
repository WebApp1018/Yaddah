import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import React, { Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
//Components
import ProtectedRoute from "./Helper/ProtectedRoute";
import { Loader } from "./Components/Loader";
import PermissionRoute from "./Helper/PermissionRoute";
import { Get } from "./Axios/AxiosFunctions";
import { apiUrl, BaseURL } from "./config/apiUrl";
import { useEffect } from "react";
import { saveNotiData, setNotifications } from "./store/common/commonSlice";
import { io } from "socket.io-client";
import { signOutRequest, updateUser } from "./store/auth/authSlice";
import BeforeLoginRoute from "./Helper/BeforeLoginRoute";

//Pages
const NotFound = lazy(() => import("./Pages/NotFound"));
const Reports = lazy(() => import("./Pages/Reports"));
const SettingsPage = lazy(() => import("./Pages/SettingsPage/SettingsPage"));
const CRUDS = lazy(() => import("./Pages/CRUDS"));
const WhyChooseUsCrud = lazy(() => import("./Pages/WhyChooseUsCrud"));
const CreateSubAdmin = lazy(() => import("./Pages/CreateSubAdmin"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const SubAdmin = lazy(() => import("./Pages/SubAdmin"));
const NewUserRequest = lazy(() => import("./Pages/NewUserRequest"));
const CustomerManagement = lazy(() => import("./Pages/CustomerManagement"));
const NewServiceProviderRequest = lazy(() =>
  import("./Pages/NewServiceProviderRequest")
);
const SocialLinksCrud = lazy(() => import("./Pages/SocialLinksCrud"));
const NewsletterScreen = lazy(() =>
  import("./Pages/NewsletterScreen/NewsletterScreen")
);
const CmsFooter = lazy(() => import("./Pages/CmsFooter"));
const Notifications = lazy(() => import("./Pages/Notification"));
const AllServiceProviders = lazy(() => import("./Pages/AllServiceProviders"));
const Packages = lazy(() => import("./Pages/Packages"));
const DiscountCoupons = lazy(() => import("./Pages/DiscountCoupons"));
const AddCoupon = lazy(() => import("./Pages/AddCoupon"));
const Earnings = lazy(() => import("./Pages/Revenue"));
const Rating = lazy(() => import("./Pages/Rating"));
const Chats = lazy(() => import("./Pages/Chats"));
const Faqs = lazy(() => import("./Pages/FAQs"));
const Cms = lazy(() => import("./Pages/CMS"));
const Catergory = lazy(() => import("./Pages/Category"));
const CmsHome = lazy(() => import("./Pages/CmsHome"));
const CmsAbout = lazy(() => import("./Pages/CmsAbout"));
const CmsContact = lazy(() => import("./Pages/CmsContact"));
const Login = lazy(() => import("./Pages/Login"));
const AddCategoryPage = lazy(() => import("./Pages/AddCategoryPage"));
const ContactUs = lazy(() => import("./Pages/ContactUs"));

export let socket = null;

function App() {
  const dispatch = useDispatch();
  const { isLogin, user, accessToken } = useSelector(
    (state) => state.authReducer
  );

  const getNotifications = async () => {
    const response = await Get(
      BaseURL("notifications/all?page=1&limit=5&noCountUpdate=true"),
      accessToken
    );
    if (response) {
      dispatch(setNotifications(response?.data?.data));
      response?.data?.newNotifications > 0 &&
        dispatch(saveNotiData(response?.data?.newNotifications));
    }
  };

  const getMe = async () => {
    const url = BaseURL("users/me");
    const response = await Get(url, accessToken);

    if (response !== undefined) {
      const apiUser = response?.data?.data?.user;
      dispatch(updateUser(apiUser));
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
      socket?.on("new-notification", (notification, number) => {
        if (
          notification?.receiver == user?._id &&
          window.location.pathname !== "/notifications" &&
          ["subscription", "register"].includes(notification?.flag)
        ) {
          dispatch(saveNotiData());
        }
      });

      socket.on("user-blocked", (updatedUser) => {
        if (updatedUser?._id === user?._id && updatedUser?.isBlockedByAdmin) {
          toast.error(
            "Your account has been blocked by Yaddah Team. Please contact support for more details."
          );
          dispatch(signOutRequest());
          window.location.pathname = "/login";
        }
      });

      accessToken && getNotifications();
      accessToken && getMe();
    }

    return () => {
      if (isLogin) {
        socket?.off("new-notification");
      }
    };
  }, [isLogin]);

  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Suspense fallback={<Loader className={"mvh-100"} />}>
          <Routes>
            <Route
              element={<ProtectedRoute user={isLogin} redirectTo="/login" />}
            >
              <Route path="/" exact element={<Dashboard />} />
              {/* For Admin Only */}
              {user?.role == "admin" && (
                <>
                  <Route path="/sub-admin" exact element={<SubAdmin />} />
                  <Route
                    path="/create-sub-admin"
                    exact
                    element={<CreateSubAdmin />}
                  />
                </>
              )}
              {/* For Admin Only */}

              {/* Users Routes */}
              <Route
                path="/new-user-request"
                exact
                element={
                  <PermissionRoute
                    element={<NewUserRequest />}
                    permission={"users"}
                  />
                }
              />
              <Route
                path="/customer-management"
                exact
                element={
                  <PermissionRoute
                    element={<CustomerManagement />}
                    permission={"CustomerManagement"}
                  />
                }
              />
              <Route
                path="/new-service-provider-request"
                exact
                element={
                  <PermissionRoute
                    element={<NewServiceProviderRequest />}
                    permission={"users"}
                  />
                }
              />
              <Route
                path="/all-service-providers"
                exact
                element={
                  <PermissionRoute
                    element={<AllServiceProviders />}
                    permission={"ServiceProviderManagement"}
                  />
                }
              />
              {/* Users Routes */}
              {/* Packages Routes */}
              <Route
                path="/packages"
                exact
                element={
                  <PermissionRoute
                    element={<Packages />}
                    permission={"Packages(Plans)"}
                  />
                }
              />
              {/* Packages Routes */}
              {/* Coupon Routes */}
              <Route
                path="/discount-coupons"
                exact
                element={
                  <PermissionRoute
                    permission={"DiscountCoupons"}
                    element={<DiscountCoupons />}
                  />
                }
              />
              <Route
                path="/create-coupon/:id"
                exact
                element={
                  <PermissionRoute
                    permission={"DiscountCoupons"}
                    element={<AddCoupon />}
                  />
                }
              />
              <Route
                path="/create-coupon"
                exact
                element={
                  <PermissionRoute
                    permission={"DiscountCoupons"}
                    element={<AddCoupon />}
                  />
                }
              />
              {/* Coupon Routes */}
              {/* Category Routes*/}
              <Route
                path="/create-category"
                exact
                element={
                  <PermissionRoute
                    permission={"Category"}
                    element={<AddCategoryPage />}
                  />
                }
              />
              <Route
                path="/edit-category/:slug"
                exact
                element={
                  <PermissionRoute
                    permission={"Category"}
                    element={<AddCategoryPage />}
                  />
                }
              />
              <Route
                path="/categories"
                exact
                element={
                  <PermissionRoute
                    permission={"Category"}
                    element={<Catergory />}
                  />
                }
              />
              {/* Category Routes */}

              <Route
                path="/rating"
                exact
                element={
                  <PermissionRoute element={<Rating />} permission={"Rating"} />
                }
              />
              <Route
                path="/faqs"
                exact
                element={
                  <PermissionRoute
                    element={<Faqs />}
                    permission={"FAQsManagement"}
                  />
                }
              />
              <Route
                path="/contact-us"
                exact
                element={
                  <PermissionRoute
                    element={<ContactUs />}
                    permission={"ContactUs"}
                  />
                }
              />

              <Route
                path="/newsletter"
                exact
                element={
                  <PermissionRoute
                    element={<NewsletterScreen />}
                    permission={"Newsletter"}
                  />
                }
              />
              <Route
                path="/settings"
                exact
                element={
                  <PermissionRoute
                    element={<SettingsPage />}
                    permission={"Settings"}
                  />
                }
              />
              <Route
                path="/revenue"
                exact
                element={
                  <PermissionRoute
                    element={<Earnings />}
                    permission={"Revenue"}
                  />
                }
              />
              <Route
                path="/reports"
                exact
                element={
                  <PermissionRoute
                    element={<Reports />}
                    permission={"Reports"}
                  />
                }
              />
              <Route
                path="/chats"
                exact
                element={
                  <PermissionRoute element={<Chats />} permission={"Chats"} />
                }
              />
              <Route
                path="/notifications"
                exact
                element={
                  <PermissionRoute
                    element={<Notifications />}
                    permission={"Notifications"}
                  />
                }
              />
            </Route>
            <Route
              path="/login"
              exact
              element={<BeforeLoginRoute element={<Login />} />}
            />

            {/* CMS Routes */}
            <Route path="/cms">
              <Route
                index
                exact
                element={
                  <PermissionRoute permission={"CMS"} element={<Cms />} />
                }
              />
              <Route
                path="home"
                exact
                element={
                  <PermissionRoute permission={"CMS"} element={<CmsHome />} />
                }
              />
              <Route
                path="about-us"
                exact
                element={
                  <PermissionRoute permission={"CMS"} element={<CmsAbout />} />
                }
              />
              <Route
                path="contact-us"
                exact
                element={
                  <PermissionRoute
                    permission={"CMS"}
                    element={<CmsContact />}
                  />
                }
              />
              <Route
                path="footer"
                exact
                element={
                  <PermissionRoute permission={"CMS"} element={<CmsFooter />} />
                }
              />
            </Route>
            <Route path="/cruds">
              <Route
                index
                element={
                  <PermissionRoute permission={"CMS"} element={<CRUDS />} />
                }
              />
              <Route
                path="social-links"
                exact
                element={
                  <PermissionRoute
                    permission={"CMS"}
                    element={<SocialLinksCrud />}
                  />
                }
              />
              <Route
                path="why-choose-us"
                exact
                element={
                  <PermissionRoute
                    permission={"CMS"}
                    element={<WhyChooseUsCrud />}
                  />
                }
              />
            </Route>
            {/* CMS Routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
