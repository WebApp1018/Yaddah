import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import { useSelector, useDispatch } from "react-redux";
import { signOutRequest } from "../../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
//Images
import {
  logoWhite,
  logoWithoutName,
  dashboardSvg,
  newUserSvg,
  allUserSvg,
  allServiceSvg,
  packagesSvg,
  discountSvg,
  badgeSvg,
  notificationSvg,
  chatsSvg,
  logoutSvg,
  revenueSvg,
  faqSvg,
  cmsSvg,
  NewsLettersSvg,
  ContactUsFormSvg,
  SettingsSvg,
} from "../../constant/imagePath";
import { GiHamburgerMenu } from "react-icons/gi";
import { clearNotiData } from "../../store/common/commonSlice";
import { useEffect } from "react";

const Navigation = ({ getter, func }) => {
  const ref = React.useRef();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state?.authReducer);
  const { noti_counter } = useSelector((state) => state?.commonReducer);

  const LogoutHandler = () => {
    dispatch(signOutRequest());
    navigate("/login");
  };

  function isAllowed(val) {
    return user?.role == "admin" || user?.permissions?.includes(val);
  }

  // on location change
  useEffect(() => {
    if (ref[location.pathname])
      ref[location.pathname].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }, [location]);

  return (
    <div
      className={
        !getter
          ? [styles.sidebar__collapsed, styles.sidebar].join(" ")
          : styles.sidebar
      }
    >
      <button onClick={(e) => func()} className={styles.hamburger__btn}>
        <GiHamburgerMenu />
      </button>
      <div className={styles.logo__wrapper}>
        <img src={logoWhite} alt="" />
      </div>
      <div className={styles.navigation__wrapper}>
        <img src={logoWithoutName} alt="" className={styles.accent__img} />
        <NavLink
          to="/"
          ref={(r) => {
            ref["/"] = r;
          }}
        >
          <ReactSVG src={dashboardSvg} />
          {getter ? <span>Dashboard</span> : null}
        </NavLink>
        {isAllowed("SubAdminManagement") && (
          <>
            <NavLink
              to="/sub-admin"
              ref={(r) => {
                ref["/sub-admin"] = r;
              }}
            >
              <ReactSVG src={newUserSvg} />
              {getter ? <span>Sub Admin Management</span> : null}
            </NavLink>
          </>
        )}
        {isAllowed("CustomerManagement") && (
          <>
            <NavLink
              to="/customer-management"
              ref={(r) => {
                ref["/customer-management"] = r;
              }}
            >
              <ReactSVG src={allUserSvg} />
              {getter ? <span>Customer Management</span> : null}
            </NavLink>
          </>
        )}
        {isAllowed("ServiceProviderManagement") && (
          <NavLink
            to="/all-service-providers"
            ref={(r) => {
              ref["/all-service-providers"] = r;
            }}
          >
            <ReactSVG src={allServiceSvg} />
            {getter ? <span>Service Provider Management</span> : null}
          </NavLink>
        )}

        {isAllowed("Category") && (
          <>
            <NavLink
              to="/categories"
              ref={(r) => {
                ref["/categories"] = r;
              }}
            >
              <ReactSVG src={packagesSvg} />
              {getter ? <span>Category</span> : null}
            </NavLink>
          </>
        )}
        {isAllowed("Packages(Plans)") && (
          <>
            <NavLink
              to="/packages"
              ref={(r) => {
                ref["/packages"] = r;
              }}
            >
              <ReactSVG src={packagesSvg} />
              {getter ? <span>Packages (Plans)</span> : null}
            </NavLink>
          </>
        )}
        {isAllowed("DiscountCoupons") && (
          <>
            <NavLink
              to="/discount-coupons"
              ref={(r) => {
                ref["/discount-coupons"] = r;
              }}
            >
              <ReactSVG src={discountSvg} />
              {getter ? <span>Discount Coupons</span> : null}
            </NavLink>
          </>
        )}

        {isAllowed("Rating") && (
          <>
            <NavLink
              to="/rating"
              ref={(r) => {
                ref["/rating"] = r;
              }}
            >
              <ReactSVG src={badgeSvg} />
              {getter ? <span>Rating</span> : null}
            </NavLink>
          </>
        )}
        {isAllowed("Revenue") && (
          <NavLink
            to="/revenue"
            ref={(r) => {
              ref["/revenue"] = r;
            }}
          >
            <ReactSVG src={revenueSvg} />
            {getter ? <span>Revenue</span> : null}
          </NavLink>
        )}
        {isAllowed("Reports") && (
          <NavLink
            to="/reports"
            ref={(r) => {
              ref["/reports"] = r;
            }}
          >
            <ReactSVG src={revenueSvg} />
            {getter ? <span>Reports</span> : null}
          </NavLink>
        )}
        {isAllowed("Chats") && (
          <NavLink
            to="/chats"
            ref={(r) => {
              ref["/chats"] = r;
            }}
          >
            <ReactSVG src={chatsSvg} />
            {getter ? <span>Chats</span> : null}
          </NavLink>
        )}

        {isAllowed("FAQsManagement") && (
          <>
            <NavLink
              to="/faqs"
              ref={(r) => {
                ref["/faqs"] = r;
              }}
            >
              <ReactSVG src={faqSvg} />
              {getter ? <span>FAQs Management</span> : null}
            </NavLink>
          </>
        )}
        {isAllowed("ContactUs") && (
          <>
            <NavLink
              to="/contact-us"
              ref={(r) => {
                ref["/contact-us"] = r;
              }}
            >
              <ReactSVG src={ContactUsFormSvg} />
              {getter ? <span>Contact Us</span> : null}
            </NavLink>
          </>
        )}

        {isAllowed("Newsletter") && (
          <>
            <NavLink
              to="/newsletter"
              ref={(r) => {
                ref["/newsletter"] = r;
              }}
            >
              <ReactSVG src={NewsLettersSvg} />
              {getter ? <span>Newsletter</span> : null}
            </NavLink>
          </>
        )}
        {isAllowed("Settings") && (
          <>
            <NavLink
              to="/settings"
              ref={(r) => {
                ref["/settings"] = r;
              }}
            >
              <ReactSVG src={SettingsSvg} />
              {getter ? <span>Settings</span> : null}
            </NavLink>
          </>
        )}
        {/* CMS */}
        {isAllowed("CMS") && (
          <>
            <NavLink
              to="/cms"
              ref={(r) => {
                ref["/cms"] = r;
              }}
            >
              <ReactSVG src={cmsSvg} />
              {getter ? <span>CMS</span> : null}
            </NavLink>
          </>
        )}
        {isAllowed("CRUDS") && (
          <NavLink
            to="/cruds"
            ref={(r) => {
              ref["/cruds"] = r;
            }}
          >
            <ReactSVG src={cmsSvg} />
            {getter ? <span>CRUDS</span> : null}
          </NavLink>
        )}
        {isAllowed("Notifications") && (
          <NavLink
            to="/notifications"
            onClick={() => dispatch(clearNotiData())}
            ref={(r) => {
              ref["/notifications"] = r;
            }}
          >
            <ReactSVG src={notificationSvg} />
            {getter ? (
              <span>
                Notifications {noti_counter > 0 && `(${noti_counter})`}
              </span>
            ) : null}
          </NavLink>
        )}
      </div>
      <button onClick={LogoutHandler} className={styles.logout__button}>
        <ReactSVG src={logoutSvg} />
        Logout
      </button>
    </div>
  );
};

export default Navigation;
