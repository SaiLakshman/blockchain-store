const SHA256 = require('crypto-js/sha256');


// Block


class Block {

    constructor(index,timestamp,transactions,previousHash = "" ,MerkelRoot='') {

        this.index = index;
        this.timestamp= timestamp;
        this.currentTransactions=transactions;
        this.previousHash = previousHash;
        this.MerkelRoot = MerkelRoot
        this.hash = this.calculateHash();
    }

    calculateHash() {

        return SHA256(this.index + this.previousHash + this.MerkelRoot + this.timestamp + this.nonce + JSON.stringify(this.data)).toString();
    }

    
}

exports.Block = Block;

