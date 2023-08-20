const bcrypt = require("bcryptjs")
const fileHelper = require("../util/del-file.js")
const Channel = require("../models/channel-model");
const Message = require("../models/msg-model");
const Date = require("node-datetime");
const { validationResult } = require("express-validator");

exports.createGroupPg = (req, res, next) => res.render("./user/create-channel", {
    pgTitle: "Create group",
    userName: req.user.name,
    errMsg: req.flash("grp-err"),
    oldInput: { name: null, details: null, imgURL: null }})

exports.createG = (req, res, next) => {
    const errors  = validationResult(req);
    if (!errors.isEmpty())
    {
        for (const err of errors.errors)
            req.flash("grp-err", err.msg);
        return res.render("./user/create-channel", {
            pgTitle: "Create group",
            userName: req.user.name,
            errMsg: req.flash("grp-err"),
            oldInput: req.body
        })
    }
    bcrypt.hash(req.body.password, 12)
        .then(hashed => {
            const imgURL = (req.files.imgURL)? req.files.imgURL[0].path: "images/default/dwight-bg.png";
            const channel = new Channel({
                name: req.body.feedName,
                adminId: req.user._id,
                members: [req.user._id],
                messages: [],
                time: Date.create().format("d n y at H:M"),
                details: req.body.details,
                imgURL: imgURL,
                password: hashed
            })
            channel.save()
                .then(channel => {
                    req.user.joinChannel(channel._id)
                    return res.redirect("/feed/" + channel._id)
                })
        })
}

exports.editGroupPg = (req, res, next) => Channel.findOne({_id: req.params.channelID})
    .then(channel => {
        if (channel.adminId.toString() != req.user._id.toString())
            return res.redirect("/")
        return res.render("./user/edit-channel", {
            pgTitle: "Edit channel " + channel.name,
            userName: req.user.name,
            chnlDet: channel,
            errMsg: req.flash("edit-err"),
            adminName: req.user.name
        })     
    })

exports.editGroup = (req, res, next) => Channel.findOne({_id: req.params.edittedID})
    .then(channel => {
        if (channel.adminId .toString() != req.user._id.toString())
            return res.redirect("/");
        return bcrypt.hash(req.body.password, 12)
            .then(hashed => {
                channel.name = req.body.feedName;
                channel.adminId = req.user._id;
                channel.details = req.body.details;
                if (req.files.imgURL)
                {
                    if (channel.imgURL != "images/default/dwight-bg.png")
                        fileHelper.delFile(channel.imgURL);
                    channel.imgURL = req.files.imgURL[0];
                }
                channel.password = hashed;
                return channel.save()
            })
    })
    .then(res.redirect("/"))

exports.delChannel = (req, res, next) => Channel.findOne({_id: req.params.channelID})
    .then(channel => {
        if (!channel)
            return res.redirect("/");
        if (channel.imgURL != "images/default/dwight-bg.png")
            fileHelper.delFile(channel.imgURL)
        req.user.leaveChannel(req.params.channelID)
            .then(() => 
                Channel.deleteOne({_id: req.params.channelID})
                    .then(() => 
                        Message.deleteMany({channelID: req.params.channelID})
                            .then(res.redirect("/"))
                    )
            )
    })