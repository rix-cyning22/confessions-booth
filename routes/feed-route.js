const feedC = require('../controllers/feed-control');
const xprs = require("express");
const router = xprs.Router();
const isAuth = require("../util/isAuth")
const { check } = require("express-validator")

router.post("/confess/:channelID", isAuth, 
    check("confessTxt").trim()
        .custom((value, { req }) => {
            if (value)
                return true;
            else
                throw new Error("empty");
        }),
        feedC.postConfession);

router.get("/feed/:channelID", isAuth, feedC.feedPg);

module.exports = router;