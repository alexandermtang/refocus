var key = "refocus_bookmarks";//storage key
//just copied and pasted, I'm sure we can split this up
function parseStr(linkStr){
	var linkArr = [];
	if(!linkStr){
		return linkArr;
	}
	var allBookmarks = linkStr.split("\t");
	console.log(allBookmarks);
	for(var i = 0; i < allBookmarks.length; i++){
		var parts = allBookmarks[i].split(" ");
		linkArr.push({url: parts[0], title: parts[1]});
	}
	console.log(linkArr);
	return linkArr;
}

//when user opens new tab, based on recent history, chance of opening a page on their 'to-read' list
chrome.tabs.onCreated.addListener(function(tab) {
	//TODO: implement looking at history

	//get random link from todo list
	chrome.storage.sync.get(key, function(data){
		var linkArr = parseStr(data[key]);
		if(linkArr.length == 0){
			return;//no links to use
		}
		var rand = Math.floor(Math.random() * linkArr.length);
		if(Math.floor(Math.random() * 2) == 0){//just for testing, 1/2 chance of showing
			chrome.tabs.update(tab.id, {url: linkArr[rand].url});
		}
	});

	
});