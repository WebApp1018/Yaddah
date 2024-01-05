const express = require('express');
const {
  getAllChatRooms,
  getAllAgentRooms,
  getAllMsg,
  sendNewMsg,
  initiateChat,
  getAllChatRoomsForAdmin,
  getAllMsgForAdmin,
} = require('../controllers/chatController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();
router.use(protect);

// getting all messages og a chat
router.route('/single-chat').get(getAllMsg);

// getting all chat rooms
router.route('/rooms').get(getAllChatRooms);

// getting all chat rooms by brokerage
router.route('/rooms/agent/:id').get(getAllAgentRooms);

// send message to user
router.route('/send-message').post(sendNewMsg);

router.route('/initiate-chat').post(initiateChat);

router.use(restrictTo('admin', 'sub-admin'));

router.route('/admin/rooms').get(getAllChatRoomsForAdmin);

router.route('/admin/single-chat').get(getAllMsgForAdmin);

module.exports = router;
