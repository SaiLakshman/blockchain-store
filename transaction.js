const SHA256 = require('crypto-js/sha256');
const verifySignature = ("./utility/keyGenerator");
const elliptic = require ("elliptic");
const ec = new elliptic.ec("secp256k1");



class Transaction {

    
    constructor(from,to,message) {
      
      this.from = from;       // client public key
      this.to = to;           // server public key
      this.message = message; // client
     
      this.hash = this.computeHash();  // hash of transaction
     
    }
 
    computeHash() {
        
      return SHA256(this.message + this.from + this.to).toString();
     
    }



    signTransaction(signingKey) {  

      const keypair = ec.keyFromPrivate(signingKey, "hex");

      const hash = this.computeHash();

      // signing hash 

      this.signature = keypair.sign(hash).toDER("hex");
     
    }

    isvalid(publicKey) {

    if(!this.signature || this.signature === 0) {

      throw new error('No signature')
    }  

    const keypair = ec.keyFromPublic(this.from, "hex"); 

      if(keypair.getPublic('hex') != publicKey) {
              throw new Error("Invalid");
      }  

     //   verifying signature 

    return ec.verify(this.hash, this.signature, keypair);
    
    }

  }
 
 exports.Transaction = Transaction;


