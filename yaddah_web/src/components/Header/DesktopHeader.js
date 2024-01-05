import React, { useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Col, Container, Row, Nav } from "react-bootstrap";
import { EmptyProfile, logo } from "../../constant/imagePath";
import styles from "./DesktopHeader.module.css";
import { Button } from "../Button/Button";
import { useSelector } from "react-redux";
import { imageUrl } from "../../config/apiUrl";
import { OverlayTrigger } from "react-bootstrap";
import { useState } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";

export const DesktopHeader = ({
  onClick,
  icon,
  text1,
  text2,
  goBackOnClick,
  text1Style,
  onLogout,
  ...props
}) => {
  const { user, isLogin, accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  console.log(anchorRef, "123 321");

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  console.log(prevOpen, "prevOpen prevOpen prevOpen");
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <header className={styles.header}>
      <Container className="">
        <Row>
          <Col md={12}>
            <div className={styles.navbar__wrapper}>
              <div onClick={() => navigate("/")} className={styles.logoDiv}>
                <img src={logo} alt="..." />
              </div>
              <Nav className={styles.navbar}>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? `${[styles.navbarLinks, styles.navActive].join(" ")}`
                      : `${[styles.navbarLinks]}`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/about-us"
                  className={({ isActive }) =>
                    isActive
                      ? `${[styles.navbarLinks, styles.navActive].join(" ")}`
                      : `${[styles.navbarLinks]}`
                  }
                >
                  About Us
                </NavLink>
                <NavLink
                  to="/services"
                  className={({ isActive }) =>
                    isActive
                      ? `${[styles.navbarLinks, styles.navActive].join(" ")}`
                      : `${[styles.navbarLinks]}`
                  }
                >
                  Services
                </NavLink>
                <NavLink
                  to="/faq"
                  className={({ isActive }) =>
                    isActive
                      ? `${[styles.navbarLinks, styles.navActive].join(" ")}`
                      : `${[styles.navbarLinks]}`
                  }
                >
                  faq's
                </NavLink>
                <NavLink
                  to="/contact-us"
                  className={({ isActive }) =>
                    isActive
                      ? `${[styles.navbarLinks, styles.navActive].join(" ")}`
                      : `${[styles.navbarLinks]}`
                  }
                >
                  contact us
                </NavLink>
                <div className={styles.navbar__button}>
                  {!isLogin && (
                    <Button
                      onClick={() => navigate("/pricing")}
                      label={"Become A Service Provider"}
                      className={styles.serviceProviderBtn}
                    />
                  )}
                  {isLogin ? (
                    <>
                      <div>
                        {/* <button
                          ref={anchorRef}
                          id="composition-button"
                          aria-controls={open ? "composition-menu" : undefined}
                          aria-expanded={open ? "true" : undefined}
                          aria-haspopup="true"
                          onClick={handleToggle}
                        >
                          Dashboard 123
                        </button> */}

                        <div
                          ref={anchorRef}
                          id="composition-button"
                          aria-controls={open ? "composition-menu" : undefined}
                          aria-expanded={open ? "true" : undefined}
                          aria-haspopup="true"
                          onClick={handleToggle}
                          className={styles.imgDiv}
                        >
                          <img
                            src={imageUrl(user?.photo)}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = EmptyProfile;
                            }}
                          />
                        </div>

                        <Popper
                          open={open}
                          anchorEl={anchorRef.current}
                          role={undefined}
                          placement="bottom-start"
                          transition
                          disablePortal
                        >
                          {({ TransitionProps, placement }) => (
                            <Grow
                              {...TransitionProps}
                              style={{
                                transformOrigin:
                                  placement === "bottom-start"
                                    ? "left top"
                                    : "left bottom",
                              }}
                            >
                              <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                  <MenuList
                                    autoFocusItem={open}
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                    onKeyDown={handleListKeyDown}
                                  >
                                    <div className={styles.profileOverlay}>
                                      <div>
                                        <NavLink
                                          to="/dashboard"
                                          className={[styles.overlayLink]}
                                        >
                                          Dashboard
                                        </NavLink>
                                        <p
                                          className={[styles.overlayLink]}
                                          onClick={onLogout}
                                        >
                                          Logout
                                        </p>
                                      </div>
                                    </div>
                                  </MenuList>
                                </ClickAwayListener>
                              </Paper>
                            </Grow>
                          )}
                        </Popper>
                      </div>

                      {/* <OverlayTrigger
                        trigger={["click"]}
                        rootClose={true}
                        overlay={
                          <div className={styles.profileOverlay}>
                            <div>
                              <NavLink
                                to="/dashboard"
                                className={[styles.overlayLink]}
                              >
                                Dashboard
                              </NavLink>
                              <p
                                className={[styles.overlayLink]}
                                onClick={onLogout}
                              >
                                Logout
                              </p>
                            </div>
                          </div>
                        }
                        placement={"bottom"}
                        show={show}
                        onToggle={() => setShow(!show)}
                      ></OverlayTrigger> */}
                    </>
                  ) : (
                    <Button
                      onClick={() => navigate("/login")}
                      label={"Login"}
                      className={styles.loginBtn}
                    />
                  )}
                </div>
              </Nav>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default DesktopHeader;
