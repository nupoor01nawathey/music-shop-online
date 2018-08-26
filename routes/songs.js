const express = require('express'),
      router  = express.Router();

const Artist  = require('../models/artist');    

router.get('/', (req, res, next) => { 
    // Remove existing data for the input Artist 
    const artistName = String(req.query.name);
    // // seeder(artistName);
    Artist.find({ artistName: artistName})
    .select('_id trackName trackPrice collectionName currency previewUrl')
    .exec(function(err, artistSongs){
        if(err) {
            console.log(err);
        }
        res.render('common/songs', {
            artist: artistName,
            songs: artistSongs
        });
    });
});

module.exports = router;
