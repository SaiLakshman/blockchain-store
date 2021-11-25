var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('users');
var auth = require('../utility/auth');
var generator = require('generate-password');
var crypto = require('crypto');
var async = require('async');
const log4js = require('log4js');
const { equal } = require('assert');
const logger = log4js.getLogger('USER-LOG');
var jwt = require('jsonwebtoken');
const keyGenerator = require("../utility/keyGenerator");



router.get('/user', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        if (!user) { return res.status(404).send({ status: false, message: "User not found" }); }
        return res.status(200).send({ status: true, user: user.userDetailsJSON() });
    }).catch(next);
});

router.put('/updateuser', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        if (!user) { return res.sendStatus(401); }

        //TODO - need to add condition is userverified and approved for user

        // only update fields that were actually passed...
        if (typeof req.body.firstName !== 'undefined') {
            user.firstName = req.body.firstName;
        }
        if (typeof req.body.lastName !== 'undefined') {
            user.lastName = req.body.lastName;
        }
        if (typeof req.body.gender !== 'undefined') {
            user.gender = req.body.gender;
        }
        if (typeof req.body.email !== 'undefined') {
            user.email2 = req.body.email;
        }
        if (typeof req.body.address !== 'undefined') {
            user.address = req.body.address;
        }

        if (typeof req.body.pincode !== 'undefined') {
            user.pincode = req.body.pincode;
        }

        if (typeof req.body.mobileno !== 'undefined') {
            user.mobileno = req.body.mobileno;
        }

        return user.save().then(function () {
            return res.json({ status: true, message: "Profile updated successfully" });
        });
    }).catch(next);
});

router.post('/login', function (req, res, next) {
    if (!req.body.user.email) {
        return res.status(422).json({ errors: { email: "can't be blank" } });
    }

    if (!req.body.user.password) {
        return res.status(422).json({ errors: { password: "can't be blank" } });
    }

    passport.authenticate('local', { session: false }, function (err, user, info) {
        if (err) { return next(err); }

        if (user) {
            user.token = user.generateJWT();
            logger.info("Login Succesfull User " + req.body.user.email)
            return res.status(200).send({
                status: true,
                message: "Login Success",
                user: user.toAuthJSON()
            });
        } else {
            logger.error("Login Failed User " + req.body.user.email)
            return res.status(422).send({
                status: false,
                message: "Login Falied",
                error: info
            });
        }
    })(req, res, next);

  

});

router.post('/registeruser', function (req, res, next) {
    
    var user = new User();

    let keys = keyGenerator.generatekey()
    

    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.role = req.body.user.role;
    user.setPassword(req.body.user.password);
    user.publicKey = keys.publicKey
    user.privateKey = keys.privateKey


    // res.send({keys :keys.publicKey})
    user.save().then(function () {
        return res.json({ user: user.toAuthJSON() });
    }).catch(next);
});



module.exports = router;
