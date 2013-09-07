var key = "refocus_bookmarks";
var console = chrome.extension.getBackgroundPage().console;

/*
links are stored the following:
<url> <title>\t<url> <title>\t...
*/
/*
TODO: implement the parseStr method, store titles of webpages
*/
//chrome.storage.sync.clear();
function parseJSON(data){
  if (!data) return [];
  var json = JSON.parse(data);
  return json;
}

function toJSON(linkArr) {
  var json = [];
  linkArr.forEach(function(o) {
    json.push({ "url": o.url, "title": o.title });
  });
  return JSON.stringify(json);
}

function linkExists(linkArr, link){
  for(var i = 0; i < linkArr.length; i++){
  		var o = linkArr[i];
    	if (o.url == link.url)  return true;
  }
  return false;
}

function removeLink(linkArr, link){
	for(var i = 0; i < linkArr.length; i++) {
		if(linkArr[i].url == link.url) linkArr.splice(i, 1);
	}
}

function storeLinkStr(linkStr){
  var newObj = {};
  newObj[key] = linkStr;
	chrome.storage.sync.set(newObj, function() {});
}

function updateList(linkArr){
	$("ul").empty();
  linkArr.forEach(function(o) {
		$("ul").append("<li>" + o.title + "<span>" + o.url +
        "</span><a href='#' data-url='" + o.url + "' class='remove'>X</a></li>");
  });
}

$(document).ready(function(){
	var curTab = {};
	var linkArr = [];
	var stat = $("#status");

	function toggleButtons() {
		if (linkExists(linkArr, curTab)) {
			$("#add").hide();
			$("#remove").show();
		} else {
			$("#add").show();
			$("#remove").hide();
		}
	}

	chrome.tabs.getSelected(function(tab){
		//check if already in storage
		curTab = {
			url: tab.url,
			title: tab.title
		};

		chrome.storage.sync.get(key, function(data) {
			linkArr = parseJSON(data[key]);
      // console.log(key, data);
      // console.log(linkArr);
			toggleButtons();
			updateList(linkArr);
		});
	});

	$("#add").on("click", function(e) {
		$(this).hide();
		e.preventDefault();
		//check if bookmark exists
		//add link
		if (!linkExists(linkArr, curTab)) {
      // console.log(linkArr, curTab);
			linkArr.push(curTab);
			stat.html("Page bookmarked");
		} else {
			//already there
			stat.html("Bookmark already exists");
		}
		storeLinkStr(toJSON(linkArr));
		$("#remove").show();
		updateList(linkArr);
	});

	$("#remove").click(function(e){
		$(this).hide();
		$("#add").show();
		e.preventDefault();
		removeLink(linkArr, curTab);
		stat.html("Bookmark removed");
		storeLinkStr(toJSON(linkArr));
		updateList(linkArr);
	}).show();

	$("body").delegate(".remove", "click", function(e){
		console.log("DELETED");
		removeLink(linkArr, {url: $(this).attr("data-url")});
		updateList(linkArr);
		storeLinkStr(toJSON(linkArr));
		toggleButtons();
	});
});

