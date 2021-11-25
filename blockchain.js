const SHA256 = require('crypto-js/sha256');

const {Block} = require("./block");

const {Transaction} = require("./transaction");

const {MerkelTree} =  require("./MerkelTree");

const elliptic = require ("elliptic");

const ec = new elliptic.ec("secp256k1");


class Blockchain {


    constructor() {
        
        this.chain = [this.createGenesisBlock()];
        this.currentTransactions = [];  // 100
    }

    createGenesisBlock() {
        
        return new Block(0,Date.now(),[],0,'',0);

    }


    getLatestBlock() {

       return this.chain[this.chain.length-1];

    }

    getBlockBYIndex(Id)  {

        return this.chain[Id];

    }

    MinecurrentTransactions(toPrivateKey) {

        // get Latest Block
        
        const latestBlock = this.getLatestBlock();

        // get Index

        let currentIndex = this.chain.length;

        // get current transaction

        var transactionList =  this.currentTransactions;

        // current txns

        console.log(this.currentTransactions)

        // log current transactions

        console.log("Number of transactions ........ " , this.currentTransactions.length)

        // Initiate merkel tree

        let Root = new MerkelTree();

        // create merkle tree for current transactions

        Root.createTree(transactionList);

        console.log("creating Merkel tree ...........")

        // log Merkel tree

        console.log(Root.root);

        // Log root hash

        console.log("Merkel root Hash is ......",Root.root[0]);

        // Root Hash of Merkel tree

        var Merkel_hash = Root.root[0] ;

        
        // sign root hash

       const keypair = ec.keyFromPrivate(toPrivateKey, "hex");

       var Signature  = keypair.sign(Merkel_hash).toDER("hex");

      // log signature

       console.log(Signature);

       // creating new block


       let block = new Block( 
           
         currentIndex,
         Date.now(),
         this.currentTransactions,
         latestBlock.hash,
         Merkel_hash
        
        );

        // Adding to Blockchain

        this.chain.push(block);

        // Reset current Transactions

        this.currentTransactions = [];

        // log Current transactions

       console.log(this.currentTransactions.length)


    }

    
    addTransaction(transaction) {

        this.currentTransactions.push(transaction);

    }

    isvalidChain() {

        for (let i= 1; i<=this.chain.length;i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previoushash !== previousBlock.hash) {
                return false
            }
        }
    }

    
}


exports.Blockchain = Blockchain;


