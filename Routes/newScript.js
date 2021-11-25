const express = require("express");
const { required } = require("../utility/auth");
const router = express.Router();
const app = express();
const keyGenerator = require("../utility/keyGenerator");
const auth = require('../utility/auth');
const { Transaction } = require("../transaction");
const { ReturnDocument } = require("mongodb");
var mongoose = require('mongoose');
const User = mongoose.model('users');
const { Blockchain } = require("../blockchain");
const MessageSchema = mongoose.model('Message');
const { MerkelTree } = require("../MerkelTree");
const elliptic = require("elliptic");
const ec = new elliptic.ec("secp256k1");




var passport = require('passport');
var generator = require('generate-password');
var crypto = require('crypto');
var async = require('async');
const log4js = require('log4js');
const { equal } = require('assert');
const logger = log4js.getLogger('USER-LOG');
var jwt = require('jsonwebtoken');



let Chain = new Blockchain();

let Root = new MerkelTree();

const userData = require("../configs/userData.json");

// Register user

router.post('/registeruser', function (req, res, next) {

    let keys = keyGenerator.generatekey()
    var result = [];

    var user = new User();

    let serverList = userData.servers;

    user.username = serverList[0].username;
    user.email = serverList[0].email;
    user.role = serverList[0].role;
    user.setPassword(serverList[0].password);
    user.publicKey = keys.publicKey
    user.privateKey = keys.privateKey


    // res.send({keys :keys.publicKey})
    user.save().then(function () {
        // return res.json({ user: user.toAuthJSON() });
        console.log(user.toAuthJSON())
        result.push(user.toAuthJSON())
    }).catch(next);

    let userList = userData.users;

    for (let value of userList) {

        console.log(value.email)

        keys = keyGenerator.generatekey()

        user = new User();

        user.username = value.username;
        user.email = value.email;
        user.role = value.role;
        user.setPassword(value.password);
        user.publicKey = keys.publicKey
        user.privateKey = keys.privateKey


        // res.send({keys :keys.publicKey})
        user.save().then(function () {
            // return res.json({ user: user.toAuthJSON() });
            console.log(user.toAuthJSON())
            result.push(user.toAuthJSON())
        }).catch(next);

    }
    console.log("djhdh-------------------------   ", result)
    return res.status(200).send({ result: result });

});


// run script


router.post("/runscript", async (req, res) => {

    let data = {};
    var serverPublicKey;
    let serverList = userData.servers;
    User.findOne({ email: serverList[0].email }).then(function (server) {
        serverPublicKey = server.publicKey;

    });

    //to store all logs and send 
    var resultData = [];

    let userList = userData.users;


    // console.log(random, userList[random]);


    var count = 0;


    function intervalFunc(err) {
        count++;

        const random = Math.floor(Math.random() * userList.length);

        User.findOne({ email: userList[random].email }).then(function (user) {
            console.log(data.password)
            if (!user || !user.validPassword(userList[random].password)) {
                console.log("error")
            }

            user.token = user.generateJWT();
            let response = user.toAuthJSON();
            console.log(response);


            // schema

            var name, subject, message, from, to;

            name = user.email;
            subject = 'subjecttest' + count;
            message = "Hello" + count;
            from = user.publicKey;
            to = serverPublicKey

            if (!name) {
                return res.status(400).send({ status: false, message: "Name is missing" });
            }
            if (!subject) {
                return res.status(400).send({ status: false, message: "Subject is missing" });
            }
            if (!message) {

                return res.status(400).send({ status: false, message: "Message is missing" });
            }

            var fromPublicKey, fromPrivateKey, toPublicKey, toPrivateKey;

            User.findOne({ publicKey: to }).then(function (toUser) {

                if (!toUser) { return res.status(404).send({ status: false, message: "User not found" }); }
                else {

                    toPrivateKey = toUser.privateKey;
                    toPublicKey = toUser.publicKey;

                    User.findOne({ publicKey: from }).then(function (fromUser) {

                        if (!fromUser) { return res.status(404).send({ status: false, message: "User not found" }); }
                        else {

                            fromPrivateKey = fromUser.privateKey;
                            fromPublicKey = fromUser.publicKey;


                            var signingkey = fromPrivateKey;
                            var verificationKey = fromPublicKey;

                            //   console.log(fromPrivateKey);
                            //   console.log(fromPublicKey);

                            // creating message

                            var tx = new Transaction(from, to, message);

                            // sign transaction using private key

                            tx.signTransaction(signingkey);

                            // validation of transaction

                            if (tx.isvalid(verificationKey)) {

                                // if valid Add transactions to current transactions array

                                Chain.addTransaction(tx);

                                resultData.push(tx);
                                console.log(tx);

                                // length of current transactions

                                console.log(Chain.currentTransactions.length);

                                // console.log(Chain.currentTransactions);

                            }

                            // if current transaction reaches 100

                            if (Chain.currentTransactions.length == 100) {

                                // add to blockchain

                                Chain.MinecurrentTransactions(toPrivateKey);

                                // log blockchain

                                console.log(Chain);

                            }


                            var newMessage = new MessageSchema();

                            newMessage.to = to;

                            newMessage.from = from;

                            newMessage.name = name;

                            newMessage.subject = subject;

                            newMessage.message = message;
                            newMessage.save().then(async function () {

                                console.log('Transaction send Successfully"');
                            }).catch(err)

                        }
                    });

                }
            });








        })
        if (count == '200') {
            clearInterval(this);
            res.send(resultData)

        }

    }
    setInterval(intervalFunc, 500);




})



// get latest block


router.get('/getLatestBlock', (req, res) => {

    const result = Chain.getLatestBlock();

    res.json(result);

})

// block number

router.get("/blocknumber", (req, res) => {

    const result = (Chain.chain.length) - 1;

    res.send({ NumberOfBlocksCreated: result });
})


// get block by Index


router.get("/getBlockByIndex/:Id", (req, res) => {

    var Id = req.params.Id;

    const result = Chain.getBlockBYIndex(Id);

    res.json(result);
})




module.exports = router;