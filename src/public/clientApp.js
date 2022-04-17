const handleClick = () => {
	fetch(`/app?${document.getElementById("txid").value}`);
};
