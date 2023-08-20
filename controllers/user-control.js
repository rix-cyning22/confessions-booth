const Channel = require("../models/channel-model");
const Message = require("../models/msg-model");
const { validationResult } = require("express-validator");

exports.userPg = (req, res, next) => req.user.populate("mmbIn")
        .then(memberIn => 
            Channel.find({adminId: req.user.id})
                .then(createdChannels => 
                    Message.find({userID: req.user._id}).populate("channelID")
                        .then(messages => 
                            res.render("./user/user-page", {
                                pgTitle: req.user.name,
                                userName: req.user.name,
                                activity: messages,
                                userDetails: req.user,
                                createdChannels: createdChannels,
                                mmbIn: memberIn
                            })
                        )))


exports.joinGroupPg = (req, res, next) => Channel.find()
    .then(channels => {
        const notIn = [];
        for (const channel of channels)
            if (!req.user.mmbIn.includes(channel._id))
                notIn.push(channel);
        return notIn;
    })
    .then(channelsToJoin => { return res.render("./user/join-group", {
            pgTitle: "Join a Group",
            userName: req.user.name,
            channels: channelsToJoin,
            errMsg: req.flash("join-err")
        })
    })

exports.joinGroup = (req, res, next) => 
{
    const errors =validationResult(req)
    if (!errors.isEmpty())
    {
        for (const err of errors.errors)
            req.flash("join-err", err.msg);
        return res.redirect("/choose-group")
    }
    Channel.findOne({name: req.body.channelName})
    .then(channel => {
        bcrypt.compare(req.body.password, channel.password)
            .then(match => 
            {
                if (!match)
                {
                    req.flash("join-err", "Password does not match!")
                    return res.redirect("/choose-group")
                }
                else
                {
                    const updatedMembers = [...channel.members];
                    updatedMembers.push(req.user._id);
                    channel.members = updatedMembers;
                    return channel.save()
                        .then(channel => {
                            req.user.joinChannel(channel._id)
                            res.redirect("/feed/" + channel._id)
                        })
                }
            })
    })
}

exports.delMsg = (req, res, next) => Message.findById(req.params.msgID)
        .then(msg => {
            msg.content = "<message deleted>";
            msg.userID = null;
            return msg.save();
        })
        .then(res.status(200).json({msg: "success"}))

exports.accSettingsPg = (req, res, next) => res.render("./user/acc-settings", {
        pgTitle: "Edit Account",
        userName: req.user.name,
        userDet: req.user,
        errMsg: req.flash("edit-err")
    })

    exports.leaveChannel = (req, res, next) => 
{
    Channel.findOne({_id: req.params.channelID})
        .then(channel => {
            if (!channel)
                res.redirect("/");
            if (channel.members.includes(req.user._id))
            {
                const updtdChnlMmb = channel.members.filter(mmb => {
                    return mmb.toString() != req.user._id.toString();});
                channel.members = updtdChnlMmb;
                return channel.save()
                    .then(channel => {
                        if (channel.adminId.toString() == req.user._id.toString())
                        {
                            if (channel.members.length > 0)
                            {
                                channel.adminId = channel.members[0];
                                return channel.save();
                            }
                            else
                                return Channel.deleteOne({_id: req.params.channelID})
                                    .then(res.status(200).json({SingleMmb: true}))
                        }
                        return;
                    })
                    .then(() => {
                        req.user.leaveChannel(req.params.channelID)
                            .then(() => 
                                Message.find({
                                    userID: req.user._id,
                                    channelID: req.params.channelID
                                    })
                                    .then(messages => {
                                        for (const msg of messages)
                                        {
                                            msg.content = "<message deleted>";
                                            msg.userID = null;
                                            msg.save()
                                        }
                                    }))
                            .then(res.redirect("/"))
                        })
            }
            else
                res.redirect("/");
        })
}