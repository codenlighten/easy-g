require("dotenv").config();
const { main, myReader } = require("./src/app");
const express = require("express");
var fileupload = require("express-fileupload");
require("dotenv").config();
const app = express();
app.use(fileupload());
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "https://raregeneration.com");
	res.header("Access-Control-Allow-Headers", "Origin, Content-Type");
	next();
});
app.use(express.urlencoded({ limit: "100000kb", extended: true }));
app.use(express.json({ limit: "100000kb", extended: true }));
app.get("/tx", async (req, res) => {
	let tx = req.query;
	console.log(tx);
	let myTx = await getTxInfo(tx.txid);
	console.log(myTx);
	res.send(myTx);
});
app.post("/mint", async (req, res) => {
	// let media = req.files;

	// console.log(media);
	let body = req.body;
	console.log(body);

	let meta = JSON.parse(body.meta);
	let buf = body.asset;
	console.log("buf", buf);

	let fileName = body.fileName || buf.name;

	buf = Buffer.from(buf, "base64");

	let myName = body.fileName || fileName;
	// console.log(meta, myName, media);
	const nft = await main(myName, buf, meta);

	console.log("nft", nft);
	res.send(JSON.stringify(nft));
});

const getTxInfo = async (x) => {
	let myTx = await myReader(x);

	return myTx;
};

const port = process.env.PORT;

app.listen(port, (err) => {
	console.log(`listening on Port ${port}`);
	console.log(err);
});
