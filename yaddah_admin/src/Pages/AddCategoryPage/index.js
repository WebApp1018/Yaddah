import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import {  useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Get, Patch, Post } from "../../Axios/AxiosFunctions";
import { Button } from "../../Components/Button/Button";
import { Input } from "../../Components/Input/Input";
import { Loader } from "../../Components/Loader";
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import UploadImageBox from "../../Components/SquareUploadImageBox";
import { TextArea } from "../../Components/TextArea";
import Toggler from "../../Components/Toggler";
import {
  apiHeader,
  BaseURL,
  capitalizeFirstLetter,
  CreateFormData,
  formRegEx,
  formRegExReplacer,
  imageUrl,
} from "../../config/apiUrl";

import classes from "./AddCategoryPage.module.css";

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.authReducer.accessToken);
  const slug = useParams()?.slug;
  const [img, setImg] = useState(null);
  const [active, setActive] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [isApiCalling, setIsApiCalling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // addCategory
  const addorEditCategory = async () => {
    const url = BaseURL(slug ? `category/${slug}` : `category`);

    let params = {
      ...(slug == undefined && { name: categoryName }),
      description: categoryDescription,
      catImage: img,
    };

    // validate
    for (let key in params) {
      if (params[key] == "" || params[key] == null)
        return toast.error(
          `${capitalizeFirstLetter(
            key?.replace(formRegEx, formRegExReplacer)
          )} can not be empty.`
        );
    }
    params = {
      ...params,
      ...(slug && { isActive: active }),
    };
    const formData = await CreateFormData(params);
    setIsApiCalling(true);
    const apiFunc = slug ? Patch : Post;
    const response = await apiFunc(url, formData, apiHeader(token, true));

    if (response) {
      toast.success(`Category ${slug ? "edited" : "added"} successfully`);
      setIsApiCalling(false);
      navigate(-1);
    }
    setIsApiCalling(false);
  };
  const getCategory = async () => {
    const url = BaseURL(`category/view-detail/${slug}`);
    setIsLoading(true);
    const response = await Get(url, token);

    if (response) {
      const catData = response?.data?.data;
      setCategoryName(catData?.name);
      setCategoryDescription(catData?.description);
      setImg(catData?.image);
      setActive(catData?.isActive)
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (slug) {
      getCategory();
    }
  }, [slug]);

  return (
    <SidebarSkeleton>
      <Container fluid className={classes.container}>
        {/* main */}
        {isLoading ? (
          <Loader className={classes.loader} />
        ) : (
          <>
            <div className={classes.header}>
              <h3>{slug ? "Edit" : "Add"} Category</h3>
              {slug && (
                <Toggler
                  text="Active"
                  setChecked={setActive}
                  checked={active}
                />
              )}
            </div>
            {/* Row */}
            <Row>
              <Col md={12} sm={12}>
                <Input
                  form
                  label="Category Name"
                  value={categoryName}
                  setter={setCategoryName}
                  disabled={!!slug}
                />
              </Col>
            </Row>
            {/* Row */}
            <Row className="mt-4">
              <TextArea
                label={"Description"}
                form
                value={categoryDescription}
                setter={setCategoryDescription}
              />
            </Row>

            <Row className={classes?.imageBoxContainer}>
              <label>Photo</label>
              <Col md={2}>
                <UploadImageBox
                  state={typeof img == "string" ? imageUrl(img) : img}
                  setter={setImg}
                  onEdit={(e) => {
                    setImg(e);
                  }}
                  acceptedFiles={['.jpg','.jpeg','.png','.webp']}
                />
              </Col>
            </Row>

            <div className={classes?.buttonContainer}>
              <Button
                label={
                  isApiCalling
                    ? "Please Wait.."
                    : slug
                    ? "Edit Category"
                    : "Add Category"
                }
                disabled={isApiCalling}
                onClick={addorEditCategory}
                variant="secondary"
              />
            </div>
          </>
        )}
      </Container>
    </SidebarSkeleton>
  );
};

export default AddCategoryPage;
