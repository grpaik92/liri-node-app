var keys = require('./keys.js')
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs";)
var spotify = new Spotify({
	id: keys.spotifyKeys.client_id,
	secret: keys.spotifyKeys.client_secret
})

var writeToLog = function(data) {
	//fs.appendFile("log.txt", "\r\n\r\n");
	fs.appendFile("log.txt", JSON.stringify(data), function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("log.txt was updated");
	});
};

var getArtistName = function(artist) {
	return artist.name;
};

var retrieveSpotify = function(songName) {
	if (songName === undefined) {
		songName = "New Freezer"
	}

	spotify.search({type: "track", query: songName}, function(err, data) {
		if (err) {
			console.log("Error occured: " + err);
		}

		var data = [];
		var songs = data.tracks.items;

		for (var i=0; i <songs.length; i++) {
			data.push({
				"artist(s):": songs[i].artists.map(getArtistName),
				"song name: ": songs[i].name,
				"preview song: ": songs[i].preview_url,
				"album: ": songs[i].album.name
			});
		}
		console.log(data);
		writeToLog(data);
	});
};

var getTweets = function() {
	var client = new Twitter(keys);
	var params = {screen_name: "EBT_King"};
	client.get("statuses/user_timeline", params, function(error, tweets, response) {
    if (!error) {
      var data = [];

      for (var i = 0; i < tweets.length; i++) {
        data.push({
          created_at: tweets[i].created_at,
          text: tweets[i].text
        });
      }

      console.log(data);
      writeToLog(data);
    }
  });
};

var retrieveMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "Mr Nobody";
  }

  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=40e9cece";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var jsonData = JSON.parse(body);

      var data = {
        "Title:": jsonData.Title,
        "Year:": jsonData.Year,
        "Rated:": jsonData.Rated,
        "IMDB Rating:": jsonData.imdbRating,
        "Country:": jsonData.Country,
        "Language:": jsonData.Language,
        "Plot:": jsonData.Plot,
        "Actors:": jsonData.Actors,
        "Rotton Tomatoes URL:": jsonData.tomatoURL
      };

      console.log(data);
      writeToLog(data);
    }
  });
};

var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var dataArr = data.split(",");

    if (dataArr.length === 2) {
      pick(dataArr[0], dataArr[1]);
    }
    else if (dataArr.length === 1) {
      pick(dataArr[0]);
    }
  });
};

var pick = function(caseData, functionData) {
  switch (caseData) {
    case "my-tweets":
      getMyTweets();
      break;
    case "spotify-this-song":
      retrieveSpotify(functionData);
      break;
    case "movie-this":
      retrieveMovie(functionData);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("LIRI doesn't know that");
  }
};

var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);