var key = "refocus_bookmarks";
console = chrome.extension.getBackgroundPage().console;

/*
links are stored the following:
<url> <title>\t<url> <title>\t...
*/
/*
TODO: implement the parseStr method, store titles of webpages
*/
//chrome.storage.sync.clear();
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

function toStr(linkArr){
	var str = "";
	for(var i = 0; i < linkArr.length; i++){
		if(i > 0){
			str += "\t";
		}
		str += linkArr[i].url + " " + linkArr[i].title;
	}
	return str;
}

function linkExists(linkArr, link){
	for(var i = 0; i < linkArr.length; i++){
		if(linkArr[i].url == link.url){
			return true;
		}
	}
	return false;
}

function removeLink(linkArr, link){
	for(var i = 0; i < linkArr.length; i++){
		if(linkArr[i].url == link.url){
			linkArr.splice(i, 1);
		}
	}
}

function storeLinkStr(linkStr){
	console.log("STORING: " + linkStr);
	var newObj = {};
	newObj[key] = linkStr;
	chrome.storage.sync.set(newObj, function(){});
}

function updateList(linkArr){
	$("ul").empty();
	//console.log(linkStr + " : " );
	for(var i = 0; i < linkArr.length; i++){
		$("ul").append("<li>" + linkArr[i].title + "<a href='#' class='remove'>X</a></li>");
	}
}

$(document).ready(function(){
	var curTab = {};
	var linkArr = [];
	var stat = $("#status");
	chrome.tabs.getSelected(function(tab){
		//check if already in storage
		curTab = {
			url: tab.url,
			title: tab.title
		};

		chrome.storage.sync.get(key, function(data){
			console.log("1");
			console.log(data[key]);
			linkArr = parseStr(data[key]);
			console.log("2");
			if(linkExists(linkArr, curTab)){
				$("#add").hide();
				$("#remove").show();
			}
			else{
				$("#add").show();
				$("#remove").hide();
			}
			updateList(linkArr);
		});
	});

	$("#add").on("click", function(e){
		$(this).hide();
		e.preventDefault();
		//check if bookmark exists
		//add link
		if(!linkExists(linkArr, curTab)){
			linkArr.push(curTab);
			stat.html("Page bookmarked");
		}
		else{
			//already there
			stat.html("Bookmark already exists");
		}
		storeLinkStr(toStr(linkArr));
		$("#remove").show();
		updateList(linkArr);
	});
	$("#remove").click(function(e){
		$(this).hide();
		$("#add").show();
		e.preventDefault();
		removeLink(linkArr, curTab);
		stat.html("Bookmark removed");
		storeLinkStr(toStr(linkArr));
		updateList(linkArr);
	}).show();

	$(".remove").on(function(e){
		console.log("Removing...");
	})
	
});

