const { Chatroom } = require('../model/Chatroom');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const {Appointment} = require("../model/Appointment");

const chatController = {
    getAllChatroom: async (req, res) => {
        try {
            let user_id = req.user.id;
            const ChatroomList = await Chatroom.find({ $or: [{ 'chat_start_id': user_id }, { 'chat_join_id': user_id }], is_deleted: false }).sort({createdAt: -1}).lean();
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](ChatroomList, 'SuccessOK', STATUS_CODE.SuccessOK);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    getOneChatroom: async (req, res) => {
        try {
            const { chatroomId } = req.params;
            const chatroom = await Chatroom.findById(chatroomId).lean();
            return ResponseManager.getDefaultResponseHandler(res)['onSuccess'](chatroom, 'SuccessOK', STATUS_CODE.SuccessOK);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    createOneChatroom: async (req, res) => {
        try {
            const { chat_join_id } = req.body;
            const chatroom = await Chatroom.create({ chat_start_id: req.user.id, chat_join_id });
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](chatroom, 'SuccessCreated', STATUS_CODE.SuccessCreated);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    deleteOneChatroom: async (req, res) => {
        try {
            const { chatroomId } = req.params;
            const chatroom = await Chatroom.findByIdAndUpdate(chatroomId, { is_deleted: true }, { new: true, runValidators: true }).lean();
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](chatroom, 'SuccessOK', STATUS_CODE.SuccessOK);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    getAllPopulatedChatroom: async (req, res) => {
        try {
            let user_id = req.user.id;
            const ChatroomList = await Chatroom.find({ $or: [{ 'chat_start_id': user_id }, { 'chat_join_id': user_id }], is_deleted: false })
                .populate('chat_start_id')
                .populate('chat_join_id')
                .sort({createdAt:-1})
                .lean();

            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](ChatroomList, 'SuccessOK', STATUS_CODE.SuccessOK);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    getOnePopulatedChatroom: async (req, res) => {
        try {
            const { chatroomId } = req.params;
            let chatroom = await Chatroom.findById(chatroomId)
                .populate('chat_start_id')
                .populate('chat_join_id');
            chatroom = chatroom.toObject();
            chatroom.appointment = await Appointment.findOne({
                $and:[
                    {$or: [
                        {$and:[{match_start_id:chatroom.chat_start_id}, {match_join_id:chatroom.chat_join_id}]},
                        {$and:[{match_start_id:chatroom.chat_join_id}, {match_join_id:chatroom.chat_start_id}]},
                ]}, {is_deleted: false}]});

            return ResponseManager.getDefaultResponseHandler(res)['onSuccess'](chatroom, 'SuccessOK', STATUS_CODE.SuccessOK);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },

    deleteManyChatroomByUser: async (user_id) => {
        try {
            const result = await Chatroom.updateMany({ $or: [{ 'chat_start_id': user_id }, { 'chat_join_id': user_id }] }, { is_deleted: true });
            return result;
        } catch (e) {
            console.log(e)
            return e
        }
    }
}


module.exports = chatController;