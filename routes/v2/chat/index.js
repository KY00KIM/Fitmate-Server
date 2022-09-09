const express = require('express');
const chatRouter = express.Router();
const chatController = require('../../../controller/chat');
const { verifyUser } = require("../../../middleware/auth");


chatRouter.get('/', chatController.getAllChatroom);
chatRouter.get('/info', chatController.getAllPopulatedChatroom);

chatRouter.post('/', chatController.createOneChatroom);
chatRouter.delete('/:chatroomId', chatController.deleteOneChatroom);

chatRouter.get('/:chatroomId', chatController.getOneChatroom);

chatRouter.get('/info/:chatroomId', chatController.getOnePopulatedChatroom);


module.exports = chatRouter;