const path = require('path');
const express = require('express');
const schedule = require('node-schedule');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const chatRouter = require('./routes/chatRoutes');
const cmsRouter = require('./routes/cmsRoutes');
const contactUsRouter = require('./routes/contactUsRoutes');
const newsLetterRouter = require('./routes/newsLetterRoutes');
const faqsRouter = require('./routes/faqRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const packageRouter = require('./routes/packageRoutes');
const couponRouter = require('./routes/couponRoutes');
const venueRouter = require('./routes/venueRoutes');
const staffRouter = require('./routes/staffRoutes');
const serviceRouter = require('./routes/serviceRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const notificationRouter = require('./routes/notificationRoutes');
const whyChooseUsCrudRouter = require('./routes/whyChooseUsCrudRoutes');
const socialLinkCrudRouter = require('./routes/socialLinksCrudRoutes');
const appConfigRouter = require('./routes/appConfigRoutes');

const User = require('./models/userModel');
const Room = require('./models/roomModel');
const Chat = require('./models/chatModel');

const { getFileStream } = require('./utils/fileUpload');
const { subscriptionRenew } = require('./utils/paypal');

const {
  serviceProviderPackageExpire,
  serviceProviderBookingComplete,
  UpdateServiceProviderAvailableBookingCount,
} = require('./utils/cronFns');

// Start express app
const app = express();
const http = require('http').Server(app);

app.enable('trust proxy');

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// PUG CONFIG
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// EJS CONFIG
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public', '/templates'));

// 1) GLOBAL MIDDLE WARES

var corsOptions = {
  origin: '*',
};

// Implement CORS
app.use(cors(corsOptions));

app.options('*', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// PayPal webhook, BEFORE body-parser, because paypal needs the body as stream
app.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  subscriptionRenew
);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true, limit: '500kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Yaddah APIs',
  });
});

// Cms.create({
//   home: {
//     pageName: 'home',
//     home_section1_image: 'String',
//     home_section1_title: 'String',
//     home_section1_description: 'String',

//     home_section2_title: 'String',
//     home_section2_image: 'String',
//     home_section2_description: 'String',

//     // home_section3_title: 'String',

//     home_section4_title: 'String',
//     home_section4_image: String,

//     home_section5_title: 'String',
//     home_section5_description: 'String',
//     home_section5_bgImage: 'String',
//   },
//   about_us: {
//     pageName: 'about_us',
//     about_section1_heading: 'String',

//     about_section2_title: 'String',
//     about_section2_description: 'String',
//     about_section2_image: 'String',

//     about_section3_title: 'String',
//     about_section3_description: 'String',
//     about_section3_bgImage: 'String',
//   },
//   services: {
//     pageName: 'services',
//     services_section1_heading: 'String',
//   },
//   faq: {
//     pageName: 'faq',
//     faq_section1_heading: 'String',
//   },
//   contact_us: {
//     pageName: 'contact_us',
//     contact_section_heading: 'String',
//     contact_section_name: 'String',
//     contact_section_email:'String',
//     contact_section_phoneNo:'String',
//     contact_section_website:'String',
//     contact_section_message:'String',
//   },
//   footer: {
//     pageName: 'footer',
//     title:String,
//     description:String,
//     links:
//       [{
//         name:'facebook',
//         link:'www.facebook.com'
//       }]
//   },
// }).then((rs) => console.log('Inserted !!'));

// read images
app.get('/api/images/:key', async (req, res) => {
  try {
    const key = req.params.key;

    if (req?.query?.type == 'pdf' || key?.split('.')[1] == 'pdf')
      res.header('Content-type', 'application/pdf');
    else if (key?.split('.')[1] == 'svg')
      res.set('Content-type', 'image/svg+xml');
    else if (key?.split('.')[1] == 'jpeg')
      res.set('Content-type', 'image/jpeg');
    else if (key?.split('.')[1] == 'jpg') res.set('Content-type', 'image/jpg');
    else res.set('Content-type', 'image/gif');

    // const readStream = await
    await getFileStream(key)
      .on('error', (e) => {
        // return res.status(404).json({
        //   message: 'Image not Found.',
        // });
      })
      .pipe(res);
  } catch (e) {
    return res.status(404).json({
      message: 'Image not found',
    });
  }
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/rating', userRouter);
app.use('/api/v1/cms', cmsRouter);
app.use('/api/v1/contact-us', contactUsRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/newsletter', newsLetterRouter);
app.use('/api/v1/faqs', faqsRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/coupon', couponRouter);
app.use('/api/v1/package', packageRouter);
app.use('/api/v1/staff', staffRouter);
app.use('/api/v1/venue', venueRouter);
app.use('/api/v1/service', serviceRouter);
app.use('/api/v1/booking', bookingRouter);
app.use('/api/v1/why-choose-us', whyChooseUsCrudRouter);
app.use('/api/v1/social-link', socialLinkCrudRouter);
app.use('/api/v1/configs', appConfigRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  console.log(req.originalUrl);
});

app.use(globalErrorHandler);

// setting up
const io = require('./utils/socket').init(http);

io.on('connection', (socket) => {
  // when user joins the app

  socket.on('join', async (id) => {
    const authId = id;
    const socketId = socket.id;
    const filter = { _id: authId };
    const update = { socketId, isOnline: true };
    try {
      await User.findOneAndUpdate(filter, update, {
        new: true,
      });
    } catch (e) {
      console.log('Task failed successfully... 🧐🧐🧐', e);
    }
  });

  // when user enters in the room---> chat
  socket.on('chatJoin', async (id, roomId) => {
    try {
      const userId = id;
      await Chat.updateMany({ to: userId, room: roomId }, { isReadMessage: 1 });
    } catch (e) {
      console.log('Task failed successfully... 🧐🧐🧐', e);
    }
  });

  // on disconnect
  socket.on('disconnected', async (id, role = 'customer') => {
    try {
      const authId = id;
      const filter = { _id: authId };
      const update = { isOnline: false };

      await User.findOneAndUpdate(filter, update, {
        new: true,
      });
    } catch (e) {
      console.log('error in disconnecting', e);
    }
  });

  // mark-as-read
  socket.on('mark-as-read', async (roomId, role) => {
    if (role != 'user') {
      await Room.findByIdAndUpdate(roomId, {
        user1UnreadCount: 0,
      });
    } else {
      await Room.findByIdAndUpdate(roomId, {
        user2UnreadCount: 0,
      });
    }
  });

  // for messaging
  socket.on('msg', async (msg, msgTo, roomId, currentUser = 'customer') => {
    try {
      let receiverId = msgTo;
      const receiverUser = await User.findById(receiverId);
      const newMessage = new Chat({
        room: roomId,
        to: receiverUser._id,
        from: msg.user._id, // from UserId
        message: msg,
        isReadMessage: receiverUser.isOnline == null ? 0 : 1,
      });

      // update room => readCount
      if (currentUser == 'customer') {
        await Room.findByIdAndUpdate(
          roomId,
          {
            lastMessage: msg,
            user1UnreadCount: 0,
            lastChatted: new Date(),
            $inc: { user2UnreadCount: 1 },
          },
          { new: true }
        );
      } else {
        await Room.findByIdAndUpdate(
          roomId,
          {
            lastMessage: msg,
            user2UnreadCount: 0,
            lastChatted: new Date(),
            $inc: { user1UnreadCount: 1 },
          },
          { new: true }
        );
      }

      await newMessage.save();
      // ******************** FCM !Right *****************************

      // if (receiverUser?.fcmToken.length > 0) {
      //   admin
      //     .messaging()
      //     .sendMulticast({
      //       notification: {
      //         title: msg.user.name,
      //         body: msg?.text,
      //         // imageUrl: `https://mobile-mechanic-backend.herokuapp.com/img/users/${sender?.photo}`,
      //       },
      //       data: {
      //         roomId,
      //         name: msg.user.name,
      //         detailId: `${msg.user._id}`,
      //       },
      //       tokens: receiverUser.fcmToken,
      //     })
      //     .then((response) => {
      //       console.log(response, 'sent');
      //       io.to(receiverUser.socketId).emit('new-notification', response);
      //     })
      //     .catch((e) => {
      //       console.log({ e });
      //     });
      // }

      const notificationObj = {
        receiver: receiverUser._id,
        title: 'New message',
        flag: 'new-message',
      };

      io.emit('new-notification', notificationObj);

      // io.emit('msg', msg, roomId);
      io.to(receiverUser.socketId).emit('msg', msg, roomId);
    } catch (e) {
      console.log(e, 'msg submit error');
    }
  });

  //logout socket
  socket.on('logout', async (id, fcmToken) => {
    try {
      console.log('sdsds', id, fcmToken);
      await User.findByIdAndUpdate(
        id,
        { $pull: { fcmToken }, isOnline: false },
        {
          new: true,
        }
      );
    } catch (e) {
      console.log('Error in disconnecting', e);
    }
  });
});

schedule.scheduleJob('*/10 * * * *', async () => {
  // RUNNING ON EVERY 10 MINUTES
  try {
    await Promise.all([
      serviceProviderPackageExpire(),
      serviceProviderBookingComplete(),
    ]);
  } catch (error) {
    // console.log(error);
  }
});

schedule.scheduleJob('0 */12 * * *', async () => {
  // RUNNING ON EVERY 12 Hours
  try {
    await UpdateServiceProviderAvailableBookingCount();
  } catch (error) {
    // console.log(error);
  }
});

module.exports = http;
