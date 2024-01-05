const moment = require('moment');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const { createNotification } = require('../controllers/notificationController');

exports.UpdateServiceProviderAvailableBookingCount = async () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so add 1 to get the actual month
  const currentYear = currentDate.getFullYear();
  const adminData = await User.findOne({ role: 'admin' });

  // get all service providers with Annual package and subscriptionExpired false
  const findAllServiceProviderWithAnnualPackage = await User.find({
    role: 'service-provider',
    planType: 'Annual',
    subscriptionExpired: false,
    $expr: {
      $and: [
        { $ne: ['$planLastRenewalDate', currentDate] },
        {
          $eq: [
            { $dayOfMonth: '$planStartDate' },
            { $dayOfMonth: currentDate },
          ],
        },
        {
          $or: [
            {
              $and: [
                { $gt: [{ $year: '$planEndDate' }, currentYear] },
                { $lt: [{ $month: '$planEndDate' }, currentMonth] },
              ],
            },
            {
              $and: [
                { $eq: [{ $year: '$planEndDate' }, currentYear] },
                { $gt: [{ $month: '$planEndDate' }, currentMonth] },
              ],
            },
          ],
        },
      ],
    },
  });

  if (findAllServiceProviderWithAnnualPackage.length === 0) return;
  // update all service providers availableBookings count and planLastRenewalDate and generate notification about plan renewal
  const promises = findAllServiceProviderWithAnnualPackage.map(
    async (serviceProvider) => {
      const data = {
        availableBookings: serviceProvider.totalBookings,
        planLastRenewalDate: currentDate,
      };
      await User.findByIdAndUpdate(serviceProvider._id, data);
      // generate notification about plan renewal
      await createNotification(
        {
          title: 'Subscription Renewal',
          fcmToken: serviceProvider.fcmToken,
          data: {
            flag: 'subscription',
            userId: String(serviceProvider._id),
          },
        },
        {
          sender: adminData._id,
          receiver: serviceProvider._id,
          socket: serviceProvider.socketId,
          title: 'subscription Renewal',
          message: 'Your subscription has been renewed.',
          flag: 'subscription',
          senderMode: 'admin',
        }
      );
    }
  );

  await Promise.allSettled(promises);
};

exports.serviceProviderBookingComplete = async () => {
  console.log('<------- Service Provider Booking Complete ------->');
  const date = new Date(moment().add(5, 'hours').format());

  const dbQuery = {
    status: 'pending',
    'bookedSlots.date': {
      $lte: date,
    },
  };

  const foundBookings = await Booking.find(dbQuery).populate([
    { path: 'serviceProvider', select: 'fcmToken socketId' },
    { path: 'customer', select: 'fcmToken socketId' },
  ]);

  if (foundBookings.length > 0) {
    await Booking.updateMany(dbQuery, {
      $set: { status: 'completed' },
    });

    const admin = await User.findOne({ role: 'admin' });

    const promises = foundBookings.map(async (booking) => {
      await createNotification(
        {
          title: 'Booking Completed',
          fcmToken: booking?.serviceProvider?.fcmToken,
          data: { flag: 'booking', bookingId: String(booking._id) },
        },
        {
          sender: admin._id,
          receiver: booking?.serviceProvider?._id,
          socket: booking?.serviceProvider?.socketId,
          booking: booking._id,
          message: 'Your booking has been completed.',
          flag: 'booking',
          title: 'Booking Completed',
          senderMode: 'admin',
        }
      );
      await createNotification(
        {
          title: 'Booking Completed',
          fcmToken: booking?.customer?.fcmToken,
          data: { flag: 'booking', bookingId: String(booking._id) },
        },
        {
          sender: admin._id,
          receiver: booking?.customer?._id,
          socket: booking?.customer?.socketId,
          booking: booking._id,
          message: 'Your booking has been completed.',
          flag: 'booking',
          title: 'Booking Completed',
          senderMode: 'admin',
        }
      );
    });

    await Promise.all(promises);
  }
};

exports.serviceProviderPackageExpire = async () => {
  console.log('<------- Service Provider Package Expire ------->');
  const date = new Date(moment().add(5, 'hours').format());

  await User.updateMany(
    {
      planEndDate: {
        $lte: date,
      },
    },
    {
      $set: {
        packageType: 'None',
        planType: 'None',
        planStartDate: null,
        planEndDate: null,
        planLastRenewalDate: null,
        totalBookings: 0,
        availableBookings: 0,
        totalVenues: 0,
        availableVenues: 0,
        totalStaff: 0,
        availableStaff: 0,
        totalServices: 0,
        availableServices: 0,
        planAmount: 0,
        paypalPlanId: null,
        subscriptionExpired: true,
        paypalSubscriptionId: null,
        paypalSubscriptionDetail: null,
      },
    }
  );

  const foundAdmin = await User.findOne({ role: 'admin' });

  const promises = (
    await User.find({
      planEndDate: {
        $lte: date,
      },
    })
  ).map(async (user) => {
    await createNotification(
      {
        title: 'Subscription Expired',
        fcmToken: foundUser.fcmToken,
        data: { flag: 'subscription', userId: String(user._id) },
      },
      {
        sender: foundAdmin._id,
        receiver: user._id,
        message: 'Your subscription has been expired.',
        flag: 'subscription',
        title: 'Subscription Expired',
        senderMode: 'admin',
      }
    );
  });

  await Promise.all(promises);
};
