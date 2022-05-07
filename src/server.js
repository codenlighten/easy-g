require("dotenv").config();
const { main, myReader } = require("./app");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
app.use(cors());
app.use(express.static("public"));
app.get("*", async (req, res) => {
	// let myValues2 = req.params;
	// console.log(myValues2);
	let myValues = Object.entries(req.params)[0][1];
	myValues = myValues.replace("/", "");
	let p = JSON.parse(myValues);

	res.send(p);
	let m = await main("", p);
	console.log(m);
	// getTxInfo(myValues);

	// res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.post("/", async (req, res) => {
	let myValues = await req.body;
	console.log(myValues);
	res.send(myValues);
});
// const writeTX = async (my) => {
// 	await );
// };
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
