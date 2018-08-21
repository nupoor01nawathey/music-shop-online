// include pre-defined lib 
const express             = require('express'),
      bodyParser          = require('body-parser'),
      flash               = require('connect-flash'),
      logger              = require('morgan'),
      expejs              = require('ejs'),
      path                = require('path'),
      mongoose            = require('mongoose'),
      session             = require('express-session'),
      MongoStore          = require('connect-mongo')(session),
      cookieParser        = require('cookie-parser'),
      isomorphic          = require('isomorphic-fetch'),
      stripe              = require('stripe') ;

// include custom lib
const seeder = require('./public/js/seeder'),
      Artist = require('./models/artist'),
      Cart = require("./models/cart");

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

// setup get route which will display all products
app.get('/index', (req, res) => {
    res.render('common/index');
});

app.get('/', (req, res, next) => { 
    // Remove existing data for the input Artist 
    const artistName = String(req.query.name);
    // console.log("********************");
    // console.log(req.query.name);
    // console.log("********************");

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


app.get('/add-to-cart/:id', (req, res) => {
    // res.send('From SHopping-cart');
    const songId = req.params.id;

    const cart = new Cart(req.session.cart ? req.session.cart : {}); // send if cart already exists within the session 

    Artist.findById(songId, (err, song) => {
        encodeURIComponent(song.artistName); // imp
        if(err) {
            res.redirect('/'); // http://localhost:3000/?name=John+Mayer
        }
       cart.add(song, songId);
       req.session.cart = cart ; // save cart session
       
       // res.redirect('/');

       res.redirect('/?name=' + song.artistName); // http://localhost:3000/?name=John+Mayer

    }); 
});

app.get('/shopping-cart', (req, res) => {
    // res.send('Going to shopping-cart');
    if(!req.session.cart) {
        return res.render('cart/shopping-cart', {songs: null});
    } 
    var cart = new Cart(req.session.cart);
    res.render('cart/shopping-cart', { 
        songs: cart.generateArray(),  
        totalPrice: cart.totalPrice 
    });
});

app.get('/checkout', (req, res) => {
    if(!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    const cart = new Cart(req.session.cart);
    const errMsg = req.flash('error')[0];
    res.render('cart/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
});

app.post('/checkout', (req, res, next) => {   
    if(!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    const cart = new Cart(req.session.cart);

    // Set your secret key: remember to change this to your live secret key in production   
    var stripe = require("stripe")("sk_test_YRqcNvr5XnGQnQfke6TW3wab");

    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    const token = req.body.stripeToken; // Using Express
    const charge = stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: 'usd',
    description: 'Example charge 1',
    source: token,
    }, (err, charge) => {
        if(err) {
           req.flash('error', err.message);
           return res.redirect('/checkout'); 
        } 
        req.flash('success', 'Successfully placed an order');
        req.cart = null;
        res.redirect('/');
    });
});


const PORT = process.env.PORT || 3000 ; // TODO get it from config depending on dev/prod env
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
});

module.exports = app;