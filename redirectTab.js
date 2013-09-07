var key = "refocus_bookmarks";//storage key
var console = chrome.extension.getBackgroundPage().console;

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
});
