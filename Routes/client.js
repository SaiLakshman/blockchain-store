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



// BlockChain

let Chain = new Blockchain();

// MerkelTree

let Root = new MerkelTree();


// send transaction


router.post('/sendTransaction', auth.required, (req, res, next) => {


    // schema 

    var name, subject, message, from, to;

    name = req.body.name;
    subject = req.body.subject;
    message = req.body.message;
    from = req.body.from;
    to = req.body.to;

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


                    message = req.body.message;
                    var signingkey = fromPrivateKey;
                    var verificationKey = fromPublicKey;

                    //   console.log(fromPrivateKey);
                    //   console.log(fromPublicKey);

                        // creating transaction object
    
                        var tx = new Transaction(from,to,message);

                        // sign transaction using signing key

                        tx.signTransaction(signingkey);

                        // validation of transaction

                        if (tx.isvalid(verificationKey)) {

                            // if valid Add transactions to current transactions array

                            Chain.addTransaction(tx);
                            console.log(tx);

                            // length of current transactions

                            // console.log(Chain.currentTransactions.length);

                            // console.log(Chain.currentTransactions);

                       // }

                        // if current transaction reaches 100

                        if (Chain.currentTransactions.length == 100) {

                            // add to blockchain

                            Chain.MinecurrentTransactions(toPrivateKey);

                            // log blockchain

                            console.log(Chain);

                        }


                        var newMessage = new MessageSchema();
                        newMessage.to = req.body.to;
                        newMessage.from = req.body.from;
                        newMessage.name = req.body.name;
                        newMessage.subject = req.body.subject;
                        newMessage.message = req.body.message;
                        newMessage.save().then(function () {

                            res.send("Transaction send Successfully")
                        }).catch(next);

                    }
                }
            });
        }

    });




})

// Login


app.post('/Login', (req, res) => {

    const Name = req.body.Name;
    const mail = req.body.mail;
    const password = req.body.password

    let keys = keyGenerator.generateKey()
    res.status(200).send({
        status: true,
        message: "generated keys successfully",
        key: keys
    })


})


router.get("/keys", async (req, res) => {

    let keys = keyGenerator.generateKey()
    res.status(200).send({
        status: true,
        message: "generated keys successfully",
        key: keys
    })

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


// get public keys


router.get("/publicKeys", async (req, res) => {
    User.find({}, { email: 1, publicKey: 1 }).then(function (result) {
        if (typeof result == 'undefined') {
            return res.status(404).send({ status: false, message: "No Users find" })
        }
        return res.status(200).send(result)
    }).catch(next)
})




module.exports = router;


