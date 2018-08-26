const express = require('express'),
      router  = express.Router();

const Cart   = require('../models/cart');

router.get('/', (req, res) => {
    if(!req.session.cart) {
        return res.render('cart/shopping-cart', {songs: null});
    } 
    var cart = new Cart(req.session.cart);
    res.render('cart/shopping-cart', { 
        songs: cart.generateArray(),  
        totalPrice: cart.totalPrice 
    });
});

module.exports = router;
