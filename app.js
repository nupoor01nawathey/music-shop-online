// include pre-defined lib 
const express               = require('express'),
      bodyParser            = require('body-parser'),
      flash                 = require('connect-flash'),
      logger                = require('morgan'),
      expejs                = require('ejs'),
      path                  = require('path'),
      mongoose              = require('mongoose'),
      session               = require('express-session'),
      MongoStore            = require('connect-mongo')(session),
      cookieParser          = require('cookie-parser'),
      passport              = require('passport'),
      LocalStrategy         = require('passport-local'),
      PassportLocalMongoose = require('passport-local-mongoose'),
      isomorphic            = require('isomorphic-fetch');

// include custom lib
const seeder                = require('./public/js/seeder'),
      Artist                = require('./models/artist'),
      Cart                  = require("./models/cart");

// include routes
const indexRouter           = require('./routes/index')
      songsRouter           = require('./routes/songs'),
      addToCartRouter       = require('./routes/addToCart'),
      shoppingCartRouter    = require('./routes/shoppingCart'),
      checkoutRouter        = require('./routes/checkout');

// setup express app
const app =  express();

app.use(logger('dev'));


// mongoose conncection str
mongoose.connect('mongodb://localhost:27017/musicshopdata', { useNewUrlParser: true });

// setup body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// static folder setting
app.use(express.static(`${__dirname}/public`));

// session setup
app.use(cookieParser());
app.use(session({
    secret: "mySuperseCret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }), // use mongo connection for storing session
    cookie: { maxAge: 5 * 60 * 1000 } // session timeout after 5min * sec * millisec
}));

app.use(flash());

// middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
})


app.use('/index', indexRouter);
app.use('/', songsRouter);
app.use('/add-to-cart', addToCartRouter);
app.use('/shopping-cart', shoppingCartRouter);
app.use('/checkout', checkoutRouter);


app.get('/user/signup', (req, res) => {
    res.render('user/signup');
});

app.post('/user/signup', (req, res) => {
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

app.get('/user/signin', (req, res) => {
      res.render('user/signin');
});

app.post('/user/signin', passport.authenticate("local", {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup'
}));

app.get('/user/signout', isLoggedIn, (req, res) => { // force user login before hitting signout page
    req.session.cart = null; // empty cart once logged out
    req.logout();
    res.redirect('/user/signin');
});

app.get('/user/profile', isLoggedIn, (req, res) => {
    res.render('user/profile'); // force user login before hitting profile page
 });

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/user/signin");
}

const PORT = process.env.PORT || 3000 ; // TODO get it from config depending on dev/prod env
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
});

module.exports = app;
