var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;


var UserManagement = require("../models/usermanagement");
var database = require('../db/mongo.service.js');
var connection = database.getConnection();
var userManagement = new UserManagement(connection);


// var User = require("../entity/user.js");
var configAuth = require('./auth');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(_id, done) {
        userManagement.findById(_id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: false
        },
        function(req, email, password, done) {
            process.nextTick(function() {
                userManagement.signupLocal(email, password, function(err, user) {
                    if (err) {
                        console.log("err");
                        return done(err);
                    }
                    if (user) {
                        console.log("ok");
                        return done(null, user);
                    } else {
                        console.log("user exist");
                        return done(null, false);
                    }
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            userManagement.loginLocal(email, password, function(err, user) {
                if (err) {
                    return done(err, null);
                }
                if (!user) {
                    console.log('username incorrect');
                    return done(null, false);
                } else {
                    
                    return done(null, user);
                }
            })
        }));

    passport.use('facebook', new FacebookStrategy({

            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: ['id', 'displayName', 'email']
        },

        function(token, refreshToken, profile, done) {
            process.nextTick(function() {

                userManagement.loginWithFacebook(profile,token,function(err,user){
                    if(err) return done(err,null);
                    done(null, user);
                })
            });

        }));

}