import React, { useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import styles from "./Pricing__card.module.css";
import { Button } from "../Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AreYouSureModal from "../../Modals/AreYouSureModal";
import { apiHeader, BaseURL } from "../../config/apiUrl";
import { Patch } from "../../Axios/AxiosFunctions";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../redux/auth/authSlice";
import UpdatePlanByPayment from "../../Modals/UpdatePlanByPayment/UpdatePlanByPayment";
import LottieLoader from "../LottieLoader/LottieLoader";

const PricingCard = ({ item, onSelectPackage, index = 0 }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isRequestChangePlanModalOpen, setIsRequestChangePlanModalOpen] =
    useState(false);
  const [isChangePlanApiCalling, setIsChangePlanApiCalling] = useState(false);
  const [newPlanData, setNewPlanData] = useState(null);
  const [isUpdatePlanByPaymentModalOpen, setIsUpdatePlanByPaymentModalOpen] =
    useState(false);

  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const user = useSelector((state) => state.authReducer.user);
  const paypalPlanId = item?.planData?.id;
  const userSubscribedPlanId = user?.paypalSubscriptionId;

  // changePlanHandler
  const changePlanHandler = async (subscriptionId, planId) => {
    const url = BaseURL(`users/update-plan`);
    const params = {
      package: item?._id,
      subscriptionId: userSubscribedPlanId,
      planId: paypalPlanId,
    };

    if (planId) {
      params.planId = planId;
      params.subscriptionId = subscriptionId;
    }

    setIsChangePlanApiCalling(true);
    const response = await Patch(url, params, apiHeader(accessToken));
    setIsChangePlanApiCalling(false);

    if (response !== undefined) {
      setIsRequestChangePlanModalOpen(false);
      toast.success("Plan changed successfully.");
      // navigate("/dashboard");
      dispatch(updateUser(response?.data?.data?.user));
      setIsUpdatePlanByPaymentModalOpen(false);
    }
  };

  // handlePackageSelect
  const handlePackageSelect = () => {
    // if we are already subscribed to this plan
    if (renderButtonLabel()?.toLowerCase() === "current plan") {
      return toast.success("You are already subscribed to this plan");
    }

    console.warn(user?.planType, item?.planType);
    // if the user was on none plan and he select paid plan => Paypal
    if (
      user?.planType?.toLowerCase() === "none" &&
      item?.planType?.toLowerCase() !== "free"
    ) {
      setIsUpdatePlanByPaymentModalOpen(true);
      return;
    }
    // if the user was on free plan and now he is selecting a paid plan
    if (user?.planType?.toLowerCase() === "free") {
      setIsUpdatePlanByPaymentModalOpen(true);
      return;
    }
    // if we are not subscribed to this plan
    if (accessToken && userSubscribedPlanId !== paypalPlanId) {
      setNewPlanData(item);
      setIsRequestChangePlanModalOpen(true);
      return;
    }
    // if we are not logged in
    onSelectPackage(item);
  };

  // renderButtonLabel
  const renderButtonLabel = () => {
    if (
      user?.planType?.toLowerCase() === "free" &&
      user?.planType === item?.planType
    ) {
      return "Current Plan";
    }

    // if token and plan isd matched and not on free plan
    if (accessToken && user?.paypalPlanId === paypalPlanId) {
      return "Current Plan";
    } else {
      return `Select ${item?.planType}`;
    }
  };

  return (
    <div
      className={styles.pricing__card__wrapper}
      style={{
        backgroundColor:
          index % 2 == 0 ? "var(--bg-card)" : "var(--clr-primary)",
      }}
    >
      <div className={styles.pricing__card}>
        <p className={styles.pricing__header}>{item?.packageType}</p>

        <p className={styles.card__price}>
          USD${item.price}
          {item.period !== null ? <span>{item?.planType}</span> : null}
        </p>

        <div className={styles.border__bottom__wrapper}>
          {/* {item.noOfMonthsFree !== null ? (
            <p className={styles.card__freeMonths}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                m
              ({item.noOfMonthsFree} Months free)
            </p>
          ) : null} */}

          <p>Include Monthly Bookings: {item.includeBooking}</p>

          <p>Locations (venue): {item.locationVenue}</p>

          <p>Staff: {item.staff}</p>
          <p>Services: {item?.services}</p>
          <p>
            <AiOutlineCheckCircle /> Online Payment
          </p>
        </div>
        <Button label={renderButtonLabel()} onClick={handlePackageSelect} />
      </div>

      {isRequestChangePlanModalOpen && (
        <AreYouSureModal
          isApiCall={isChangePlanApiCalling}
          show={isRequestChangePlanModalOpen}
          setShow={setIsRequestChangePlanModalOpen}
          subTitle={`Are you sure you want to ${
            item?.planType?.toLowerCase() === "free"
              ? "switch to a free plan?"
              : "change your plan?"
          }`}
          onClick={changePlanHandler}
        />
      )}

      {isUpdatePlanByPaymentModalOpen && (
        <UpdatePlanByPayment
          show={isUpdatePlanByPaymentModalOpen}
          setShow={setIsUpdatePlanByPaymentModalOpen}
          packageData={item}
          handleSubmit={changePlanHandler}
          styles={styles?.bodyLoader}
          isLoading={isChangePlanApiCalling}
        />
      )}
    </div>
  );
};
export default PricingCard;
