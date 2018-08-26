const express = require('express'),
      router  = express.Router();

const Artist = require('../models/artist'),
      Cart   = require('../models/cart');

router.get('/:id', (req, res) => {
    const songId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {}); // send if cart already exists within the session 
    Artist.findById(songId, (err, song) => {
        encodeURIComponent(song.artistName); // imp
        if(err) {
            res.redirect('/'); // http://localhost:3000/?name=John+Mayer
        }
       cart.add(song, songId);
       req.session.cart = cart ; // save cart session
       res.redirect('/?name=' + song.artistName); // http://localhost:3000/?name=John+Mayer

    }); 
});

module.exports = router;
