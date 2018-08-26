const express = require('express'),
      router  = express.Router(),
      stripe  = require('stripe');

const Cart   = require('../models/cart'),
      Order  = require('../models/order');

router.get('/', isLoggedIn, (req, res) => {
    if(!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    const cart = new Cart(req.session.cart);
    const errMsg = req.flash('error')[0];
    res.render('cart/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
});

router.post('/', isLoggedIn, (req, res, next) => {  
    if(!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    const cart = new Cart(req.session.cart);

    // Set your secret key: remember to change this to your live secret key in production   
    var stripe = require("stripe")("YOUR_SECRET_KEY");

    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    const token = req.body.stripeToken; // Using Express
    const charge = stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: 'usd',
    description: 'Example charge 1',
    source: "tok_mastercard",
    }, (err, charge) => {
        console.log(`ORDER: ${charge}`);
        if(err) {
           req.flash('error', err.message);
           return res.redirect('/checkout'); 
        } 
        const order = new Order({
            user: req.user, // passport gives user 
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save((err, order) => {
            //console.log(`ORDER: ${order}`);
            if(err) {
                return res.redirect('/checkout'); // go back to checkout page
            }
            req.session.cart = null;
            res.redirect('/index');
        });
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/user/signin");
}

module.exports = router;
