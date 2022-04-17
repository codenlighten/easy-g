require("dotenv").config();
const bsv = require("bsv");
const { add } = require("bsv/lib/networks");
// const purse = bsv.PrivateKey.fromWIF(process.env.PRIVATEKEY);
const Run = require("run-sdk");
const run = new Run({
	network: "main",
});
console.log(run.purse);

//private keys and wifs
const privkey = bsv.PrivateKey.fromRandom();
console.log(privkey);
// const privkey2 = privkey.toWIF();
// console.log(privkey2);

const privatKey1 = bsv.PrivateKey.fromWIF(process.env.PURSE_WIF);
const privatKey2 = bsv.PrivateKey.fromWIF(process.env.PURSE_WIF2);

const pubKey1 = bsv.PublicKey.fromPrivateKey(privatKey1);
const pubKey2 = bsv.PublicKey.fromPrivateKey(privatKey2);
//get public key into hex format to view
// console.log(pubKey1.toHex());
// console.log(pubKey2.toHex());
//or import again and show the same from hex
let pubKey3 = bsv.PublicKey.fromHex(process.env.PUBKEY1);
// console.log(pubKey3.toHex());

const address = bsv.Address.fromPublicKey(pubKey1);
// console.log(address.toString());

const address2 = bsv.Address.fromPublicKey(pubKey2);
// console.log(address2.toString());
