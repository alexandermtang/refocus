$(function(){
	var site_key = "refocus_websites";
	var ta = $("textarea");
	var fb = $("#feedback").hide();
	var fbTimer = null;
	chrome.storage.sync.get(site_key, function(data){
		var websites = [];
		if(data[site_key]){
			websites = JSON.parse(data[site_key]);
		}
		for(var i = 0; i < websites.length; i++){
			if(i > 0){
				ta.val(ta.val() + "\n");
			}
			ta.val(ta.val() + websites[i].url);
		}
	});
	$("button").on("click", function(){
		var website_data = ta.val().split("\n");
		var obj = [];
		for(var i = 0; i < website_data.length; i++){
			obj.push({url: website_data[i], title: ""});
		}
		var newObj = {};
		newObj[site_key] = JSON.stringify(obj);
		chrome.storage.sync.set(newObj);

		fbTimer = window.clearTimeout(fbTimer);
		fb.html("Options updated!").fadeIn();
		fbTimer = window.setTimeout(function(){fb.fadeOut();}, 5000);

	});
});