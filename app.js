// include pre-defined lib 
const express             = require('express'),
      bodyParser          = require('body-parser'),
      expejs              = require('ejs'),
      path                = require('path'),
      mongoose            = require('mongoose'),
      session             = require('express-session'),
      mongoStoreSession   = require('connect-mongo')(session),
      cookieParser        = require('cookie-parser'),
      isomorphic          = require('isomorphic-fetch');

// include custom lib
const seeder = require('./public/js/seeder'),
      Artist = require('./models/artist'),
      Cart = require("./models/cart");

// setup express app
const app =  express();

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
    store: new mongoStoreSession({ mongooseConnection: mongoose.connection }), // use mongo connection for storing session
    cookie: {maxAge: 5 * 60 * 1000 } // session timeout after min * sec * millisec
}));

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
        encodeURIComponent(song.artistName);
        if(err) {
            res.redirect('/'); // http://localhost:3000/?name=John+Mayer
        }
       cart.add(song, songId);
       req.session.cart = cart ; // save cart session

       res.redirect('/?name=' + song.artistName); // http://localhost:3000/?name=John+Mayer

    }); 
});

app.get('/shopping-cart', (req, res) => {
    res.send('Going to shopping-cart');
})


const PORT = process.env.PORT || 3000 ; // TODO get it from config depending on dev/prod env
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
});

module.exports = app;

