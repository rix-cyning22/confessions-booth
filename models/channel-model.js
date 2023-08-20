const mngs = require("mongoose");
const Schema = mngs.Schema;

const ChannelSchema = new Schema({
    adminId: {
        type: mngs.Types.ObjectId,
        required: true,
        ref: "User"
    },
    name:  {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    members: [Schema.Types.ObjectId],
    imgURL: String,
    password: {
        type: String,
        required: true
    }
})

module.exports = mngs.model("Channel", ChannelSchema)