//dummy array, this array will be provided by kevin
var testSite = ["onet","yahoo"];

//time an hour ago
var d = new Date();
var search_time_now = d.getTime() - 3600000;
var badsite_count =0;
update_bad_count(testSite,search_time_now,0);

//loop through the provided array
/*
for(var i = 0; i<testSite.length; i++)
{	
	chrome.history.search(
		{text:testSite[i],//bad site from array
		startTime:search_time} , //time to look back in history
	function(histItems) {
	
	//loop through the results given by chrome.history API
	 for(var j =0; j<histItems.length; j++) 
	 {

	 	//increase bad site count
		badsite_count +=histItems[j]["visitCount"];
		console.log(badsite_count+" here1");
	 }
	console.log(badsite_count+" here2");
	});
	console.log(badsite_count+" here3");
}*/
function update_bad_count(badSites,search_time,startIndex)
{
	console.log(badSites,startIndex);
	if(startIndex==badSites.length)
		return ;
	chrome.history.search(
			{
			text:badSites[startIndex],
		
			startTime:0/*search_time*/},//REMEMBER TO CHANGE IT TO SEARCH TIME FOR RELEASE
			function(histItems)
			{
				console.log(histItems);
				for(var j=0; j<histItems.length; j++)
				{
					badsite_count += histItems[j]["visitCount"];
					console.log(badsite_count);
				}
				
				startIndex+=1;
				update_bad_count(badSites,search_time, startIndex);
				if(startIndex==badSites.length)
				{
					//Hey kevin, this is where youll get the total count of bad sites
					console.log("current bad site count "+badsite_count);			
				}
			}
	);
	
}

