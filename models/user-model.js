const mngs = require("mongoose");
const Schema = mngs.Schema;

const UserSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mmbIn: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Channel"
    }]
});

UserSchema.methods.joinChannel = function(channelID) 
{
    const updtdMmbArr = [...this.mmbIn];
    updtdMmbArr.push(channelID);
    this.mmbIn = updtdMmbArr;
    return this.save();
}
UserSchema.methods.leaveChannel = function(id)
{
    const updatedmmbin = this.mmbIn.filter(mmb => {
        return mmb.toString() != id.toString();})
    this.mmbIn = updatedmmbin;
    return this.save();
}

module.exports = mngs.model("User", UserSchema);