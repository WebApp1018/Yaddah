const fs = require('fs');
const AppConfig = require('../models/appConfigModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { generateAccessToken, createPayPalWebHook } = require('../utils/paypal');

// getting all details related to app
exports.getAppDetails = catchAsync(async (req, res, next) => {
  const data = await AppConfig.find({});

  res.status(200).json({ status: 'success', data });
});

exports.getSingleAppConfig = catchAsync(async (req, res, next) => {
  const { key } = req.params;

  const data = await AppConfig.findOne({ keyType: key });

  res.status(200).json({ status: 'success', data });
});

exports.createAppConfig = catchAsync(async (req, res, next) => {
  const { keyType } = req.body;

  const data = await AppConfig.create({ keyType, [keyType]: req.body });

  res.status(201).json({ status: 'success', data });
});

exports.updateDetails = catchAsync(async (req, res, next) => {
  const { configId, keyType } = req.body;
  let createdPaypalPlan = null;
  const __data = await AppConfig.findOne({ _id: configId, keyType });

  if (!__data) return next(new AppError('AppConfig details not found.', 400));
  // update all in appConfig modal
  const updateOld = await AppConfig.findOneAndUpdate({
    $or: [
      { 'database.isSelect': true },
      { 'sendgrid.isSelect': true },
      { 'postmark.isSelect': true },
      { 'awsSes.isSelect': true },
      { 'gmail.isSelect': true },
      { 'office365.isSelect': true },
      { 'smtp.isSelect': true },
      { 'paypal.isSelect': true },
      { 's3.isSelect': true },
      { 'map.isSelect': true },
    ],
  });

  if (keyType == 'paypal') {
    const paypalAccessToken = await generateAccessToken();

    createdPaypalPlan = await createPayPalWebHook(paypalAccessToken, [
      {
        name: 'BILLING.SUBSCRIPTION.CREATED',
      },
    ]);
    req.body.PAYPAL_WEBHOOK_ID = createdPaypalPlan.id;
  }

  const data = await AppConfig.findByIdAndUpdate(
    { _id: configId, keyType },
    {
      [keyType]: req.body,
      ...(keyType == 'database' && {
        $addToSet: {
          PREVIOUS_DBS: {
            DB_NAME: req.body.SOURCE_DB_NAME,
            DB_URL: req.body.SOURCE_DB_URL,
          },
        },
      }),
    },
    { new: true }
  );

  const emailTypes = ['sendgrid', 'awsSes', 'postmark', 'gmail'];

  if (emailTypes.includes(keyType)) {
    const filteredTypes = emailTypes.filter((type) => type != keyType);
    await Promise.all([
      filteredTypes.map(async (type) => {
        await AppConfig.findOneAndUpdate(
          { keyType: type },
          { $set: { [`${type}.isSelect`]: false } }
        );
      }),
    ]);
  }

  const config = {
    email: 'mailConfig.json',
    payment: 'paymentConfig.json',
    s3: 'awsConfig.json',
    map: 'mapConfig.json',
    database: 'dbConfig.json',
  };

  // write json object to file name abcCOnfig.json
  fs.writeFileSync(
    config[data[keyType].type],
    JSON.stringify(data[keyType]),
    (err) => {
      // throws an error, you could also catch it here
      if (err) throw err;

      // success case, the file was saved
      console.log('Config file saved!');
    }
  );

  const allConfs = await AppConfig.find({});

  res.status(200).json({ status: 'success', data: allConfs });
});

exports.switchConfig = catchAsync(async (req, res, next) => {
  const { prevConfigId, nextConfigId, keyType } = req.body;

  const [prevConfig, nextConfig] = await Promise.all([
    AppConfig.findOne({ _id: prevConfigId, keyType }),
    AppConfig.findOne({ _id: nextConfigId, keyType }),
  ]);

  if (!prevConfig)
    return next(new AppError('Previous AppConfig details not found.', 400));

  if (!nextConfig)
    return next(new AppError('Next AppConfig details not found.', 400));

  if (prevConfig[keyType].type != nextConfig[keyType].type)
    return next(new AppError('Config type mismatch.', 400));

  if (!prevConfig[keyType].isSelect)
    return next(new AppError('Previous config is not selected.', 400));

  if (nextConfig[keyType].isSelect)
    return next(new AppError('Next config is already selected.', 400));

  const config = {
    email: 'mailConfig.json',
    payment: 'paymentConfig.json',
    s3: 'awsConfig.json',
    map: 'mapConfig.json',
    database: 'dbConfig.json',
  };

  const [prevData, nextData] = await Promise.all([
    AppConfig.findByIdAndUpdate(
      prevConfigId,
      { $set: { [`${keyType}.isSelect`]: false } },
      { new: true }
    ),
    AppConfig.findByIdAndUpdate(
      nextConfigId,
      { $set: { [`${keyType}.isSelect`]: true } },
      { new: true }
    ),
  ]);

  // write json object to file name abcCOnfig.json
  fs.writeFileSync(
    config[nextConfig[keyType].type],
    JSON.stringify(nextData[keyType]),
    (err) => {
      // throws an error, you could also catch it here
      if (err) throw err;

      // success case, the file was saved
      console.log('Config file saved!');
    }
  );

  res.status(200).json({ status: 'success', prevData, nextData });
});
