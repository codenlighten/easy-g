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
	let appID = "1CX54YFZcLSGzoUJHjAXNkTFh3WJRhSyH1";
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
	let reader = new FileReader();
	// reader.readAsDataURL(file);
	reader.readAsArrayBuffer(file);
	reader.onload = function () {
		let result = reader.result;
		console.log(result);
	};
	reader.onerror = function () {
		console.log(reader.error);
	};
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

	// let response = fetch(`${meta}`);
	// let res = await response;
	// let r = await res.json();
	// let p = JSON.parse(r);
	// console.log("p", p);
	// console.log({ r });
	// document.getElementById(
	// 	"results"
	// ).innerHTML = `<h4>${r.workTitle}</h4><br/><h4>${r.authorArray}</h4><br/><h4>${r.authorPaymail}</h4><br/><h4>${r.publishers}</h4><br/><h4>${r.publishersPaymail}</h4><br/>`;
};

