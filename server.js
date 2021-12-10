// Load the modules
var express = require('express'); //Express - a web application framework that provides useful utility functions like 'http'
var app = express();
var pgp = require('pg-promise')(/*options*/);
var bodyParser = require('body-parser'); // Body-parser -- a library that provides functions for parsing incoming requests
app.use(bodyParser.json());              // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies
const axios = require('axios');
const qs = require('query-string');
module.exports = app;

const db_config = {
  host: 'db',
  port: 5432,
  database: 'artist_db',
  user: 'postgres',
  password: 'pwd'
};

var db = pgp(db_config);


// Set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));// Set the relative path; makes accessing the resource directory easier


// Home page - DON'T CHANGE
app.get('/', function(req, res) {
  res.render('pages/home', {
    my_title: "Home",
    items: '',
    error: false,
    message: ''
  });
});

//to request data from API for given search criteria
//TODO: You need to edit the code for this route to search for movie reviews and return them to the front-end
app.post('/get_feed', function(req, res) {
  var userSearch = req.body.artistSearch; //TODO: Remove null and fetch the param (e.g, req.body.param_name); Check the NYTimes_home.ejs file or console.log("request parameters: ", req) to determine the parameter names
  var api_key = '2'; // TOOD: Remove null and replace with your API key you received at the setup
  if(userSearch) {
    axios({
      url: `https://www.theaudiodb.com/api/v1/json/${api_key}/search.php?s=${userSearch}`,
        method: 'GET',
        dataType:'json',
      })
        .then(items => {
          // TODO: Return the reviews to the front-end (e.g., res.render(...);); Try printing 'items' to the console to see what the GET request to the Twitter API returned.
          // Did console.log(items) return anything useful? How about console.log(items.data.results)?
          // Stuck? Look at the '/' route above
          console.log(items);
          console.log(items.data.artists);
          console.log("Name:", items.data.artists[0].strArtist);
          console.log("Website:", items.data.artists[0].strWebsite);
          console.log("Bio:", items.data.artists[0].strBiographyEN);
          console.log("Banner:", items.data.artists[0].strArtistBanner);
          console.log("Year Formed:", items.data.artists[0].intFormedYear);

            var name = items.data.artists[0].strArtist;
            var website = items.data.artists[0].strWebsite;
            var bio = items.data.artists[0].strBiographyEN;
            var banner = items.data.artists[0].strArtistBanner;
            var year = items.data.artists[0].intFormedYear;
            var genre = items.data.artists[0].strGenre;

          res.render('pages/home',{
            my_title: "Artist Profile",
            items: items,
                artistName:name,
                artistWebsite: website,
                artistBio: bio,
                artistBanner: banner,
                artistYear: year,
                artistGenre: genre,
            error: false,
            message: 'Here is some info about the artist'
          })
        })
        .catch(error => {
          res.render('pages/home',{
            my_title: "Artist Info",
            items: '',
            error: true,
            message: 'Error'
          })

        });


  }
  else {
    res.render('pages/home',{
      my_title: "Artist Info",
      items: '',
      error: true,
      message: 'Error'
    })
    // TODO: Render the home page and include an error message (e.g., res.render(...);); Why was there an error? When does this code get executed? Look at the if statement above
    // Stuck? On the web page, try submitting a search query without a search term
  }
});

app.post('/addReview', function(req,res) {
  var artist = req.body.reviewSaveButton;
  var insertReview = `INSERT INTO artistReviews(id, artist_name, review, review_date) VALUES (${req.body.id}, ${req.body.artist_name}, ${req.body.userReview}, ${req.body.review_date});`;
 // var insertReview = "INSERT INTO artistReviews(id, artist_name, review, review_date) VALUES (1, 'drake', 'he good', '8/27/2002');";
  var searchReview = "SELECT * FROM artistReviews;";
    db.task('get-everything', task => {
      return task.batch([
        task.any(insertReview),
        task.any(searchReview)
      ]);      
    })
});
app.get('/searchReviews', function(req,res) {
  //var artist = req.body.reviewSaveButton;
  //var insertReview = `INSERT INTO artistReviews(id, artist_name, review, review_date) VALUES (${req.body.id}, ${req.body.artist_name}, ${req.body.userReview}, ${req.body.review_date});`;
 // var insertReview = "INSERT INTO artistReviews(id, artist_name, review, review_date) VALUES (1, 'drake', 'he good', '8/27/2002');";
  var searchReview = "SELECT * FROM artistReviews;";
    db.task('get-everything', task => {
      return task.batch([
        //task.any(insertReview),
        task.any(searchReview)
      ]);      
    })
});
app.listen(3000);
console.log('3000 is the magic port');