var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require("../models/user");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('Express REST API');
});


/* HAM NAY DUNG DE LUU TREN SECSSION */
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

/* HAM NAY DE LAY THONG TIN TREN SECSSION VA KIEM TRA  */
passport.deserializeUser(function (_id, done) {
    User.findById(_id).then(function (user) {
        done(null, user);
    }).catch(function (err) {
        console.log(err);
    })
});
/* KICH BAN CUA PASSPORT */

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            else {
                user.comparePassword(password, function (err, isMatch) {
                    if (isMatch && !err) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                });
            }
        });
    }
));
/* DEMO CHUNG THUC MOT ROUTER */
router.get('/book', passport.authenticate('local'), function (req, res) {
    res.send("book");
})
/* MOT ROUTE SU DUNG PASSPORT */
router.get('/login', function (req, res) {
    console.log("login");
    res.send("hello");
});
router.get('/loginok', function (req, res) {
    res.send("ok");
});
// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/login',
//     failureRedirect: '/loginok'
// }))
router.get('/private', passport.authenticate('local')
)
router.post('/login', passport.authenticate('local'), function (req, res) {
    console.log('res');
    // res.redirect("/");
    // res.send("ok");
    if (req.body.roles == 'admin') {
        res.send("admin");
    }
    else {
        res.send("user");
    }
}
)
/* --- */
router.post('/signup', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({ success: false, msg: 'Please pass username and password.' });
    } else {
        console.log(req.body.username);
        console.log(req.body.role);
        var newUser = new User({
            username: req.body.username,
            password: req.body.password,
            roles: req.body.roles
        });
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({ success: false, msg: 'Username already exists.' });
            }
            console.log(newUser);
            res.json({ success: true, msg: 'Successful created new user.' });
        });
    }
});
router.post('/loginok', function (req, res) {
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    res.json({ success: true });
                } else {
                    res.send({ success: false, msg: 'Authentication failed. Wrong password.' });
                }
            });
        }
    })
});
module.exports = router;