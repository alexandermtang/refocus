console.log("i am here");

chrome.history.search({text:'',startTime:0, maxResults:0}, function(histItems) { 
	//var fish = histItems[0]["url"];
	for(var i=0; i<histItems.length; i++)
		console.log(histItems[i]["title"]);
	
});
