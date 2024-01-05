import React, { useState } from "react";
import classes from "./MobileHeader.module.css";
import { logo as Logo } from "../../constant/imagePath";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiBook2Fill } from "react-icons/ri";
import { AiFillContacts } from "react-icons/ai";
import { IoHome, IoLogIn, IoLogOut } from "react-icons/io5";
import { MdDesignServices, MdSpaceDashboard } from "react-icons/md";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaQuestion } from "react-icons/fa";

const MobileHeader = ({ customStyle, logo = Logo, onLogout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, fcmToken, isLogin } = useSelector(
    (state) => state?.authReducer
  );
  //   const socket = io(apiUrl);

  // current page url path name
  const currentPage = window.location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const RenderListItem = ({ icon, text, customClass, path, href }) => {
    return (
      <div
        className={[classes.listItem, customClass].join(" ")}
        onClick={() => {
          if (path.toLowerCase() == "logout") {
            // socket.emit("logout", user?._id, fcmToken);
            // dispatch(signOutRequest());
            // navigate("/");
          } else if (path.toLowerCase() == "login") {
          } else {
            navigate(path, { state: { href } });
          }
        }}
      >
        {icon}
        <span className={classes.listItemText}>{text}</span>
      </div>
    );
  };
  return (
    <>
      <div className={classes.headerMainDiv} id={"navMobileHeader"}>
        <div className={classes.header} style={{ ...customStyle }}>
          <div className={classes.imageContainer}>
            <img src={logo} className={classes.logo} alt="logo" />
          </div>
          <GiHamburgerMenu
            className={classes.hamburger}
            onClick={() => {
              toggleDrawer();
            }}
          />
        </div>
        <Drawer
          open={isOpen}
          onClose={toggleDrawer}
          direction="right"
          className="bla bla bla"
        >
          <div className={classes.drawerContainer}>
            <div className={classes.drawerUserSection}>
              <>
                <img src={logo} className={classes.drawerLogo} alt="logo" />
              </>
            </div>
            <div className={classes.drawerList}>
              <>
                <RenderListItem
                  icon={<IoHome />}
                  text={"Home"}
                  customClass={currentPage == "/" && classes.activeItem}
                  path={"/"}
                />
                <RenderListItem
                  icon={<RiBook2Fill />}
                  text={"About Us"}
                  customClass={currentPage == "/about-us" && classes.activeItem}
                  path={"/about-us"}
                />
                <RenderListItem
                  icon={<MdDesignServices />}
                  text={"Services"}
                  customClass={currentPage == "/services" && classes.activeItem}
                  path={"/services"}
                />
                <RenderListItem
                  icon={<FaQuestion />}
                  text={"FAQ"}
                  customClass={currentPage == "/faq" && classes.activeItem}
                  path={"/faq"}
                />

                <RenderListItem
                  icon={<AiFillContacts />}
                  text={"Contact Us"}
                  customClass={
                    currentPage == "/contact-us" && classes.activeItem
                  }
                  path={"/contact-us"}
                />

                <hr
                  style={{
                    width: "100%",
                    marginBottom: "0px",
                  }}
                />
                {isLogin ? (
                  <>
                    <RenderListItem
                      icon={<MdSpaceDashboard />}
                      text={"Dasboard"}
                      customClass={
                        currentPage == "/dashboard" && classes.activeItem
                      }
                      path={"/dashboard"}
                    />
                    <div onClick={onLogout}>
                      <RenderListItem
                        icon={<IoLogOut />}
                        text={"logout"}
                        path={"logout"}
                      />
                    </div>
                  </>
                ) : (
                  <RenderListItem
                    icon={<IoLogIn />}
                    text={"Login"}
                    path={"/login"}
                  />
                )}
              </>
            </div>
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default MobileHeader;
