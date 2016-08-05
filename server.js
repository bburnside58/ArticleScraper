// dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var request = require('request'); // Snatches html from urls
var cheerio = require('cheerio'); // Scrapes our html
var bodyParser = require('body-parser');//I don't think I need body-parser for this app...


// configure our app for morgan and body parser
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));

// static file support with public folder
app.use(express.static('public'));

// mongojs configuration
var mongojs = require('mongojs');
var databaseUrl = "techNews";
var collections = ["articles"];

// hook our mongojs config to the db var
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});

//setting up handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//================================================
//Require the controller file
// require('./controllers/controller.js')(app);
//================================================


//One route to get from db one to post to db
//==================================ROUTES==================================
// Post to the mongo database and render handlebars
app.post('/submit', function(req, res){
	console.log("hello");
	var comments = req.body;
   console.log(req.body);
    db.articles.update({"myTitle": "Article 1"}, {$set: {"comment": comments}}, function(err, docs){
    	if (err) throw err;
    	console.log(docs);
    });

});

// find all comments
app.get('/comments', function(req, res) {
  // go into the mongo collection, and find all docs
  db.articles.find({}, function(err, found) {
    // show any errors
    // if (err) throw err;
    if (err) {
      console.log(err);
    } 
    // otherwise, send the json
    else {
      res.json(found);
      //found is the entire database
      // console.log(found);
    }
  });
});

app.get('/', function(req, res) {
//==================================CHEERIO==================================
	request('https://finance.yahoo.com/news/former-facebook-insider-why-felt-000000995.html', function (error, response, html) {

		// Load the html into cheerio and save it to a var.
	  	// '$' becomes a shorthand for cheerio's selector commands, 
	  	//  much like jQuery's '$'.
	  var $ = cheerio.load(html);
	  //console.log(html);
	  // an empty array to save the data that we'll scrape

	  // Select each instance of the html body that you want to scrape.
	  // NOTE: Cheerio selectors function similarly to jQuery's selectors, 
	  // but be sure to visit the package's npm page to see how it works.
	  //========================title data===========================================
	   $('html').each(function(i, element){
		    //console.log("This stuff is data " + $(this).text());
		    
		    var title = $(this).find('title').text();
		    var article = $(this).find('div.canvas-body').text();

		    var results = [];
		    results.push({
		    	myTitle: "Article 1",
		      	title: title,
		      	article: article
		    });
		    /*var anchor = $(this).find('a')
		    var title = anchor.text()
		    var link = anchor.attr('href')
		    */

	    	// Scrape information from the web page, put it in an object 
	    	// and add it to the result array. 
	  		//console.log(results);
		 	// // save the request body as an object called book
		  // 	var stuff = req.body;
		  // 	console.log(stuff);
		  	//defining each item in the collection cause hackers brah. They could edit the html in inspector and add data to the database.
		  	db.articles.insert(results, function(err, docs){
		    	if (err) throw err;
		    		//Need a find 
				db.articles.find({}, function(err, docs){
					if (err) throw err;
					// render the index page and pass the data to handlebars
					res.render('index',  {

						articles: docs

					}); // end res.render()
				});//End of find{}
		  	});//End of db.articles.update
	    });//End of .each
	});//End of Request
});//End of / route

// listen on port 8080
app.listen(8080, function() {
  console.log('App running on port 8080!');
});