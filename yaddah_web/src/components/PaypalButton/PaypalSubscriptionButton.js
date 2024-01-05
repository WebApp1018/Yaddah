import { useEffect } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import classes from "./PayPalButton.module.css";
import { useSelector } from "react-redux";

const ButtonWrapper = ({
  type,
  planId,
  price,
  onSubmit,
  isfomrValidated,
  handleValidate,
}) => {
  const [{ options }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        intent: "subscription",
      },
    });
  }, [type, planId, isfomrValidated]);

  return (
    <PayPalButtons
      createSubscription={(data, actions) => {
        return actions.subscription
          .create({
            plan_id: planId,
            auto_renewal: true,
          })
          .then((orderId) => {
            // Your code here after create the order
            return orderId;
          });
      }}
      onApprove={(data, actions) => {
        const [_, isValid] = handleValidate();
        if (!isValid) return;
        // Capture the funds from the transaction
        return actions.subscription.get().then(function (details) {
          // Show a success message to your buyer
          onSubmit(details?.id, details?.plan_id);
        });
      }}
      onError={(err) => {
        // Show an error message to your buyer
      }}
      style={{
        label: "subscribe",
      }}
    />
  );
};

export default function PaypalSubscriptionButton({
  containerClass,
  planId,
  price,
  onSubmit,
  isfomrValidated,
  handleValidate,
}) {
  const paypalClientId = useSelector(
    (state) => state?.settingSlice?.paypalClientId
  );

  return (
    <PayPalScriptProvider
      className={[classes.mainContainer, containerClass && containerClass].join(
        " "
      )}
      options={{
        "client-id": paypalClientId, //! from api
        components: "buttons",
        intent: "subscription",
        vault: true,
      }}
    >
      <ButtonWrapper
        type="subscription"
        planId={planId}
        price={price}
        onSubmit={onSubmit}
        isfomrValidated={isfomrValidated}
        handleValidate={handleValidate}
      />
    </PayPalScriptProvider>
  );
}
