require("dotenv").config();
const { main, myReader } = require("./app");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
app.use(cors());
app.use(express.static("public"));
app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "public", "index.html"));
});
app.get("/app", (req, res) => {
	console.log(req.body);
	res.send(myReader(`${req.body}`));
});
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`listening on Port ${port}`);
});
