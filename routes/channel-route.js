const xprs = require("express");
const router = xprs.Router();
const isAuth = require("../util/isAuth")
const { check } = require("express-validator")
const Channel = require("../models/channel-model")
const feedC = require('../controllers/channel-control');

router.post("/create-group", isAuth, [
    check("feedName").trim()
        .custom((value, { req }) => {
            if (!value)
                return Promise.reject("The channel name cannot have any uppercase or special characters or be empty");
            return Channel.findOne({name: value})
                .then(channel => {
                    if (channel)
                        return Promise.reject("The channel already exists!");
                })
            }),

    check("details").trim()
        .custom((value, { req }) => {
            if (!value)
                return Promise.reject("Enter the purpose of the channel");
            else
                return true;
        }),

    check("password", "The password must be atleast 5 characters long").isLength({min: 5})
        .custom((value, { req }) => {
            if (value != req.body.pconf)
                return Promise.reject("The passwords have to match!");
            return true;
        }),
], feedC.createG);

router.post("/edit-channel/:edittedID", isAuth, [

    check("feedName").custom((value, { req }) => {
            if (!value)
                return Promise.reject("The channel must have a name.")
            return Channel.findOne({name: value})
                .then(channel => {
                    if (channel)
                        return Promise.reject("The channel already exists!");
                })
            }),

    check("details").trim()
        .custom((value, { req }) => {
            if (!value)
                return Promise.reject("Enter the purpose of the channel");
            else
                return true;
        }),

    check("password", "The password must be atleast 5 characters long").isLength({min: 5})
        .custom((value, { req }) => {
            if (value != req.body.pconf)
                return Promise.reject("The passwords have to match!");
            return true;
        })   
], feedC.editGroup);

router.get("/create-group", isAuth, feedC.createGroupPg);
router.post("/channel-settings/del-channel/:channelID", isAuth, feedC.delChannel);
router.post("/channel-settings/:channelID", isAuth, feedC.editGroupPg);

module.exports = router;