const express = require('express');
const router = express.Router();

// gọi app_class
const app_class = require('./app_class');
const kq = new app_class();

router.get('/index', (req, res)=>{
    var sidebar, main;
    
    sidebar = kq.get_sidebar(req.originalUrl);

    main = 'partials/main_home';

    res.render('index', {main, sidebar});
});

module.exports = router;