const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // Notification creator
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: [true, 'Notification creator id is required.'],
    },
    senderMode: {
      type: String,
      enum: ['admin', 'sub-admin', 'customer', 'service-provider'],
      // required: [true, 'sender mode is required.'],
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    seen: {
      type: Boolean,
      default: false,
    },
    flag: {
      type: String,
      enum: ['register', 'booking', 'subscription'],
      default: 'register',
    },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Ids of the receivers of the notification
    // receiver: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Ids of the receivers of the notification
    message: { type: String, required: [true, 'message is required.'] }, // any description of the notification message
    title: { type: String }, // any title description of the notification message
    link: String,
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

/*
    __________FACEBOOK__________
{
    status: 'connected',
    authResponse: {
    accessToken: '{access-token}',
    expiresIn:'{unix-timestamp}',
    reauthorize_required_in:'{seconds-until-token-expires}',
    signedRequest:'{signed-parameter}',
    userID:'{user-id}'
  }
}

*/
