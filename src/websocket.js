const Centrifuge = require("centrifuge");
const WebSocket = require("ws");

function connect() {
	// Subscribe to multiple channels
	const ws = new WebSocket(
		"wss://socket.whatsonchain.com/websocket?channels=woc:mempoolTx"
	);
	ws.onopen = function (e) {
		numFailures = 0;
		console.log("websocket: connection open", e);
		// This is required to trigger connect on server side.
		ws.send(JSON.stringify({}));
	};

	ws.onerror = function (e) {
		numFailures++;
		console.log("websocket: connection error: ", e);
	};

	ws.onclose = function (e) {
		if (!reconnect) {
			return;
		}
		setTimeout(function () {
			console.log("websocket: connection reconnecting");
			connect();
		}, Math.min(numFailures * 1000, 20000));
	};

	ws.onmessage = function (e) {
		console.log("websocket: new message");
		processData(e.data);
	};
}

connect();

function processData(rawData) {
	if (rawData.length === 0) {
		console.log("--> ping");
		return;
	}
	// console.log("--> " + rawData);
	const data = JSON.parse(rawData);
	const dataKeys = data.data;
	// console.log("dk", dataKeys.data);
	let protocol = "1CX54YFZcLSGzoUJHjAXNkTFh3WJRhSyH1";
	let protoHex = Buffer.from(protocol).toString("hex");
	console.log(protoHex);
	let chainHex = Object.values(dataKeys)[0].hex;
	let found = chainHex ? chainHex.includes(protoHex) : "";
	console.log(found ? chainHex : "nothing yet");

	const pushType = data.type || 0;
	switch (pushType) {
		case 0:
			let myData = JSON.stringify(data.data);
			// console.log(
			// 	"new data from a channel " +
			// 		data.channel +
			// 		": " +
			// 		JSON.stringify(data.data)
			// );

			break;
		case 6:
			clientID = data.data.client;
			let subscriptions = [];
			const subs = data.data.subs;
			if (subs) {
				for (const m in subs) {
					if (subs.hasOwnProperty(m)) {
						subscriptions.push(m);
					}
				}
			}
			console.log(
				"connected with client ID " +
					clientID +
					" and subscriptions: " +
					JSON.stringify(subscriptions)
			);
			break;
		case 7:
			clientID = null;
			if (!data.data.reconnect) {
				reconnect = false;
				ws.close();
				console.log("disconnected from a server, won't reconnect");
			} else {
				console.log("disconnected from a server, will reconnect");
			}
			break;
		case 3:
			console.log("unsubscribed from a channel " + data.channel);
			break;
		case 5:
			console.log("subscribed to a channel " + data.channel);
			break;
		default:
			console.log("unsupported push type " + data.type);
	}
}
