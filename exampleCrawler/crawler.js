/* Libraries */
var request = require('request');	//make HTML requests
var cheerio = require('cheerio'); 	//parse HTML elements
var URL = require('url-parse');		//parse URL

/* Fetching and parsing a web page in Javascript */
var pageToVisit = "52.89.243.4";
console.log("Visiting page " + pageToVisit);
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
};



