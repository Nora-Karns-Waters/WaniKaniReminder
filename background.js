var APIKey = '';
var isValidAPIKey = false;

chrome.runtime.onInstalled.addListener(() => {
	GetReviewCount();
	chrome.alarms.get('periodic', a => {
		if (!a) chrome.alarms.create('periodic', {periodInMinutes: 1.0});
	});
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
	if(changes['APIKey'])
	{
		isValidAPIKey = false;
		GetReviewCount();
	}
});

chrome.alarms.onAlarm.addListener(() => {
	GetReviewCount();
});

chrome.action.onClicked.addListener(async () => {
	if(isValidAPIKey)
		await chrome.tabs.create({'url': "https://www.wanikani.com", 'selected': true});
	
	else
		chrome.windows.create({url: "options.html", type: "popup", width: 250, height: 250});
});

function GetReviewCount() {
	
	if(isValidAPIKey)
	{
		fetch('https://api.wanikani.com/v2/assignments?immediately_available_for_review', GetAPIHeader()).then(r => r.json()).then(result => {
			count = result.total_count;
	
			if(count > 0)
			{
				chrome.action.setBadgeBackgroundColor({color: [255, 0, 0, 128]});
				chrome.action.setBadgeText({text: count.toString()});
			}
			else
			{
				chrome.action.setBadgeText({text: ''});
			}
		});
	}
	else
	{
		chrome.action.setBadgeText({text: ''});
		CheckAPIKey();
	}
}

function CheckAPIKey() {
	chrome.storage.local.get(['APIKey'], function(result) {
		APIKey = result['APIKey'].toString();
		if(APIKey.length > 0)
		{				
			fetch('https://api.wanikani.com/v2/assignments', GetAPIHeader()).then(r => r.json()).then(result => {
				if(result['code'] != 401)
				{
					isValidAPIKey = true;
					GetReviewCount();
				}
				else
					isValidAPIKey = false;
			});
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