const { Transaction, Script } = require("bsv");
const fs = require("fs");
const path = require("path");
const { detectMimeType } = require("./detect-mime-type");
const { NullLogger } = require("./logging/null-logger");
const bsv = require("bsv");

class BFile {
	constructor(buffer, mime, format = "binary", fileName = "", appID, meta) {
		this.buff = buffer;
		this.mime = mime;
		this.format = format;
		this.fileName = fileName;
		this.appID = appID;
		this.meta = meta;
		this.DRMhash = bsv.crypto.Hash.sha256(Buffer.from(this.buff)).toString(
			"hex"
		);
	}

	toTxOutput() {
		return new Transaction.Output({
			satoshis: 0,
			script: Script.buildSafeDataOut([
				Buffer.from("19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut"),
				this.buff,
				Buffer.from(this.mime),
				Buffer.from(this.format),
				Buffer.from(this.fileName),
				Buffer.from(this.appID),
				Buffer.from(this.meta),
				Buffer.from(this.DRMhash),
			]),
		});
	}

	static async fromFilePath(filePath, meta, logger = new NullLogger()) {
		console.log(meta);
		let fileBuffer;
		try {
			fileBuffer = fs.readFileSync(filePath);
		} catch (e) {
			logger.fatal(`Cannot open specified route: ${filePath}`);
			process.exit(1);
		}
		let appID = meta.appID;
		meta = JSON.stringify(meta);
		const fileName = path.basename(filePath);
		const mime = await detectMimeType(fileBuffer);
		// console.log("mime", mime);
		// console.log(fileBuffer);
		logger.info(`File resolved. Name: ${fileName} Mime type: ${mime}`);
		return new this(fileBuffer, mime, "binary", fileName, appID, meta);
	}
}

module.exports = { BFile };
