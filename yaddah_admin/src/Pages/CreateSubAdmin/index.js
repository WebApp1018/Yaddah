import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Button } from "../../Components/Button/Button";
import { Input } from "../../Components/Input/Input";
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import {
  apiHeader,
  BaseURL,
  formRegEx,
  formRegExReplacer,
} from "../../config/apiUrl";
import { Patch, Post } from "../../Axios/AxiosFunctions";
import classes from "./CreateSubAdmin.module.css";
import { DropDown } from "../../Components/DropDown/DropDown";
import { toast } from "react-toastify";
import { permissionsOptions } from "../../constant/staticData";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import validator from "validator";

function CreateSubAdmin() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.authReducer);
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const backPageData = useLocation()?.state;

  async function addSubAdmin() {
    const apiUrl = backPageData
      ? `users/admin/update/sub-admin/${backPageData?._id}`
      : "users/admin/create/sub-admin";

    const url = BaseURL(apiUrl);
    let body = {
      userName,
      email,
      fullName,
      ...(!backPageData && { password }),
    };

    for (let key in body) {
      if (body[key] == "" || body[key] == null) {
        return toast.error(
          `Please fill the ${key
            .replace(formRegEx, formRegExReplacer)
            .toLowerCase()} field`
        );
      }
    }
    if (!validator.isEmail(email)) {
      return toast.error("Your email is not valid");
    }
    if (permissions?.length == 0) {
      return toast.error("Please assign permission");
    }
    body = {
      ...body,
      permissions: permissions?.map((item) => item?.value),
    };
    setIsLoading(true);
    const apiFunc = backPageData ? Patch : Post;
    const response = await apiFunc(url, body, apiHeader(accessToken));
    if (response) {
      setIsLoading(false);
      toast.success(
        `Sub Admin ${backPageData ? "Updated" : "Created"} successfully`
      );
      navigate(-1);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (backPageData) {
      setUserName(backPageData?.userName);
      setEmail(backPageData?.email);
      setFullName(backPageData?.fullName);
      let temp = [];
      backPageData?.permissions?.map((item) => {
        permissionsOptions?.map((item2) => {
          if (item2?.value === item) {
            temp.push(item2);
          }
        });
      });
      setPermissions([...temp]);
    }
  }, []);

  return (
    <SidebarSkeleton>
      <div>
        <Container fluid className={classes.container}>
          <Row className={classes.row}>
            <Col md={12}>
              <h3>{backPageData ? "Updated" : "Add"} Sub Admin</h3>
            </Col>
            <Col md={6}>
              <Input
                value={userName}
                disabled={backPageData}
                setter={setUserName}
                label={"User Name (Required)"}
                placeholder={"Enter user name here"}
                form
              />
            </Col>
            <Col md={6}>
              <Input
                value={email}
                disabled={backPageData}
                setter={setEmail}
                label={"Email (Required)"}
                placeholder={"Enter email here"}
                form
              />
            </Col>
            <Col md={6}>
              <Input
                value={fullName}
                setter={setFullName}
                label={"Full Name"}
                placeholder={"Enter full name here"}
                form
              />
            </Col>

            <Col md={6}>
              <DropDown
                value={permissions}
                optionLabel={"label"}
                optionValue={"value"}
                setter={setPermissions}
                label={"Permissions"}
                placeholder={"Select permission"}
                form
                options={permissionsOptions}
                isMulti
              />
            </Col>
            <Col md={6}>
              {!backPageData && (
                <Input
                  value={password}
                  setter={setPassword}
                  label={"Password (Required)"}
                  placeholder={"Enter password here"}
                  form
                />
              )}
            </Col>
            <Col md={12}>
              <Button
                onClick={addSubAdmin}
                className={classes.btnSecondary}
                disabled={isLoading}
              >
                {isLoading
                  ? "Please Wait..."
                  : `${backPageData ? "Updated" : "Add"} Sub Admin`}
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </SidebarSkeleton>
  );
}

export default CreateSubAdmin;
