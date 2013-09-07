var key = "refocus_bookmarks";//storage key
//just copied and pasted, I'm sure we can split this up
function parseJSON(data){
  if (!data) return [];
  var json = JSON.parse(data);
  return json;
}
//when user opens new tab, based on recent history,
//chance of opening a page on their 'to-read' list
chrome.tabs.onCreated.addListener(function(tab) {
	//TODO: implement looking at history
	if(tab.url == "chrome://newtab/"){
		//get random link from todo list
		chrome.storage.sync.get(key, function(data){
			var linkArr = parseJSON(data[key]);
			if(linkArr.length == 0){
				return;//no links to use
			}
			var rand = Math.floor(Math.random() * linkArr.length);
			if(Math.floor(Math.random() * 2) == 0){//just for testing, 1/2 chance of showing
				chrome.tabs.update(tab.id, {url: linkArr[rand].url});
			}
		});
	}
});


//check if local storage has the websites or not
var site_key = "refocus_websites";
var console = chrome.extension.getBackgroundPage().console;

chrome.storage.sync.get(site_key, function(data){
	var websites = parseJSON(data[site_key]);
	if(websites.length == 0){
		//do the default websites
		websites.push({url: "facebook.com", title: "Facebook"});
		websites.push({url: "reddit.com", title: "Reddit"});
		websites.push({url: "youtube.com", title: "Youtube"});
		var newObj = {};
		newObj[site_key] = JSON.stringify(websites);
		chrome.storage.sync.set(newObj);
	}

});
