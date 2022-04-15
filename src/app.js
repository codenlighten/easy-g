require("dotenv").config();
const { BFile, networks } = require("./index");
const { publish, read } = require("./commands/index");
const bsv = require("bsv");

const purse = bsv.PrivateKey.fromWIF(process.env.PRIVATEKEY2);
const purse2 = process.env.PRIVATEKEY2;
// console.log(bsv.PrivateKey.fromWIF(purse2));

const asset = "./assets/common.mp4";
const main = async () => {
	try {
		const bFile = await BFile.fromFilePath(asset);
		console.log(bFile);
		const txid = await publish(bFile, networks.MAINNET, purse2);
		console.log(txid);
	} catch (error) {
		console.log(error);
	}
};

main();
