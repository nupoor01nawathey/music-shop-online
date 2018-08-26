const express = require('express'),
      router  = express.Router();

// setup get route which will display all products
router.get('/', (req, res) => {
    res.render('common/index');
    // res.send('index page')
});

module.exports = router;