const Rooms = require('../models/roomModel');
const Chat = require('../models/chatModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const chatMessages = async (limit, skip, room, userId) => {
  if (!room) return { finalMessages: [], messages: [] };

  let finalMessages = [];

  if (!room) return next(new AppError('Params are missing', 400));

  const msg = await Chat.find({
    room,
    $or: [{ to: userId }, { from: userId }],
  })
    .populate('to', 'firstName lastName contactPerson photo')
    .populate('from', 'firstName lastName contactPerson photo')
    .select('message to from -_id createdAt updatedAt')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .len();

  if (msg.length > 0) {
    msg.forEach((item) => {
      item.message.createdAt = item.createdAt;
      finalMessages.push(item.message);
    });
  }

  return { finalMessages, messages: msg };
};
exports.chatMessages = chatMessages;

exports.getAllChatRooms = async (req, res, next) => {
  // for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 400;
  const skip = (page - 1) * limit;
  const userId = req.user.id;
  const { search } = req.query;
  
  let chatRooms = await Rooms.find({
    $or: [{ user1: userId }, { user2: userId }],
  })
    .populate('user1')
    .populate('user2')
    .sort('-updatedAt')
    .limit(limit)
    .skip(skip)
    .lean();
    
  if (search && search != '') {
    const expr = new RegExp(search?.trim(), 'gi');

    chatRooms = chatRooms.filter(
      (chat) =>
        expr.test(chat?.user1?.fullName) ||
        expr.test(chat?.user1?.userName) ||
        expr.test(`${chat?.user1?.fullName} ${chat?.user1?.userName}`) ||
        expr.test(chat?.user1?.fullName) ||
        expr.test(chat?.user2?.fullName) ||
        expr.test(chat?.user2?.userName) ||
        expr.test(`${chat?.user2?.fullName} ${chat?.user2?.userName}`) ||
        expr.test(chat?.user2?.fullName)
    );
  }

  const totalRecords = await Rooms.countDocuments({
    $or: [{ user1: userId }, { user2: userId }],
  });

  res.status(200).json({
    status: 'success',
    totalRecords,
    data: chatRooms,
  });
};

exports.getAllChatRoomsForAdmin = async (req, res, next) => {
  // for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 400;
  const skip = (page - 1) * limit;
  const userId = req.user.id;
  const { search } = req.query;

  let chatRooms = await Rooms.find()
    .populate('user1')
    .populate('user2')
    .sort('-updatedAt')
    .limit(limit)
    .skip(skip)
    .lean();

  if (search && search != '') {
    const expr = new RegExp(search?.trim(), 'gi');

    chatRooms = chatRooms.filter(
      (chat) =>
        expr.test(chat?.user1?.fullName) ||
        expr.test(chat?.user1?.userName) ||
        expr.test(`${chat?.user1?.fullName} ${chat?.user1?.userName}`) ||
        expr.test(chat?.user1?.fullName) ||
        expr.test(chat?.user2?.fullName) ||
        expr.test(chat?.user2?.userName) ||
        expr.test(`${chat?.user2?.fullName} ${chat?.user2?.userName}`) ||
        expr.test(chat?.user2?.fullName)
    );
  }

  const totalRecords = await Rooms.countDocuments();

  res.status(200).json({
    status: 'success',
    totalRecords,
    data: chatRooms,
  });
};

exports.getAllAgentRooms = async (req, res, next) => {
  // for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 400;
  const skip = (page - 1) * limit;
  const { id } = req.params;

  const agentRooms = await Rooms.find({
    user1: id,
  })
    .populate('user1')
    .populate('user2')
    .sort('-updatedAt')
    .limit(limit)
    .skip(skip);

  const totalRecords = await Rooms.countDocuments({
    user1: id,
  });

  res.status(200).json({
    status: 'success',
    totalRecords,
    data: agentRooms,
  });
};

exports.sendNewMsg = catchAsync(async (req, res, next) => {
  const { to, from, message } = req.body;
  if (!to || !from) return next(new AppError('Params are missing', 400));
  let checkRoomId = await Rooms.findOne({
    $or: [
      { user1: to, user2: from },
      { user1: from, user2: to },
    ],
  });

  if (!checkRoomId) {
    checkRoomId = await Rooms.create({
      user1: to,
      user2: from,
      user1UnreadCount: 1,
      lastMessage: message,
      lastChatted: Date.now(),
    });
  } else {
    await Rooms.findByIdAndUpdate(checkRoomId._id, {
      lastMessage: message,

      lastChatted: Date.now(),
    });
  }
  req.body.room = checkRoomId._id;
  let msg = await Chat.create(req.body);

  res.status(201).json({
    status: 'success',
    data: msg,
  });
});

exports.initiateChat = catchAsync(async (req, res, next) => {
  const { to, from } = req.body;
  if (!to || !from) return next(new AppError('Params are missing', 400));
  let room = await Rooms.findOne({
    $or: [
      { user1: to, user2: from },
      { user1: from, user2: to },
    ],
  });

  if (!room) {
    room = await Rooms.create({
      user1: to,
      user2: from,
      lastChatted: Date.now(),
    });
    room = await Rooms.findById(room?._id).populate([
      { path: 'user1' },
      { path: 'user2' },
    ]);
  } else {
    room = await Rooms.findByIdAndUpdate(
      room._id,
      {
        lastChatted: Date.now(),
      },
      { new: true }
    ).populate([{ path: 'user1' }, { path: 'user2' }]);
  }

  res.status(201).json({
    status: 'success',
    data: room,
  });
});

exports.getAllMsg = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 30;
  const skip = (page - 1) * limit;
  const { room } = req.query;
  const { user } = req;

  let finalMessages = [];

  if (!room) next(new AppError('room is empty.', 400));

  const chats = await Chat.find({
    room,
  })
    .select(
      'room to from message isReadMessage createdAt isDeliveredMessage -_id'
    )
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .lean();

  if (chats.length > 0) {
    chats.forEach((item) => {
      item.message.createdAt = item.createdAt;
      finalMessages.push(item.message);
    });
  }

  const totalRecords = await Chat.countDocuments({ room });

  res.status(200).json({
    status: 'success',
    results: finalMessages.length,
    totalRecords,
    data: finalMessages,
  });
});


exports.getAllMsgForAdmin = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 30;
  const skip = (page - 1) * limit;
  const { room } = req.query;
  const { user } = req;

  let finalMessages = [];

  if (!room) next(new AppError('room is empty.', 400));

  const chats = await Chat.find({
    room,
  })
    .select(
      'room to from message isReadMessage createdAt isDeliveredMessage -_id'
    )
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .lean();

  if (chats.length > 0) {
    chats.forEach((item) => {
      item.message.createdAt = item.createdAt;
      finalMessages.push(item.message);
    });
  }

  const totalRecords = await Chat.countDocuments({ room });

  res.status(200).json({
    status: 'success',
    results: finalMessages.length,
    totalRecords,
    data: finalMessages,
  });
});