var APIKey = '';

submitAPIKey.addEventListener("click", async () => {
	APIKey = document.getElementById("APIKey").value;
	
	CheckAPIKey();
});

function CheckAPIKey() {
	fetch('https://api.wanikani.com/v2/assignments', GetAPIHeader()).then(r => r.json()).then(result => {
		if(result['code'] != 401)
			{
				chrome.storage.local.set({'APIKey': APIKey});
			}
		else
		{
			chrome.storage.local.set({'APIKey': ''});
			ShowWarning();
		}
	});
}

function GetAPIHeader() {
	return {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + APIKey
		}
	}
}

function ShowWarning() {
	warning.style.display = 'block';
	
	setTimeout(function() {
		warning.style.display = 'none';
	}, 3000);
}