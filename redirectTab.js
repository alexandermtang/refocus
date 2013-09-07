var key = "refocus_bookmarks";//storage key
var console = chrome.extension.getBackgroundPage().console;
var badsite_count = 0;
var search_time_now;

function update_bad_count(badSites,search_time,startIndex, cb)
{
	if(startIndex==badSites.length){
		return;
	}
	chrome.history.search({
		text: badSites[startIndex].url,
		startTime: search_time
	},
	function(items){
		for(var i = 0; i < items.length; i++){
			chrome.history.getVisits(
				{
				url:items[i]['url'],
				},
				function(histItems)
				{
					console.log(histItems);
					for(var j=0; j<histItems.length; j++)
					{
						if(histItems[j].visitTime > search_time){
							badsite_count++;
						}
					}
					console.log(badsite_count + " : " + badSites[startIndex].url);
					startIndex+=1;
					update_bad_count(badSites,search_time, startIndex, cb);
					if(startIndex==items.length)
					{
						console.log("current bad site count " + badsite_count);
						cb.call(null, badsite_count);	
					}
				}
			);	
		}
	});
	
	
}

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
			//do random based on how many bad sites in last hour
			var site_key = "refocus_websites";
			chrome.storage.sync.get(site_key, function(data){
				if(data[site_key]){
					var sites = JSON.parse(data[site_key]);
					//get bad count
					var d = new Date();
					badsite_count = 0;
					search_time_now = d.getTime() - 3600000;//one hour ago
					//search_time_now = 0;//testing
					update_bad_count(sites,search_time_now,0, function(num_badsites){
						//badsite_count is now correct
						var prob = Math.atan(num_badsites/20)/(Math.PI/2);
						console.log("Bad sites: " + num_badsites + " - prob: " + prob);
						var rand = Math.random();
						if(rand < prob){
							console.log(rand + " TRUE");
							var randIndex = Math.floor(Math.random() * linkArr.length);
							chrome.tabs.update(tab.id, {url: linkArr[randIndex].url});
						}
					});
				}
			})
			
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
