// include pre-defined lib 
const express    = require('express'),
      bodyParser = require('body-parser'),
      exphbs     = require('express-handlebars'),
      mongoose   = require('mongoose'),
      isomorphic = require('isomorphic-fetch');

// include custom lib
// const seeder = require('./public/js/seeder');
const Artist = require('./models/artist');

// setup express app
const app =  express();

// mongoose conncection str
mongoose.connect('mongodb://localhost:27017/musicshopdata', { useNewUrlParser: true });

// setup body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup view engine
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// static folder setting
app.use(express.static(`${__dirname}/public`));

// setup get route which will display all products
app.get('/', (req, res) => {
    res.render('index');
});


app.post('/', (req, res, next) => { 
    // Remove existing data for the input Artist 
    // const returnVal = seeder(artistName);
    // config how many records to display per page and page number
    var perPage = 9;
    var page    = req.params.page || 1;

    const artistName = String(req.body.name);
    // console.log(artistName);
    // Artist.find({ artistName: artistName})
    // .select('artistName trackName trackPrice currency')
    // .then(( songs ) => {
    //     console.log(songs);
    // })
    // .catch((err) => {
    //     console.log(err);
    // });
    Artist.find({ artistName: artistName})
    .select('trackName trackPrice collectionName currency previewUrl')
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, artistSongs){
        if(err) {
            console.log(err);
        }
        Artist.countDocuments({ artistName: artistName })
        .exec(function(err, count){
            if (err) {
                return(next(error));
            }
            res.render('songs', {
                artist: artistName,
                songs: artistSongs,
                current: page,
                pages: Math.ceil(count/perPage)
            });
        });
    });
});


const PORT = process.env.PORT || 3000 ; // TODO get it from config depending on dev/prod env
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
});

module.exports = app;

