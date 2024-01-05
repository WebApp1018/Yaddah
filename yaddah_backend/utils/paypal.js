const axios = require('axios');
const paypal = require('paypal-rest-sdk');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
// const { PAYPAL_WEBHOOK_ID, CLIENT_ID, APP_SECRET } = process.env;
const paymentConfig = require('../paymentConfig.json');
const baseURL =
  paymentConfig.MODE == 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';
// const baseURL = 'https://api-m.sandbox.paypal.com';
const catchAsync = require('./catchAsync');
const User = require('../models/userModel');
const { createNotification } = require('../controllers/notificationController');
let CLIENT_ID = null,
  APP_SECRET = null;

paypal.configure({
  mode: 'sandbox',
  client_id: CLIENT_ID,
  client_secret: APP_SECRET,
});

// configure PayPal SDK with your API credentials
if (paymentConfig.MODE == 'sandbox') {
  paypal.configure({
    mode: paymentConfig.MODE,
    client_id: paymentConfig.CLIENT_ID_SANDBOX,
    client_secret: paymentConfig.APP_SECRET_SANDBOX,
  });
  CLIENT_ID = paymentConfig.CLIENT_ID_SANDBOX;
  APP_SECRET = paymentConfig.APP_SECRET_SANDBOX;
} else {
  paypal.configure({
    mode: paymentConfig.MODE,
    client_id: paymentConfig.CLIENT_ID_LIVE,
    client_secret: paymentConfig.APP_SECRET_LIVE,
  });
  CLIENT_ID = paymentConfig.CLIENT_ID_LIVE;
  APP_SECRET = paymentConfig.APP_SECRET_LIVE;
}

const generateAccessToken = async () => {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  const auth = Buffer.from(`${CLIENT_ID}:${APP_SECRET}`).toString('base64');
  const data = await axios.post(`${baseURL}/v1/oauth2/token`, params, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  return data.data?.access_token;
};

exports.generateAccessToken = generateAccessToken;

exports.payWithPayPal = async (accessToken, payee, amount) => {
  // create accessToken using your clientID and clientSecret
  // for the full stack example, please see the Standard Integration guide
  // https://developer.paypal.com/docs/checkout/standard/integrate/
  const result = await axios.post(
    `${baseURL}/v2/checkout/orders`,
    {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            value: amount,
            currency_code: 'USD',
          },
          payee: {
            email_address: payee.email_address,
          },
        },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return result;
};

exports.confirmSingleOrderWithPayPal = async (accessToken, orderId) => {
  const result = await axios.get(`${baseURL}/v2/checkout/orders/${orderId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return result;
};

exports.createPaypalPlan = async (
  accessToken,
  name,
  description,
  interval_unit,
  value,
  prodId
) => {
  // interval_unit: 'MONTH'
  const planData = {
    product_id: prodId,
    name,
    description,
    status: 'ACTIVE',
    billing_cycles: [
      {
        frequency: {
          interval_unit,
          interval_count: 1,
        },
        tenure_type: 'REGULAR',
        sequence: 1, // 1 means first cycle
        total_cycles: 0, // 0 means infinite cycles until cancelled
        pricing_scheme: {
          fixed_price: {
            value,
            currency_code: 'USD',
          },
        },
      },
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
    },
    taxes: {
      percentage: '0',
      inclusive: false,
    },
  };

  const result = await axios.post(`${baseURL}/v1/billing/plans`, planData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return result?.data;
};

exports.updatePayPalSubscription = async (
  accessToken,
  subscriptionId,
  prodId
) => {
  const planData = {
    plan_id: prodId,
  };

  const result = await axios.post(
    `${baseURL}/v1/billing/subscriptions/${subscriptionId}/revise`,
    planData,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return result?.data;
};

exports.cancelPayPalSubscription = async (
  accessToken,
  subscriptionId,
  reason
) => {
  const result = await axios.post(
    `${baseURL}/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {
      reason,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return result?.data;
};

exports.fullRefundPayment = async (accessToken, captureId, reason) => {
  const response = await axios.post(
    `${baseURL}/v2/payments/captures/${captureId}/refund`,
    {
      note_to_payer: reason,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'PayPal-Request-Id': uuidv4(),
      },
    }
  );
  return response?.data;
};

exports.createPayPalWebHook = async (accessToken, event_types) => {
  const params = {
    url: 'https://yaddah-be.herokuapp.com/webhook',
    event_types,
  };

  const result = await axios.post(
    `${baseURL}/v1/notifications/webhooks`,
    params,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return result?.data;
};

exports.deletePayPalWebHook = async (accessToken, id) => {
  const result = await axios.delete(
    `${baseURL}/v1/notifications/webhooks/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return result?.data;
};

exports.createPaypalProduct = async (accessToken, name, type) => {
  // interval_unit: 'MONTH'
  const params = {
    name,
    type,
  };

  const result = await axios.post(`${baseURL}/v1/catalogs/products`, params, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return result?.data;
};

exports.getAllProduct = async (accessToken, page, limit) => {
  const url = `${baseURL}/v1/catalogs/products?page=${page}&page_size=${limit}&total_required=true`;

  const result = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return result?.data;
};

const getSubscription = async (accessToken, id) => {
  const url = `${baseURL}/v1/billing/subscriptions/${id}`;
  const result = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return result?.data;
};

exports.getSubscription = getSubscription;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.getTransactionDetailBySubscriptionId = async (accessToken, id) => {
  const startDate = moment().utc().add(-1, 'days').format();
  const endDate = moment().utc().add(1, 'days').format();
  const url = `${baseURL}/v1/billing/subscriptions/${id}/transactions?start_time=${startDate}&end_time=${endDate}`;
  const result = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  await sleep(2000);

  return result?.data?.transactions[0];
};

// renew subscription + updating user here (in-progress)
exports.subscriptionRenew = catchAsync(async (req, res, next) => {
  const event_type = req.headers['paypal-event-type'];
  console.log({ body: req.body, headers: req.headers });
  // const webhook_event_id = req.headers['paypal-webhook-id'];

  // Verify the event's signature
  paypal.notification.webhookEvent.verify(
    req.headers,
    req.body,
    // PAYPAL_WEBHOOK_ID, // paymentConfig.PAYPAL_WEBHOOK_ID
    paymentConfig.PAYPAL_WEBHOOK_ID,
    async function (err, signatureVerification) {
      console.log({ err, signatureVerification });

      // If the signature verification fails, return an error response
      if (signatureVerification.verification_status !== 'SUCCESS')
        return res.status(400).send({
          status: 'failed',
          message: 'Webhook event signature verification failed',
        });

      console.log({ event_type });

      // Process the webhook event based on its type
      if (event_type == 'BILLING.SUBSCRIPTION.CREATED') {
        const subscriptionId = req.body.resource.id;

        // Get the subscription details from PayPal API
        const paypalAccessToken = await generateAccessToken();
        const subscriptionDetail = await getSubscription(
          paypalAccessToken,
          subscriptionId
        );

        if (!subscriptionDetail)
          return res.status(400).send({
            status: 'failed',
            message: 'Subscription not found.',
          });

        // Get the customer's email address from the subscription details
        const customer_email = subscriptionDetail.subscriber.email_address;

        const uid = await User.findOne({
          email: customer_email,
        });

        const obj = {
          paypalSubscriptionId: subscriptionId,
          paypalPlanId: subscriptionDetail.plan_id,
          paypalSubscriptionDetail: subscriptionDetail,
          subscriptionExpired: false,
          planStartDate: subscriptionDetail?.start_time,
          planEndDate: subscriptionDetail?.billing_info?.next_billing_time,
          availableBookings: uid.totalBookings,
          planLastRenewalDate: Date.now(),
        };

        const admin = await User.findOne({ role: 'admin' });

        await Promise.all([
          User.findByIdAndUpdate(uid._id, obj),
          // SENDING NOTIFICATION HERE
          createNotification(
            {
              title: 'Congrats! your Subscription has been Renewed.',
              fcmToken: uid?.fcmToken,
              data: { flag: 'subscription', userId: String(uid._id) },
            },
            {
              sender: admin._id,
              senderMode: 'admin',
              receiver: uid._id,
              title: 'Congrats! your Subscription has been Renewed.',
              flag: 'subscription',
              message: `Congrats! your Subscription has been Renewed.`,
            }
          ),
        ]);
      }
    }
  );
  return;
});
