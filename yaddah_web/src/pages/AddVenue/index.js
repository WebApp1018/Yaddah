import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import DropDown from "../../components/DropDown";
import { Input } from "../../components/Input/Input";
import Maps from "../../components/MapAndPlaces";
import SidebarSkeleton from "../../components/SidebarSkeleton";
import UploadImageBox from "../../components/SquareUploadImageBox";
import Toggler from "../../components/Toggler";
import classes from "./AddVenue.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomPhoneInput from "../../components/CustomPhoneInput";
import { Button } from "../../components/Button/Button";
import { toast } from "react-toastify";
import {
  apiHeader,
  BaseURL,
  capitalizeFirstLetter,
  CreateFormData,
  formRegEx,
  formRegExReplacer,
  validateEmail,
} from "../../config/apiUrl";
import { Get, Patch, Post } from "../../Axios/AxiosFunctions";
import { useNavigate } from "react-router-dom";
import { TextArea } from "../../components/TextArea";
import moment from "moment";
import { Loader } from "../../components/Loader";
import MultiDatePicker from "../../components/MultiDatePicker";
import validator from "validator";
import { setAllVenues } from "../../redux/common/commonSlice";

const AddVenue = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = useParams()?.id;
  // const id = undefined;

  const accessToken = useSelector((state) => state.authReducer.accessToken);

  const { allCategories, allVenues } = useSelector(
    (state) => state?.commonReducer
  );
  const [isLoading, setIsLoading] = useState(false);
  const [innerLoading, setInnerLoading] = useState(false);
  const [images, setImages] = useState([null]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [name, setName] = useState();
  const [description, setDescription] = useState("");
  const [date, setDate] = useState([]);
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [categories, setCategories] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [checked, setChecked] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  function setVenueToReducer(d, type = "edit") {
    const newData = [...allVenues];
    if (type == "add") {
      newData.push(d);
    } else if (type == "edit") {
      if (newData?.findIndex((item) => item?._id == d?._id) == -1) {
        newData.push(d);
      } else {
        newData.splice(
          newData?.findIndex((item) => item?._id == d?._id),
          1,
          d
        );
      }
    } else {
      newData.splice(
        newData?.findIndex((item) => item?._id == d?._id),
        1
      );
    }
    dispatch(setAllVenues(newData));
  }

  const [placeDetail, setPlaceDetail] = useState("");
  async function getSingleVenue() {
    const url = BaseURL(`venue/${id}`);
    setIsLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      const venueData = response?.data?.data;
      setName(venueData.name);
      setDescription(venueData.description);
      setAddress(venueData.address);
      setCountry(venueData.country);
      setState(venueData.state);
      setCity(venueData.city);
      setContactName(venueData.contactName);
      setEmail(venueData.contactEmail);
      setPhone(venueData.contactNumber);
      setCategories(venueData.serviceCategory);
      setImages(venueData.images);
      setDate(venueData.disabledDates);
      setChecked(venueData?.isActive);
      setCoordinates({
        lng: venueData.location.coordinates[0],
        lat: venueData.location.coordinates[1],
      });
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (id !== undefined) {
      getSingleVenue();
    }
  }, []);

  useEffect(() => {
    if (placeDetail !== "") {
      setCountry(placeDetail?.country);
      setState(placeDetail?.state);
      setCity(placeDetail?.city);
    }
  }, [placeDetail]);

  // deleteImages
  async function deleteImages() {
    const url = BaseURL(`venue/delete-images/${id}`);
    const response = await Patch(
      url,
      { delImages: deletedImages },
      apiHeader(accessToken)
    );
    return response;
  }

  // Activate Deactivate Venue
  async function activateDeactivate(e) {
    setStatusLoading(true);
    const url = BaseURL(`venue/activate-deactivate/${id}`);
    const response = await Patch(url, { status: e }, apiHeader(accessToken));
    if (response != undefined) {
      setChecked(response?.data?.data?.isActive);
      toast.success(`Venue ${e ? "activated" : "deactivated"} successfully`);
      setStatusLoading(false);
    }
  }

  // addOrEditVenueHandler
  const addOrEditVenueHandler = async () => {
    let url = BaseURL(id ? `venue/${id}` : `venue`);
    let params = {
      name: name,
      description,
      lat: coordinates.lat,
      lng: coordinates.lng,
      address: address,
      country: country,
      state: state,
      city: city,
      contactName: contactName,
      contactEmail: email,
      contactNumber: phone?.includes("+") ? phone : `+${phone}`,
      serviceCategory: categories.map((item) => item._id),
      venueImages: images?.filter((item) => item !== null),
    };

    // validate
    for (let key in params) {
      if (params[key] == null || params[key] == "") {
        return toast.error(
          `${capitalizeFirstLetter(
            key?.replace(formRegEx, formRegExReplacer)
          )} can not be empty`
        );
      } else if (Array.isArray(params[key])) {
        if (params["serviceCategory"].length === 0) {
          return toast.error(`Please add Category`);
        }
        if (params["venueImages"].length === 0) {
          return toast.error(`Please upload at least 3 photos`);
        }
      }
    }

    if (!validateEmail(email))
      return toast.error(`Please enter a valid email address.`);
    if (!validator.isMobilePhone(params.contactNumber))
      return toast.error(`Please enter a valid contact phone`);
    params = {
      ...params,
      disabledDates: date?.map((item) => moment(new Date(item)).format()),
    };

    const formData = await CreateFormData(params);
    id && deletedImages.length > 0 && deleteImages();
    setInnerLoading(true);
    const apiFunc = id ? Patch : Post;
    const response = await apiFunc(url, formData, apiHeader(accessToken, true));
    if (response) {
      if (id) {
        setVenueToReducer(
          response?.data?.data,
          response?.data?.data?.isActive ? "edit" : "delete"
        );
      } else {
        setVenueToReducer(response?.data?.data);
      }
      toast.success(`Venue ${id ? "edited" : "created"} successfully`);
      navigate(-1);
    }
    setInnerLoading(false);
  };

  return (
    <SidebarSkeleton>
      {isLoading ? (
        <Loader className={classes.loader} />
      ) : (
        <Container fluid className={classes.main}>
          <Row className={classes.addVenue_row}>
            <Col md={12}>
              <div className={classes.header}>
                <h2>{id ? "Edit" : "Add"} Venue</h2>
                {id && (
                  <Toggler
                    checked={checked}
                    setChecked={() => activateDeactivate(!checked)}
                    text="Active"
                    disabled={statusLoading}
                  />
                )}
              </div>
            </Col>
            {/* <Toggler text="Add Venue" setChecked={setChecked} checked={checked} /> */}

            <Col md={6}>
              <Input form label={"Venue Name"} setter={setName} state={name} />
            </Col>
            <Col md={6}>
              {/* <Input form label={"Map Address"} /> */}
              <Maps
                // setCoordinates={setCoordinates}
                label={"Address"}
                type="location"
                setPlaceDetail={setPlaceDetail}
                setCoordinates={setCoordinates}
                setAddress={setAddress}
                address={address}
              />
            </Col>

            <Col md={6}>
              <Input
                form
                label={"Country"}
                disabled={country == null || placeDetail?.country !== ""}
                setter={setCountry}
                state={country}
              />
            </Col>
            <Col md={6}>
              <Input
                form
                label={"State"}
                disabled={state == null || placeDetail?.state !== ""}
                setter={setState}
                state={state}
              />
            </Col>
            <Col md={6}>
              <Input
                form
                label={"City"}
                disabled={city == null || placeDetail?.city !== ""}
                setter={setCity}
                state={city}
              />
            </Col>
            <Col md={6}></Col>
            {coordinates && (
              <Col md={6}>
                <Maps location={coordinates} className={classes.map_compo} />
              </Col>
            )}

            <Col md={12}>
              <TextArea
                form
                value={description}
                setter={setDescription}
                label={"Description"}
                placeholder="Enter Description"
              />
            </Col>
          </Row>

          <Row className={classes.other_rows}>
            <Col md={12}>
              <h6>Contact Information</h6>
            </Col>
            <Col md={6}>
              <Input
                form
                label={"Contact Name"}
                setter={setContactName}
                state={contactName}
              />
            </Col>
            <Col md={6}>
              <Input
                form
                label={"Contact Email"}
                setter={setEmail}
                state={email}
                disabled={id && true}
              />
            </Col>
            <Col md={6}>
              <CustomPhoneInput
                form
                label={"Contact Phone"}
                setter={setPhone}
                value={phone}
              />

              {/* <Input
              form
              label={"Contact Phone"}
              setter={setPhone}
              state={phone}
            /> */}
            </Col>
          </Row>
          <Row className={classes.other_rows}>
            <Col md={12}>
              <h6>Other Information</h6>
            </Col>
            <Col md={12}>
              <DropDown
                label={"Service Category"}
                placeholder={"Select Service Category"}
                form
                setter={setCategories}
                value={categories}
                options={allCategories}
                optionLabel={"name"}
                optionValue={"_id"}
                isMulti
              />
            </Col>

            <Col md={12}>
              <MultiDatePicker
                label={"Select Disabled Dates"}
                setValue={setDate}
                value={date}
                placeholder={"Select disabled dates"}
              />
            </Col>
            <Col md={12}>
              <Row className={classes.inputWrap}>
                <Col md={12}>
                  <h6>Photos</h6>
                </Col>
                {images?.map((item, index) => (
                  <Col md={2} className="mb-2" key={index}>
                    <UploadImageBox
                      state={item}
                      setter={(e) => {
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
            <Col md={12} className={'btnWithGap'}>
              <Button
                label={
                  innerLoading
                    ? "Please Wait.."
                    : id
                    ? "Edit Venue"
                    : "Add Venue"
                }
                variant={"secondary"}
                onClick={addOrEditVenueHandler}
              />
                {id && <Button
                label={
                  'Cancel'
                }
                variant={"secondary"}
                onClick={()=>{ window.location.reload()}}
              />}
            </Col>
          </Row>
        </Container>
      )}
    </SidebarSkeleton>
  );
};

export default AddVenue;
