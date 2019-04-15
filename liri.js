var env = require("dotenv").config()
var keys = require("./keys.js")
var spotify = require("node-spotify-api")
var moment = require("moment")
var axios = require("axios");
var spotify = new spotify(keys.spotify)
var fs = require("fs")

// console.log(moment());

switch(process.argv[2]){
    case "concert-this":
        concert(process.argv[3])
        break;
    case "spotify-this-song":
        spotReq(process.argv[3])
        break;
    case `movie-this`:
        movieReq(process.argv[3])
        break;
    case `do-what-it-says`:
        what()
        console.log("what it says")
        break;
    default:
        console.log("I cannot")
}

//do what it says function for random text
function what(thing){
    fs.readFile("random.txt", "utf8", function(err,data){
        if(err){
            return err
        }
        console.log(data)
        stuff = data.split(",")
        console.log(stuff)
        switch(stuff[0]){
            case "concert-this":
                concert(stuff[1])
                break;
            case "spotify-this-song":
                spotReq(stuff[1])
                break;
            case `movie-this`:
                movieReq(stuff[1])
                break;
            case `do-what-it-says`:
                what()
            default:
                console.log("I cannot")
        }
    })
}


// spotify search function
function spotReq(song){
    // searches for songs
    spotify.search({ type: 'track', query: song }, function(err, res) {
        
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // loop through 3 times to give 3 seperate results
        for(i=0;i<3;i++){
            // song info
            console.log("==================================================")
            console.log(`Title: ${res.tracks.items[i].name}`);
            console.log(`Artist: ${res.tracks.items[i].artists[0].name}`);  
            console.log(`Album: ${res.tracks.items[i].album.name}`); 
            console.log(`Preview: ${res.tracks.items[i].preview_url}`)
        }
    });
}


//movie request function 
function movieReq(movie){
    var omdbkey = "c08ce926"
    axios.get(`http://www.omdbapi.com/?apikey=${omdbkey}&t=${movie}`)
    .then(function(res){
        // console.log(res.data)
        if(res.data.Response == "False"){
            movieReq("mr.nobody")
            return
        }
        console.log(`Title: ${res.data.Title}`)
        console.log(`Year: ${res.data.Year}`)
        console.log(`Rating: ${res.data.Rated}`)
        console.log(`Rotten Tomatoes: ${res.data.Ratings[1].Value}`)
        console.log(`Country: ${res.data.Country}`)
        console.log(`Language: ${res.data.Language}`)
        console.log(`Plot: ${res.data.Plot}`)
        console.log(`Actors: ${res.data.Actors}`)
    })
}


//concert this function

function concert(artist){

    axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`)
    .then(function(res){
        for(i=0; i < 10;i++){
            console.log("==================================================")
            console.log(`Venue: ${res.data[i].venue.name}`)
            console.log(`City: ${res.data[i].venue.city}`)
            console.log(`Date: ${moment(res.data[i].datetime).format("MM/DD/YYYY")}`)
        }
    })
}