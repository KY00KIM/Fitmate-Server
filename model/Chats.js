const mongoose = require('mongoose');
const { Types: { ObjectId } } = mongoose.Schema;


const chatSchema = mongoose.Schema({
    chat_room_id: {
        type: ObjectId,
        ref: 'Chatroom',
        unique: true
    },
    last_chat:{
        type: String,
        default: "상대방과 채팅을 시작하세요!"
    }
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true }
});


const Chat = mongoose.model('Chat', chatSchema);

module.exports = { Chat };