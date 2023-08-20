const Channel = require("../models/channel-model");
const Message = require("../models/msg-model");
const Date = require("node-datetime");
const { validationResult } = require("express-validator");
const mngs = require("mongoose")

exports.feedPg = (req, res, next) => {
    if (mngs.Types.ObjectId.isValid(req.params.channelID))
        Message.find({channelID: req.params.channelID})
            .then(messages => {
                if (!messages)
                    return res.redirect("/choose-group")
                return Channel.findOne({_id: req.params.channelID})
                    .then(channel => {
                        if (!channel)
                            return res.redirect("/choose-group")
                        return res.render("./user/feed", {
                            pgTitle: channel.name,
                            userName: req.user.name,
                            chnlDet: channel,
                            msgs: messages
                        })
                    }) 
                })
    else
       return res.end(); 
}

exports.postConfession = (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty())
        return res.redirect("/feed/" + req.params.channelID)
    if (!req.body._repliedTo)
    {
        const msg = new Message({
            content: req.body.confessTxt,
            userID: req.user._id,
            channelID: req.params.channelID,
            time: Date.create().format("d n y at H:M"),
            replies: []
        });
        msg.save()
            .then(res.redirect("/feed/" + req.params.channelID));
    }
    else
        Message.findOne({_id: req.body._repliedTo})
            .then(message => {
                if (message)
                {
                    const updatedRep = [...message.replies];
                    var rep = req.body.confessTxt;
                    if (message.userID.toString() == req.user._id.toString())
                        rep = "<Confessor> \t" + rep 
                    updatedRep.push({
                        content: rep,
                        time: Date.create().format("d n y at H:M")
                    });
                    message.replies = updatedRep;
                    message.save()
                        .then(res.redirect("/feed/" + req.params.channelID));
                }
            })
}