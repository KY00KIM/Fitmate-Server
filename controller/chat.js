const { Chatroom } = require('../model/Chatroom');
const {Chat} = require('../model/Chats');
const {User} = require('../model/User');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const {Appointment} = require("../model/Appointment");

const chatController = {
    getAllChatroom: async (req, res) => {
        try {
            let user_id = req.user.id;
            const user = await User.findById(user_id);
            let blocked_list = [];
            user.blocked_users.forEach((a) =>{
                blocked_list.push(a.toString());
            });
            let ChatroomList = await Chatroom.find({
                $and:[
                    {chat_start_id: {$nin: blocked_list }},
                    {chat_join_id: {$nin: blocked_list }},
                    {$or: [{ 'chat_start_id': user_id }, { 'chat_join_id': user_id }]},
                    {is_deleted: false }
                ]}
            )
                .sort({createdAt: -1});
            for(let i = 0; i < ChatroomList.length; ++i){
                ChatroomList[i] = ChatroomList[i].toObject();
                const chat = await Chat.findOne({chat_room_id: ChatroomList[i]._id});
                ChatroomList[i].last_chat = chat.last_chat;
            }
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](ChatroomList, 'SuccessOK', STATUS_CODE.SuccessOK);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    getOneChatroom: async (req, res) => {
        try {
            const { chatroomId } = req.params;
            let chatroom = await Chatroom.findById(chatroomId);
            chatroom = chatroom.toObject();
            const chat = await Chat.findOne({chat_room_id: chatroomId});
            chatroom.last_chat = chat.last_chat;
            return ResponseManager.getDefaultResponseHandler(res)['onSuccess'](chatroom, 'SuccessOK', STATUS_CODE.SuccessOK);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    createOneChatroom: async (req, res) => {
        try {
            const { chat_join_id } = req.body;
            const dupl = await Chatroom.find({$or:[{
                $and:[{chat_start_id: req.user.id},{chat_join_id: chat_join_id}]
                },{
                $and:[{chat_start_id: chat_join_id},{chat_join_id: req.user.id}]
                }]});
            if(dupl.length == 0){
                const chatroom = await Chatroom.create({ chat_start_id: req.user.id, chat_join_id });
                const chat = await Chat.create({
                    chat_room_id:chatroom._id,
                    last_chat: "상대방과 채팅을 시작하세요!"
                });
                ResponseManager.getDefaultResponseHandler(res)['onSuccess'](chatroom, 'SuccessCreated', STATUS_CODE.SuccessCreated);
            }else{
                ResponseManager.getDefaultResponseHandler(res)['onSuccess']({}, '이미 존재하는 채팅방', STATUS_CODE.SuccessCreated);
            }
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
            const user = await User.findById(user_id);
            let blocked_list = [];
            user.blocked_users.forEach((a) =>{
                blocked_list.push(a.toString());
            });
            let ChatroomList = await Chatroom.find(
                {
                    $and:[
                        {chat_start_id: {$nin: blocked_list }},
                        {chat_join_id: {$nin: blocked_list }},
                        {$or: [{ 'chat_start_id': user_id }, { 'chat_join_id': user_id }]},
                        {is_deleted: false }
                    ]}
            )
                .populate('chat_start_id')
                .populate('chat_join_id')
                .sort({createdAt:-1});
            for(let i = 0; i < ChatroomList.length; ++i){
                ChatroomList[i] = ChatroomList[i].toObject();
                const chat = await Chat.findOne({chat_room_id: ChatroomList[i]._id});
                ChatroomList[i].last_chat = chat.last_chat;
            }
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

            const chat = await Chat.findOne({chat_room_id: chatroomId});
            chatroom.last_chat = chat.last_chat;
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
    },
    writeLastChat: async (req, res)=>{
        try{
            const chatrooms = await Chatroom.find();
            for(let i = 0; i < chatrooms.length; ++i ){
                await Chat.create({
                    chat_room_id:chatrooms[i]._id,
                    last_chat: "상대방과 채팅을 시작하세요!"
                })
            }
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](chatrooms, 'SuccessOK', STATUS_CODE.SuccessOK);

        }catch(error){

        }
    },
    updateLastChat: async (req, res)=>{
        try{
            const chat = await Chat.findOneAndUpdate({chat_room_id:req.params.chatroomId}, {last_chat: req.body.last_chat});
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](chat, 'SuccessOK', STATUS_CODE.SuccessOK);
        }catch (error){
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'updateChatError', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    getTest: async (req, res) =>{
        try{
            const chats = await Chat.find()
                .populate('chat_room_id');
            for(let i = 0; i < chats.length; ++i){
                console.dir(chats[i]);
            }
        }catch(error){

        }
    }
}

module.exports = chatController;