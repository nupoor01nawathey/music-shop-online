const request  = require('request'),
      Artist   = require('../../models/artist'),
      mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/musicshopdata' , {useNewUrlParser: true });

function getArtistData(name) {
    let url = 'https://itunes.apple.com/search?term=' + name + '&lang=en_us&limit=5'
    
    request({
        url: url,
        json: true
      }, (error, response, body) => {
         // const allSongs = (JSON.stringify(body.results, undefined, 2));
         const allSongs = body.results;
        
         // console.log(allSongs[0] );
         // var nupoor = allSongs[0];
         // console.log(nupoor);
         var done = 0;
         for(var i=0 ; i < allSongs.length ; i++) {
            // console.log(allSongs[i] );
            var oneSong = allSongs[i];
            var Song = new Artist(oneSong);
            Song.save(function(err, result) {
                done++;
                console.log(`Adding data for ${done}`);
                if(done === allSongs.length) {
                  console.log('Done adding data to db');
                  exit(); 
                }
           });
         }
    });
}

function exit() {
    mongoose.disconnect();
}

module.exports = getArtistData;
