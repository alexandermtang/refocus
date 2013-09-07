var key = "refocus_bookmarks";

function linkExists(linkStr, link){
	var allBookmarks = linkStr.split(" ");
	for(var i = 0; i < allBookmarks.length; i++){
		if(allBookmarks[i] == link){
			return true;
		}
	}
	return false;
}
function removeLink(linkStr, link){
	var newStr = "";
	var allBookmarks = linkStr.split(" ");
	for(var i = 0; i < allBookmarks.length; i++){
		if(allBookmarks[i] == link){
			continue;
		}
		if(newStr != ""){
			newStr += " ";
		}
		newStr += allBookmarks[i];
	}
	return newStr;
}

function storeLinkStr(linkStr){
	var newObj = {};
	newObj[key] = linkStr;
	chrome.storage.sync.set(newObj, function(){});
}

$(document).ready(function(){
	var tabUrl = "";
	var linkStr = "";

	chrome.tabs.getSelected(function(tab){
		//check if already in storage
		tabUrl = tab.url;
		chrome.storage.sync.get(key, function(data){
			linkStr = data[key];
			if(!linkStr){
				linkStr = "";
			}
			if(linkExists(linkStr, tabUrl)){
				$("#add").hide();
				$("#remove").show();
			}
			else{
				$("#add").show();
				$("#remove").hide();
			}
		});
	});

	$("#add").on("click", function(e){
		$(this).hide();
		e.preventDefault();
		//check if bookmark exists
		var stat = $("#status");
		;
		console = chrome.extension.getBackgroundPage().console;
			
		var empty = false;
		var newValue = "";

		if(!linkStr || linkStr == ""){
			//linkStr empty
			empty = true;
			linkStr = "";
		}

		//add link
		if(!linkExists(linkStr, tabUrl)){
			if(linkStr != ""){
				linkStr += " ";
			}
			linkStr += tabUrl;
			stat.html("Page bookmarked");
		}
		else{
			//already there
			stat.html("Bookmark already exists");
		}

		storeLinkStr(linkStr);
		console.log(linkStr);
		$("#remove").show();
	});		
	$("#remove").click(function(e){
		$(this).hide();
		$("#add").show();
		e.preventDefault();
		linkStr = removeLink(linkStr, tabUrl);
		stat.html("Bookmark removed");
		storeLinkStr(linkStr);
		console.log(linkStr);
	}).show();
});

