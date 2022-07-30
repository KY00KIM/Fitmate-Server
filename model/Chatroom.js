const mongoose = require('mongoose');
const { Types: { ObjectId } } = mongoose.Schema;


const chatroomSchema = mongoose.Schema({
    chat_start_id: {
        type: ObjectId,
        ref: 'User'
    },
    chat_join_id: {
        type: ObjectId,
        ref: 'User'
    },
    is_deleted: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true }
});


const Chatroom = mongoose.model('Chatroom', chatroomSchema);

module.exports = { Chatroom };