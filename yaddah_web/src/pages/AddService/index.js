import React from "react";
import { Col, Row } from "react-bootstrap";
import { Button } from "../../components/Button/Button";
import DropDown from "../../components/DropDown";
import { Input } from "../../components/Input/Input";
import SidebarSkeleton from "../../components/SidebarSkeleton";
import { TextArea } from "../../components/TextArea";
import SquareUploadImageBox from "../../components/SquareUploadImageBox";
import classes from "./AddService.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { useState } from "react";
import { toast } from "react-toastify";
import Toggler from "../../components/Toggler";
import { useSelector } from "react-redux";
import {
  apiHeader,
  BaseURL,
  CreateFormData,
  maxServiceTimeLimit,
} from "../../config/apiUrl";
import { Get, Patch, Post } from "../../Axios/AxiosFunctions";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Loader } from "../../components/Loader";

const AddService = () => {
  const id = useParams()?.id;
  const navigate = useNavigate();
  const { allCategories, allStaffs, allVenues } = useSelector(
    (state) => state?.commonReducer
  );
  const { accessToken } = useSelector((state) => state?.authReducer);
  const [serviceName, setserviceName] = useState("");
  const [active, setActive] = useState(false);
  const [images, setImages] = useState([null]);
  const [price, setPrice] = useState("");
  const [length, setLength] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [staff, setStaff] = useState("");
  const [venue, setVenue] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isGetting, setIsGetting] = useState(false);

  const [statusLoading, setStatusLoading] = useState(false);

  async function deleteImages() {
    const url = BaseURL(`service/delete-images/${id}`);
    const response = await Patch(
      url,
      { delImages: deletedImages },
      apiHeader(accessToken)
    );
    return response;
  }

  // Activate Deactivate Service
  async function activateDeactivate(e) {
    setStatusLoading(true);
    const url = BaseURL(`service/activate-deactivate/${id}`);
    const response = await Patch(url, { status: e }, apiHeader(accessToken));
    if (response != undefined) {
      setActive(response?.data?.data?.isActive);
      toast.success(`Service ${e ? "activated" : "deactivated"} successfully`);
      setStatusLoading(false);
    }
  }

  const handleAddOrEdit = async () => {
    let params = {
      name: serviceName,
      price,
      length,
      description,
      category: category?._id,
      venue: venue?.map((item) => item?._id),
      staff: staff?.map((item) => item?._id),
      serviceImages: images?.filter((item) => item !== null),
    };
    // validate
    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error(`Please fill all the fields`);
      } else if (params[key] <= 0) {
        return toast.error(`Please provide the ${key} field`);
      } else if (params["length"] % 30 != 0) {
        return toast.error("Length must be muliple of 30");
      } else if (Number(params["length"]) > maxServiceTimeLimit) {
        return toast.error("Length can not be greater than 8 hours");
      } else if (Array.isArray(params[key])) {
        if (params["staff"].length < 1) {
          return toast.error(`Please add at least 1 staff`);
        }
        if (params["serviceImages"].length < 1) {
          return toast.error(`Please upload at least 1 image`);
        }
      }
    }

    const formData = await CreateFormData(params);
    const url = BaseURL(id ? `service/${id}` : `service`);
    setIsLoading(true);
    id && deletedImages?.length > 0 && (await deleteImages());
    const apiFunc = id ? Patch : Post;
    const response = await apiFunc(url, formData, apiHeader(accessToken, true));
    setIsLoading(false);
    if (response != undefined) {
      toast.success(`Service ${id ? "edited" : "created"}  successfully`);
      navigate(-1);
    }
  };

  // Edit
  async function getServiceDetail() {
    const url = BaseURL(`service/${id}`);
    setIsGetting(true);
    const response = await Get(url, accessToken);
    if (response) {
      const serviceData = response?.data?.data;
      setserviceName(serviceData?.name);
      setStaff(serviceData?.staff);
      setLength(serviceData?.length);
      setPrice(serviceData?.price);
      setDescription(serviceData?.description);
      setImages(serviceData?.images);
      setCategory(serviceData?.category);
      setVenue(serviceData?.venue);
      setActive(serviceData?.isActive);
    }
    setIsGetting(false);
  }

  useEffect(() => {
    if (id) {
      getServiceDetail();
    }
  }, [id]);

  return (
    <SidebarSkeleton>
      <div className={classes.main}>
        {isGetting ? (
          <Loader className={classes.loader} />
        ) : (
          <div className={classes.content}>
            <div className={classes.header}>
              <h3>{id ? "Edit" : "Add"} Service</h3>
              {id && (
                <Toggler
                  text="Active"
                  setChecked={() => activateDeactivate(!active)}
                  checked={active}
                  disabled={statusLoading}
                />
              )}
            </div>
            <Row className={classes.inputWrap}>
              <Col md={6}>
                <DropDown
                  form
                  options={allStaffs}
                  label={"Select Staff"}
                  placeholder="Select Staff"
                  optionLabel={"staffName"}
                  optionValue={"_id"}
                  value={staff}
                  setter={setStaff}
                  isMulti
                />
              </Col>
              <Col md={6}>
                <Input
                  state={serviceName}
                  setter={setserviceName}
                  form
                  label={"Service Name"}
                  placeholder="Enter Service Name"
                />
              </Col>
              <Col md={6}>
                <Input
                  state={price}
                  setter={setPrice}
                  form
                  label="Price"
                  placeholder="Enter Price"
                  type="tel"
                />
              </Col>
              <Col md={6}>
                <Input
                  state={length}
                  setter={setLength}
                  form
                  label="Length(Minutes)"
                  placeholder="Enter Length"
                  type="tel"
                />
              </Col>
              <Col md={12}>
                <TextArea
                  value={description}
                  setter={setDescription}
                  label="Service Description"
                  form
                />
              </Col>
              <Col md={6}>
                <DropDown
                  form
                  options={allCategories}
                  label={"Select Category"}
                  placeholder="Select Category"
                  optionLabel={"name"}
                  optionValue={"_id"}
                  value={category}
                  setter={setCategory}
                />
              </Col>
              <Col md={6}>
                <DropDown
                  form
                  options={allVenues}
                  label={"Select Venue"}
                  placeholder="Select Venue"
                  optionLabel={"name"}
                  optionValue={"_id"}
                  value={venue}
                  setter={setVenue}
                  isMulti
                />
              </Col>
              <Col md={12}>
                <Row className={classes.inputWrap}>
                  <Col md={12}>
                    <h6>Photos</h6>
                  </Col>
                  {images?.map((item, index) => (
                    <Col md={6} lg={3} sm={6} key={index}>
                      <SquareUploadImageBox
                        state={item}
                        setter={(e) => {
                          console.log({e},'file')
                          if(!['image/png','image/jpg','image/jpeg'].includes(e?.type)){
                            return toast.error("Invalid File Type, Only JPEG, JPG and PNG formats are allowed")
                          }
                          const newImages = [...images];
                          newImages[index] = e;
                          setImages(newImages);
                        }}
                        hideDeleteIcon={images.length > 1 && true}
                        isCloseable={images.length > 1 && !item && true}
                        onDelete={() => {
                          setImages(
                            images.filter((element, pos) => index != pos)
                          );
                          if (typeof item == "string") {
                            setDeletedImages((prev) => [...prev, item]);
                          }
                        }}
                        onClose={() => {
                          setImages(
                            images.filter((element, pos) => index != pos)
                          );
                        }}
                      />
                    </Col>
                  ))}
                  {images?.length < 5 && (
                    <Col
                      md={2}
                      className={classes.add}
                      onClick={() => {
                        setImages((prev) => [...prev, null]);
                      }}
                    >
                      <AiOutlinePlus size={80} color={"var(--clr-secondary)"} />
                    </Col>
                  )}
                </Row>
              </Col>
              <Col className="btnWithGap">
                <Button
                  onClick={handleAddOrEdit}
                  label={
                    isLoading
                      ? "Please Wait..."
                      : id
                      ? "Edit Service"
                      : "Add Service"
                  }
                  disabled={isLoading}
                />
                {id && (
                  <Button
                    label={"Cancel"}
                    variant={"secondary"}
                    onClick={() => {
                      window.location.reload();
                    }}
                  />
                )}
              </Col>
            </Row>
          </div>
        )}
      </div>
    </SidebarSkeleton>
  );
};

export default AddService;
