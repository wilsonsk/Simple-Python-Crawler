/* START: Libraries */
var request = require('request');	//make HTML requests
var cheerio = require('cheerio'); 	//parse HTML elements
var URL = require('url-parse');		//parse URL
/* END: Libraries */


/* START: Fetching and parsing a web page in Javascript */
var pageToVisit = "http://52.89.243.4";
console.log("Visiting page " + pageToVisit);

//request to visit page, then execute a callback after we get response
request(pageToVisit, function(err, res, body){
	if(err){
		console.log("Error: " + err);
	}
	//Check status code
	console.log("Status code: " + res.statusCode);
	if(res.statusCode === 200){
		//status code is good- being parsing DOM
		var $ = cheerio.load(body);
		console.log("Page title: " + $('title').text());
	}
});
/* END: Fetching and parsing a web page in Javascript */


/* START: parse page to search for keyword */
//search function
function searchForWord($, word){
	var bodyText = $('html > body').text();
	// indexOf() returns the index within the calling string object of the first occurence of the specified value - returns -1 if value not found

	//use js function indexof to check for occurences of a substring in a given string - NOTE: indexof is case sensitive, so convert both the search word and the webpage to either lower or uppercase

	if(bodyText.toLowerCase().indexOf(word.toLowerCase()) !== -1){
		return true;
	}else{
		return false;
	}
}
/*END: parse page to search for keyword */


/* START: collecting links on a webpage in JS */
//there are two types of links- relative path and absolute paths
//relative paths wont ever lead us away from the domain we start on
//absolute paths can take us anywhere on the internet
//following code will collect relative and absolute hyperlinks

//collect links function
function collectInternalLinks($){
	var allRelativeLinks = [];
	var allAbsoluteLinks = [];

	//jquery- a tag with href starting with '/' for relative paths
	var relativeLinks = $("a[href^='/']");
	//jquery- .each() iterates over a jquery object, executing a function for each matched element
	relativeLinks.each(function(){
		allRelativeLinks.push($(this).attr('href'));
	});

	//jquery- a tag with href starting with 'http' for absolute paths
	absoluteLinks.each(function(){
		allAbsoluteLinks.push($(this).attr('href'));
	});	
	
	console.log("Found " + allRelativeLinks.length + " relative links");
	console.log("Found " + allAbsoluteLinks.length + " absolute links");
}
/* END: collecting links on a webpage in JS */
