const mngs = require("mongoose");
const Schema = mngs.Schema;

const MsgSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channelID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Channel"
    },
    time: {
        type: String,
        required: true
    },
    replies: [{
        content: {
            type: String,
            required: true
        },
        time: String
    }]
})

module.exports = mngs.model("Message", MsgSchema);