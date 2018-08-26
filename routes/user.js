const express   = require('express'),
      router    = express.Router(),
      passport  = require('passport');


const User   = require('../models/user');


router.get('/signup', (req, res) => {
    res.render('user/signup');
});

router.post('/signup', (req, res) => {
    const username = req.body.username,
          password = req.body.password;

    User.register(new User({username: username}), password, (err, user) => {
        if(err) {
            return res.render('user/signup');
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect('/user/signin');
        });
    });
});

router.get('/signin', (req, res) => {
   res.render('user/signin');
});

router.post('/signin', passport.authenticate("local", {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup'
}));

router.get('/signout', isLoggedIn, (req, res) => {
    req.session.cart = null;
    req.logout();
    res.redirect('/user/signin');
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('user/profile');
 });

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/user/signin");
}

module.exports = router;
