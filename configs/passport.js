var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('users');



passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]'
}, function (email, password, done) {
    User.findOne({ email: email }).then(function (user) {
        if (!user || !user.validPassword(password)) {
            return done(null, false, { errors: { 'email or password': 'is invalid' } });
        }

        return done(null, user);
    }).catch(done); 
}));


passport.serializeUser(function (user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    */
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});
