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

// meta = Object.entries(meta);
const getBSVPrice = async () => {
	let response = axios
		.get(`https://api.whatsonchain.com/v1/bsv/main/exchangerate`)
		.then(function (res) {
			try {
				// console.log(res.data);
				let price = res.data.rate;
				price = Number(price).toFixed(2);
				document.getElementById(
					"price"
				).innerHTML = `Current BSV Price: $${price} ${res.data.currency}`;
			} catch (e) {
				throw new Error(e);
			}
		});
};
getBSVPrice();
let address = "18PWqG3qXdVbSs4mKmudMbpnVx6hMpAFmu";

const getBalance = async () => {
	let response = await axios
		.get(`https://api.whatsonchain.com/v1/bsv/main/address/${address}/balance`)
		.then(function (res) {
			try {
				// console.log(res.data);
				let confirmed = res.data.confirmed;
				let unconfirmed = res.data.unconfirmed;
				// confirmed = Number(confirmed).toFixed(9);
				document.getElementById(
					"balance"
				).innerHTML = `RareGeneration Address:${address}</br>Balance: ${confirmed} Satoshis</br>Unconfirmed: ${unconfirmed} Satoshis`;
			} catch (e) {
				throw new Error(e);
			}
		});
};
getBalance();
setInterval(() => {
	getBalance();
}, 15000);
const handleClick = async () => {
	let application = "raregeneration.com";
	let appID = "1HSq6J417PqxwXxAEWD3cdxDJVvkjELCHy";
	let workTitle = document.getElementById("workTitle").value;
	let authorArray = document.getElementById("authorArray").value;
	let authorPaymail = document.getElementById("authorPaymail").value;
	let publishers = [
		document.getElementById("publishers").value,
		"Rare Generation Publishing",
	];

	let publishersID = [
		document.getElementById("publishersID").value,
		"17Tibq24ahAK71a5Ffqaf5RfQpWGb5Yovb",
	];

	let publishersPaymail = [
		document.getElementById("publishersPaymail").value,
		"17Tibq24ahAK71a5Ffqaf5RfQpWGb5Yovb",
	];
	let file = document.getElementById("myFile");
	file = await file.files[0];
	let fileName = document.getElementById("fileName").value || file.name;
	let meta = new Meta(
		application,
		appID,
		workTitle,
		authorArray,
		authorPaymail,
		publishers,
		publishersID,
		publishersPaymail
	);
	meta = JSON.stringify(meta);
	// console.log(meta);
	let reader = new FileReader();
	reader.readAsArrayBuffer(file);
	let progressBar = document.getElementById("progress");

	reader.onload = function () {
		progress(progressBar);
		// let myData = { fileName, meta };
		let formData = new FormData();
		formData.append("asset", file);
		formData.append("fileName", fileName);
		formData.append("meta", meta);
		axios({
			method: "post",
			url: "http://localhost:5000/mint",
			data: formData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				let metaResponse = response.data.metaPublish;
				let txid = response.data.txid;
				let data = metaResponse.buff.data;
				data = arrayBufferToBase64(data);
				let url = `data:${metaResponse.mime};base64,${data}`;
				document.getElementById(
					"appID"
				).innerHTML = `AppID: ${metaResponse.appID}`;
				document.getElementById(
					"txid"
				).innerHTML = `TXID: <a target="_blank" href="https://whatsonchain.com/tx/${txid}">${txid}</a>`;
				document.getElementById(
					"fileName"
				).innerHTML = `Media: ${metaResponse.fileName}`;
				// console.log(metaResponse.mime);
				let mimeSplit = metaResponse.mime.split("/");
				mimeSplit = mimeSplit[0];
				// console.log(mimeSplit);
				if (metaResponse.mime.includes("image")) {
					document.getElementById("mediaContainer").style.display = "";
					document.getElementById("image").style.display = "";
					document.getElementById("image").src = url;
					// console.log("image found");
				} else if (metaResponse.mime.includes("audio")) {
					document.getElementById("mediaContainer").style.display = "";
					document.getElementById("audio").style.display = "";
					document.getElementById("audio").src = url;
					// console.log("audio found");
				} else if (metaResponse.mime.includes("video")) {
					document.getElementById("mediaContainer").style.display = "";
					document.getElementById("video").style.display = "";

					document.getElementById("video").src = url;
					// console.log("video found");
				}

				console.log("txid", txid, "metaResponse", metaResponse, "data", data);
				// console.log(response);
				progressBar.style.display = "none";
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	reader.onerror = function () {
		console.log(reader.error);
	};
};

const arrayBufferToBase64 = (buffer) => {
	var binary = "";
	var bytes = new Uint8Array(buffer);
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
};

const progress = (progressBar) => {
	progressBar.style.display = "";
	progressBar.innerHTML = `....processing`;
};

const getTXID = async () => {
	let progressBar = document.getElementById("progress");

	progress(progressBar);

	let txid = document.getElementById("txidSearch").value;
	let response = await axios
		.get(`http://localhost:5000/tx/`, { params: { txid } })
		.then(function (response) {
			console.log(response.data);

			let metaResponse = response.data.myMedia;
			// let txid = response.data.txid;
			let data = metaResponse.buff.data;
			data = arrayBufferToBase64(data);
			let url = `data:${metaResponse.mime};base64,${data}`;
			document.getElementById(
				"appID"
			).innerHTML = `AppID: ${metaResponse.appID}`;
			document.getElementById(
				"txid"
			).innerHTML = `TXID: <a target="_blank" href="https://whatsonchain.com/tx/${txid}">${txid}</a>`;
			document.getElementById(
				"fileName"
			).innerHTML = `Media: ${metaResponse.fileName}`;
			// console.log(metaResponse.mime);
			let mimeSplit = metaResponse.mime.split("/");
			mimeSplit = mimeSplit[0];
			// console.log(mimeSplit);
			if (metaResponse.mime.includes("image")) {
				document.getElementById("mediaContainer").style.display = "";
				document.getElementById("image").style.display = "";
				document.getElementById("image").src = url;
				// console.log("image found");
			} else if (metaResponse.mime.includes("audio")) {
				document.getElementById("mediaContainer").style.display = "";
				document.getElementById("audio").style.display = "";
				document.getElementById("audio").src = url;
				// console.log("audio found");
			} else if (metaResponse.mime.includes("video")) {
				document.getElementById("mediaContainer").style.display = "";
				document.getElementById("video").style.display = "";
				document.getElementById("video").src = url;
				// console.log("video found");
			}

			console.log("txid", txid, "metaResponse", metaResponse, "data", data);
			// console.log(response);
			progressBar.style.display = "none";
		})
		.catch(function (error) {
			console.log(error);
		});
	(function (res) {
		try {
			console.log(res);
		} catch (e) {
			throw new Error(e);
		}
	});
};
