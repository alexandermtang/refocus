var key = "refocus_bookmarks";//storage key

//when user opens new tab, based on recent history, chance of opening a page on their 'to-read' list
chrome.tabs.onCreated.addListener(function(tab) {
	//TODO: implement looking at history

	//get random link from todo list
	chrome.storage.sync.get(key, function(data){
		var linkStr = data[key];
		if(!linkStr || linkStr.length == 0){
			return;//no links to use
		}
		var allBookmarks = linkStr.split(" ");
		var rand = Math.floor(Math.random() * allBookmarks.length);
		if(Math.floor(Math.random() * 2) == 0){//just for testing, 1/2 chance of showing
			chrome.tabs.update(tab.id, {url: allBookmarks[rand]});
			console.log("HERE");
		}
	});

	
});