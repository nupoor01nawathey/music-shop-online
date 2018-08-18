// include pre-defined lib 
const express    = require('express'),
      bodyParser = require('body-parser'),
      exphbs     = require('express-handlebars');


// include custom lib
const seeder = require('./public/js/seeder');


// setup express app
const app =  express();

// setup view engine
app.engine('.hbs', exphbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', '.hbs');

// static folder setting
app.use(express.static(`${__dirname}/public`));


// setup get route which will display all products
app.get('/', (req, res) => {
    res.render('index');
})

const PORT = process.env.PORT || 3000 ; // TODO get it from config depending on dev/prod env
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
});