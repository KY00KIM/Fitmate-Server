const express = require('express');
const chatRouter = express.Router();
const chatController = require('../../../controller/chat');
const { verifyUser } = require("../../../middleware/auth");


chatRouter.get('/',verifyUser, chatController.getAllChatroom);
chatRouter.get('/info',verifyUser, chatController.getAllPopulatedChatroom);

chatRouter.post('/',verifyUser, chatController.createOneChatroom);
chatRouter.delete('/:chatroomId',verifyUser, chatController.deleteOneChatroom);

chatRouter.get('/:chatroomId',verifyUser, chatController.getOneChatroom);

chatRouter.get('/info/:chatroomId',verifyUser, chatController.getOnePopulatedChatroom);


module.exports = chatRouter;