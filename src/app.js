require("dotenv").config();
const { BFile, networks } = require("./index");
const { publish, read } = require("./commands/index");
const bsv = require("bsv");
const { decrypt } = require("./crypto");

console.log(bsv.Address.fromPrivateKey(bsv.PrivateKey.fromRandom()).toString());

const purse = bsv.PrivateKey.fromWIF(process.env.PRIVATEKEY2);
const purse2 = process.env.PRIVATEKEY2;
// console.log(purse2);
// console.log(bsv.PrivateKey.fromWIF(purse2));
class Meta {
	constructor(
		application,
		appID,
		workTitle,
		authorArray,
		authorPaymail,
		publishers,
		publishersID,
		publishersPaymail
	) {
		(this.application = application),
			(this.appID = appID),
			(this.workTitle = workTitle),
			(this.authorArray = authorArray);
		(this.authorPaymail = authorPaymail),
			(this.publishers = publishers),
			(this.publishersID = publishersID),
			(this.publishersPaymail = publishersPaymail);
		this.publishDate = Date();
	}
}
let streamableProtocol = "1HSq6J417PqxwXxAEWD3cdxDJVvkjELCHy";
let meta = new Meta(
	"Rare Generation",
	"1HSq6J417PqxwXxAEWD3cdxDJVvkjELCHy",
	"NFTYPng",
	["Greg Ward"],
	["14hHqvoSB5nC5aiSAhxvEcpyg6CiLAhru9"],
	["Greg Ward", "Rare Generation Publishing"],
	["1KEQPYyEhJwxX95mAH9uSbqyukhvQgpCo5"],
	["14hHqvoSB5nC5aiSAhxvEcpyg6CiLAhru9", "17Tibq24ahAK71a5Ffqaf5RfQpWGb5Yovb"],
	[`${process.env.ADDRESS2}`]
);

// console.log("meta", meta.appID);

const main = async (fileName, buf, meta) => {
	console.log("...working");
	try {
		const bFile = await BFile.fromFilePath(fileName, buf, meta);
		// console.log(bFile);
		const txid = await publish(bFile, networks.MAINNET, purse2);
		const metaPublish = await myReader(txid);
		const publishResponse = { txid, metaPublish };
		console.log("Success Publishing media", txid);
		console.log(publishResponse);
		return publishResponse;
	} catch (error) {
		console.log(error);
	}
};

// main(asset, meta);

const myReader = async (txid) => {
	// console.log("...working hard to retrieve your data, please wait");
	try {
		let response = await read(txid);
		let myMedia = {
			buff: response.buff,
			mime: response.mime,
			format: response.format,
			fileName: response.fileName,
			appID: response.appID,
		};
		let DRMhash = response.DRMhash;
		let encrypted = response.encrypted;
		let decrypted = decrypt(JSON.parse(encrypted));
		// 	JSON.stringify(
		// 	encrypt(Buffer.from(this.buff).toString("base64"))
		// );

		let myMeta = JSON.parse(response.meta);
		//parsed meta gives our json object back

		// console.log("Reading success!", myMedia);
		// console.log("MyMeta", myMeta);
		return { myMedia, myMeta, DRMhash, encrypted, decrypted };
	} catch (error) {
		console.log(error);
	}
};

// myReader();

module.exports = {
	myReader,
	main,
};
