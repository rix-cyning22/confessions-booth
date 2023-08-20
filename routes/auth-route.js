const xprs = require("express");
const router = xprs.Router();
const authControl = require("../controllers/auth-control");
const { check } = require("express-validator");
const User = require("../models/user-model")

router.post("/login", [
    check("email", "Enter a valid email address").isEmail().normalizeEmail().trim()
    .custom((value, { req }) => {
        if (!value)
            return Promise.reject("Enter email id!")
        return User.findOne({email: value})
            .then(user => {
                if (!user)
                    return Promise.reject("Invalid Login Credentials.")
            })
    }),
    check("password", "A password must be five characters long.").isLength({min: 5})
 ],
 authControl.checkLogCred);

router.post("/signup",[
    check("password", "A password must be five characters long.")
        .isLength({min: 5}).custom((value, { req }) => {
            if (value !== req.body.pconf)
                throw new Error("Passwords have to match!");
            else
                return true;
        }),

    check("email", "Enter a valid email address")
        .isEmail().normalizeEmail().trim()
        .custom((value, { req }) => {
            return User.findOne({email: value})
                .then(userDet => {
                    if (userDet)
                        return Promise.reject("That email ID already exists, choose another.")
            })
    }),
    check("name", "Your name cannot have any special character or be empty.")
        .isAlphanumeric().trim()
 ],
  authControl.checkSignCred);

router.get("/logout", authControl.logOut);
router.get("/signup", authControl.signupPg);
router.get("/login", authControl.loginPg);

module.exports = router;