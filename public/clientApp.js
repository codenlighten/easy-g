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
	console.log(meta);
	let reader = new FileReader();
	reader.readAsArrayBuffer(file);
	reader.onload = function () {
		// let myData = { fileName, meta };
		let formData = new FormData();
		formData.append("asset", file);
		formData.append("fileName", fileName);
		formData.append("meta", meta);
		axios({
			method: "post",
			url: "/mint",
			data: formData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	reader.onerror = function () {
		console.log(reader.error);
	};
};
