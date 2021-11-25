const elliptic = require ("elliptic");
const ec = new elliptic.ec("secp256k1");

function generatekey() {
const key = ec.genKeyPair();
  
  var public_key = key.getPublic('hex');
  var private_key = key.getPrivate('hex');

    const keydata = ({
        publicKey: public_key,
        privateKey: private_key
    })

    return keydata;
}    

 // sign
 
function sign(message, privateKey) {
  try {
    const keypair = ec.keyFromPrivate(privateKey, "hex");
    return keypair.sign(message).toDER("hex");
  } catch (error) {
    return "invalid signature";
  }
}

// verify

function verifySignature(message, signature, publicKey) {
  try {
    const keypair = ec.keyFromPublic(publicKey, "hex");
    return ec.verify(message, signature, keypair);
  } catch (error) {
    return false;
  }
}

exports.sign = sign;
exports.verifySignature = verifySignature;
exports.generatekey = generatekey;
