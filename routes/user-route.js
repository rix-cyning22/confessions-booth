const feedC = require('../controllers/user-control');
const xprs = require("express");
const router = xprs.Router();
const isAuth = require("../util/isAuth")
const { check } = require("express-validator")

router.post("/choose-group", isAuth, [
    check("channelName").trim()
        .custom((value, { req }) => {
            if (!value)
                return Promise.reject("The Channel must have a name!");
            return Channel.findOne({name: value})
                .then(channel => {
                    if (!channel)
                        return Promise.reject("This channel does not exist! Choose an exisiting channel or create a new one.")
                    else if (channel.members.includes(req.user._id))
                        return Promise.reject("You are already a member of the group.")
                    else
                        return true;
                })
        }),
    
        check("password")
            .custom((value, { req }) => {
                if (!value)
                    return Promise.reject("Enter the password to get entry into the channel.")
                return true;
            }),
], feedC.joinGroup);

router.delete("/msg/:msgID", isAuth, feedC.delMsg);
router.post("/channel-settings/leave-channel/:channelID", isAuth, feedC.leaveChannel);
router.get("/choose-group", isAuth, feedC.joinGroupPg);
router.get("/", isAuth, feedC.userPg);

module.exports = router;