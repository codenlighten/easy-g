require("dotenv").config();
const { main, myReader } = require("./src/app");
const express = require("express");
var fileupload = require("express-fileupload");
require("dotenv").config();
const app = express();
// const cors = require("cors");
app.use(fileupload());
// app.use(express.static(__dirname + "/public"));
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, Content-Type");
	next();
});
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb", extended: true }));
app.post("/mint", async (req, res) => {
	let media = req.files;
	let body = req.body;
	console.log(body.fileName);

	let meta = JSON.parse(body.meta);
	console.log(body.meta);

	let fileName = body.fileName || media.asset.name;
	let buf = media.asset.data;
	// console.log(media);
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
// app.get("/app", (req, res) => {
// 	console.log(req.params);
// });
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`listening on Port ${port}`);
});
