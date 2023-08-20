const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.checkLogCred = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        for (const err of errors.errors)
            req.flash("login-err", err.msg)
        return res.status(422).render("./auth/login" , {
            pgTitle: "Login",
            errMsg: req.flash("login-err"),
            oldInput: {
                email: req.body.email,
                pgTitle: "Log in"
            }
        });
    }
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user)
            {
                res.status(422).render("./auth/login", {
                    pgTitle: "Log in",
                    errMsg: req.flash("login-err"),
                    oldInput: { email: req.body.email }
                })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(match => {
                    if (!match)
                    {
                        res.render("./auth/login", {
                            pgTitle: "Log in",
                            errMsg: req.flash("login-err"),
                            oldInput: { email: req.body.email }
                        })
                    }
                    else
                    {
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        return req.session.save(() => res.redirect("/"))
                    }
                })
        })
}
exports.loginPg = (req, res, next) => 
    res.render("./auth/login", {
        pgTitle: "Log in",
        errMsg: req.flash("login-err"),
        oldInput: { email: null }
    })

exports.signupPg = (req, res, next) => 
    res.render("./auth/signup", {
        pgTitle: "Sign Up",
        errMsg: req.flash("signup-err"),
        oldInput: {
            name: null,
            email: null,
        }
    })

exports.checkSignCred = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        for (const err of errors.errors)
            req.flash("signup-err", err.msg)
        return res.render("./auth/signup", {
            pgTitle: "Sign up",
            errMsg: req.flash("signup-err"),
            oldInput: {
                name: req.body.name,
                email: req.body.email,
            }
        });
    }
    bcrypt.hash(req.body.password, 12)
        .then(hashedPass => {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPass
            })
            return user.save();
            })
        .then(res.redirect("/login"));
}
exports.logOut = (req, res, next) => req.session.destroy(err => res.redirect("/login"))