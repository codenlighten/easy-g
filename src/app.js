require("dotenv").config();
const { BFile, networks } = require("./index");
const { publish, read } = require("./commands/index");
const bsv = require("bsv");

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
	}
}

let meta = new Meta(
	"streamable.fm",
	"1CX54YFZcLSGzoUJHjAXNkTFh3WJRhSyH1",
	"Can We Just Agree?",
	["Greg Ward"],
	["14hHqvoSB5nC5aiSAhxvEcpyg6CiLAhru9"],
	["1KEQPYyEhJwxX95mAH9uSbqyukhvQgpCo5"],
	["Greg Ward", "Rare Generation Publishing"],
	["14hHqvoSB5nC5aiSAhxvEcpyg6CiLAhru9", "17Tibq24ahAK71a5Ffqaf5RfQpWGb5Yovb"],
	[`${process.env.ADDRESS2}`]
);

// console.log("meta", meta.appID);

const asset = "./assets/canweagree.mp3";
const main = async (asset, meta) => {
	try {
		const bFile = await BFile.fromFilePath(asset, meta);
		// console.log(bFile);
		const txid = await publish(bFile, networks.MAINNET, purse2);
		console.log("Success Publishing media", txid);
		myReader(txid);
	} catch (error) {
		console.log(error);
	}
};

// main();
const myReader = async (txid) => {
	try {
		let response = await read(txid);
		let myMedia = {
			buff: response.buff,
			mime: response.mime,
			format: response.format,
			fileName: response.fileName,
			appID: response.appID,
		};
		let myMeta = JSON.parse(response.meta);
		//parsed meta gives our json object back
		console.log("Reading success!", myMedia);
		console.log("MyMeta", myMeta);
		//get more detailed
		console.log(
			txid,
			"authors and paymail",
			myMeta.authorArray,
			myMeta.authorPaymail
		);
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	myReader,
	main,
};
