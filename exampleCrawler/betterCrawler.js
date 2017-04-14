/* START: Libraries */
var request = require('request');	//make HTML requests
var cheerio = require('cheerio'); 	//parse HTML elements
var URL = require('url-parse');		//parse URL
var fs = require('fs');
/* END: Libraries */

/* USER CONSTANT VARIABLES */
var START_URL = "http://www.arstechnica.com";
var SEARCH_WORD = "stemming";
var MAX_PAGES_TO_VISIT = 10;


/* START: link storage */
//store pages visited in key value store 
var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
/* END: link storage */

/* URL initialization */
var url = new URL(START_URL);
var baseURL = url.protocol + "//" + url.hostname;

/* START: run webcrawler API */
pagesToVisit.push(START_URL);
crawl();
/* END: run webcrawler API */

/*** START: FUNCTIONS ***/
/* START: API to webcrawl- encapsulates remaining functions */
function crawl(){
	if(numPagesVisited >= MAX_PAGES_TO_VISIT){
		console.log("Reached max number of webpages to visit");
		return;
	}

	var nextPage = pagesToVisit.pop();
	if(nextPage in pagesVisited){
		//already visited this page- repeat crawl
		crawl();
	}else{
		visitPage(nextPage, crawl);
	}
}
/* END: API to webcrawl- encapsulates remaining functions */


/* START: visit webpage- parse and search, callback crawl() until SEARCH_WORD is found */
//callback in this case will be the crawl()
function visitPage(url, callback){
	//add webpage to set
	pagesVisited[url] = true;
	numPagesVisited++;


	//request to visit page, then execute a callback after we get response
	console.log("Visiting page: " + url);
	request(url, function(err, res, body){
		if(err){
			console.log("Error: " + err);
		}
		//Check status code
		console.log("Status code: " + res.statusCode);
		if(res.statusCode !== 200){
			callback();
			return;	
		}
		
		//status code is good- start parsing DOM
		var $ = cheerio.load(body);
		var isWordFound = searchForWord($, SEARCH_WORD);
		if(isWordFound){
			console.log('Word: ' + SEARCH_WORD + ' found at webpage: ' + url);
		}else{
			collectInternalLinks($);
			callback();
		}
	});
}
/* END: visit webpage- parse and search, callback crawl() until SEARCH_WORD is found */


/* START: parse page to search for keyword */
//search function
function searchForWord($, word){
	var bodyText = $('html > body').text();
	// indexOf() returns the index within the calling string object of the first occurence of the specified value - returns -1 if value not found

	//use js function indexof to check for occurences of a substring in a given string - NOTE: indexof is case sensitive, so convert both the search word and the webpage to either lower or uppercase

	return(bodyText.toLowerCase().indexOf(word.toLowerCase()) !== -1);
}
/*END: parse page to search for keyword */


/* START: collecting links on a webpage in JS */
//there are two types of links- relative path and absolute paths
//relative paths wont ever lead us away from the domain we start on
//absolute paths can take us anywhere on the internet
//following code will collect relative and absolute hyperlinks

//collect links function
function collectInternalLinks($){
	//var allRelativeLinks = [];
	//var allAbsoluteLinks = [];

	//jquery- a tag with href starting with '/' for relative paths
	var relativeLinks = $("a[href^='/']");
	//jquery- .each() iterates over a jquery object, executing a function for each matched element
	//console.log("Found " + allRelativeLinks.length + " relative links");
	console.log("Found " + relativeLinks.length + " relative links on webpage");
	relativeLinks.each(function(){
		pagesToVisit.push(baseURL + $(this).attr('href'));
		//console.log("link: " + $(this).attr('href'));
		fs.appendFileSync('webcrawlResults.txt', $(this).attr('href') + '\n');
	});


	/*
	//jquery- a tag with href starting with 'http' for absolute paths
	absoluteLinks.each(function(){
		allAbsoluteLinks.push($(this).attr('href'));
	});	
	*/	

	//console.log("Found " + allAbsoluteLinks.length + " absolute links");
}
/* END: collecting links on a webpage in JS */


/*** END FUNCTIONS ***/
