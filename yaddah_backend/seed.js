const {
  createPaypalPlan,
  generateAccessToken,
  createPaypalProduct,
} = require('./utils/paypal');

exports.seedFunc = async (targetCollection, collectionName, targetDb) => {
  try {
    let createdPaypalProduct = null,
      createdPaypalPlan = null;
    const payPalAccessToken = generateAccessToken();

    if (collectionName == 'products') {
      const checkProduct = await targetCollection.findOne({
        name: 'Yaddah PayPal Product',
      });
      if (!checkProduct) {
        createdPaypalProduct = await createPaypalProduct(
          payPalAccessToken,
          'Yaddah PayPal Product',
          'SERVICE'
        );
        createdPaypalProduct = await targetCollection.insertOne({
          productId: createdPaypalProduct.data.id,
          name: createdPaypalProduct.data.name,
          create_time: createdPaypalProduct.data.create_time,
          links: createdPaypalProduct.data.links,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        });
      } else createdPaypalProduct = checkProduct;
    } else if (collectionName == 'packages') {
      createdPaypalProduct = await targetDb.collection('products').findOne({
        name: 'Yaddah PayPal Product',
      });
      //   <----- FREE PACKAGE START ----->

      const checkFreePackage = await targetCollection.findOne({
        packageType: 'Free',
        planType: 'Free',
      });

      if (!checkFreePackage)
        await targetCollection.insertOne({
          name: 'Free',
          price: 0,
          packageType: 'Free',
          planType: 'Free',
          description: ['asdasd'],
          includeBooking: 5,
          locationVenue: 5,
          staff: 5,
          order: 0,
          services: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        });

      //   <----- FREE PACKAGE END ----->

      // <----- MONTHLY PACKAGES START ----->

      const checkSilverMonthlyPackage = await targetCollection.findOne({
        packageType: 'Silver',
        planType: 'Monthly',
      });
      if (!checkSilverMonthlyPackage) {
        createdPaypalPlan = await createPaypalPlan(
          payPalAccessToken,
          'Silver Monthly',
          'hdsfsdfdsf',
          'MONTH',
          400,
          createdPaypalProduct.productId
        );
        await targetCollection.insertOne({
          name: 'Silver Monthly',
          price: 400,
          packageType: 'Silver',
          planType: 'Monthly',
          description: ['hdsfsdfdsf'],
          includeBooking: 8,
          locationVenue: 12,
          staff: 15,
          order: 1,
          services: 3,
          planData: createdPaypalPlan,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        });
      }

      const checkPlatinumMonthlyPackage = await targetCollection.findOne({
        packageType: 'Platinum',
        planType: 'Monthly',
      });
      if (!checkPlatinumMonthlyPackage) {
        createdPaypalPlan = await createPaypalPlan(
          payPalAccessToken,
          'Platinum Monthly',
          'hdsfsdfdsf',
          'MONTH',
          100,
          createdPaypalProduct.productId
        );
        await targetCollection.insertOne({
          name: 'Platinum Monthly',
          price: 100,
          packageType: 'Platinum',
          planType: 'Monthly',
          description: ['hdsfsdfdsf'],
          includeBooking: 5,
          locationVenue: 7,
          staff: 8,
          order: 3,
          services: 4,
          planData: createdPaypalPlan,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        });
      }

      const checkGoldMonthlyPackage = await targetCollection.findOne({
        packageType: 'Gold',
        planType: 'Monthly',
      });
      if (!checkGoldMonthlyPackage) {
        createdPaypalPlan = await createPaypalPlan(
          payPalAccessToken,
          'Gold Monthly',
          'hdsfsdfdsf',
          'MONTH',
          200,
          createdPaypalProduct.productId
        );
        await targetCollection.insertOne({
          name: 'Gold Monthly',
          price: 200,
          packageType: 'Gold',
          planType: 'Monthly',
          description: ['hdsfsdfdsf'],
          includeBooking: 6,
          locationVenue: 8,
          staff: 9,
          order: 2,
          services: 6,
          planData: createdPaypalPlan,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        });
      }

      // <----- MONTHLY PACKAGES END ----->

      // <----- ANNUAL PACKAGES START ----->

      const checkSilverAnnualPackage = await targetCollection.findOne({
        packageType: 'Silver',
        planType: 'Annual',
      });
      if (!checkSilverAnnualPackage) {
        createdPaypalPlan = await createPaypalPlan(
          payPalAccessToken,
          'Silver Annual',
          'hdsfsdfdsf',
          'YEAR',
          1000,
          createdPaypalProduct.productId
        );
        await targetCollection.insertOne({
          name: 'Silver Annual',
          price: 1000,
          packageType: 'Silver',
          planType: 'Annual',
          description: ['hdsfsdfdsf'],
          includeBooking: 20,
          locationVenue: 12,
          staff: 18,
          order: 1,
          services: 3,
          planData: createdPaypalPlan,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        });
      }

      const checkPlatinumAnnualPackage = await targetCollection.findOne({
        packageType: 'Platinum',
        planType: 'Annual',
      });
      if (!checkPlatinumAnnualPackage) {
        createdPaypalPlan = await createPaypalPlan(
          payPalAccessToken,
          'Platinum Annual',
          'hdsfsdfdsf',
          'YEAR',
          500,
          createdPaypalProduct.productId
        );
        await targetCollection.insertOne({
          name: 'Platinum Annual',
          price: 500,
          packageType: 'Platinum',
          planType: 'Annual',
          description: ['hdsfsdfdsf'],
          includeBooking: 10,
          locationVenue: 10,
          staff: 10,
          order: 3,
          services: 8,
          planData: createdPaypalPlan,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        });
      }

      const checkGoldAnnualPackage = await targetCollection.findOne({
        packageType: 'Gold',
        planType: 'Annual',
      });
      if (!checkGoldAnnualPackage) {
        createdPaypalPlan = await createPaypalPlan(
          payPalAccessToken,
          'Gold Annual',
          'hdsfsdfdsf',
          'YEAR',
          700,
          createdPaypalProduct.productId
        );
        await targetCollection.insertOne({
          name: 'Gold Annual',
          price: 700,
          packageType: 'Gold',
          planType: 'Annual',
          description: ['hdsfsdfdsf'],
          includeBooking: 15,
          locationVenue: 15,
          staff: 15,
          order: 2,
          services: 10,
          planData: createdPaypalPlan,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        });
      }

      // <----- ANNUAL PACKAGES END ----->
    }
  } catch (err) {
    throw err;
  }
};
