require("dotenv").config();
const { main, myReader } = require("./app");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
app.use(cors());
app.use(express.static("public"));
app.get("*", (req, res) => {
	let myValues = Object.values(req.params)[0];
	myValues = myValues.replace("/", "");
	console.log(myValues);
	getTxInfo(myValues);

	res.sendFile(path.resolve(__dirname, "public", "index.html"));
});
const getTxInfo = async (x) => {
	let myTx = await myReader(x);

	return myTx;
};
app.get("/app", (req, res) => {
	console.log(req.params);
});
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`listening on Port ${port}`);
});
