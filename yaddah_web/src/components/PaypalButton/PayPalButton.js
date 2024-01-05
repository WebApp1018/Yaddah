import { useEffect } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import classes from "./PayPalButton.module.css";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

// This values are the props in the UI
const amount = "2";
const currency = "USD";
const style = { layout: "vertical" };

// Custom component to wrap the PayPalButtons and handle currency changes
const ButtonWrapper = ({
  currency,
  showSpinner,
  onSubmit,
  orderAmount = amount,
  handleValidations,
  extraData,
}) => {
  // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
  // This is the main reason to wrap the PayPalButtons in a new component
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency, showSpinner, handleValidations, orderAmount, extraData]);

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[orderAmount, currency, style]}
        fundingSource={undefined}
        createOrder={(data, actions) => {
          return actions.order
            .create({
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: orderAmount,
                  },
                },
              ],
            })
            .then((orderId) => {
              const [params, isValid] = handleValidations();
              if (!isValid) return;

              // Your code here after create the order
              return orderId;
            });
        }}
        onApprove={function (data, actions) {
          return actions.order.capture().then(function (order) {
            // console.log(data, order);
            // Your code here after capture the order
            onSubmit(order, extraData);
          });
        }}
        onCancel={function (data) {
          console.log("cancel", data);
          // toast.error("Payment cancelled");
          // Your code here after cancel the order
        }}
        onError={function (err) {
          console.log("error", err);
          // toast.error("Payment error.");
          // Your code here after error
        }}
      />
    </>
  );
};

export default function PaypalButton({
  onSubmit,
  disabled,
  isLoading,
  handleValidations,
  price,
  containerClass,
  extraData,
}) {
  const paypalClientId = useSelector(
    (state) => state?.settingSlice?.paypalClientId
  );

  return (
    <div
      className={[classes.mainContainer, containerClass && containerClass].join(
        " "
      )}
    >
      <PayPalScriptProvider
        options={{
          "client-id": paypalClientId,
          components: "buttons",
          currency: "USD",
        }}
      >
        <ButtonWrapper
          currency={currency}
          showSpinner={false}
          onSubmit={onSubmit}
          disabled={disabled}
          isLoading={isLoading}
          handleValidations={handleValidations}
          orderAmount={price}
          extraData={extraData}
        />
      </PayPalScriptProvider>
    </div>
  );
}
