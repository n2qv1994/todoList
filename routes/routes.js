var express = require('express');
var passport = require('passport');

var taskController = require('../controllers/taskcontroller.js');
var actionController = require('../controllers/actioncontroller.js');
var router = express.Router();
require('../config/passport.js')(passport);


router.get('/home',isLoggedIn,taskController.loadHomePage);
// router.get('/home',taskController.loadHomePage);

router.get('/', function(req, res) {
    res.render('index.html');
});

router.get('/login', function(req, res) {
    res.render('login.html');
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/home',
    failureRedirect: '/login'
}));

router.get('/signup', function(req, res) {
    res.render('signup.html');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: '/signup',
}));

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/home',
        failureRedirect: '/'
    }));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};
module.exports = router;