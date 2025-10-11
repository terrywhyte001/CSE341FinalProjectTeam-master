// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let existingUser = await User.findOne({ googleId: profile.id });
            
            if (existingUser) {
                return done(null, existingUser);
            }
            
            // Create new user
            const newUser = new User({
                googleId: profile.id,
                username: profile.displayName || profile.emails[0].value.split('@')[0],
                email: profile.emails[0].value,
                provider: 'google'
            });
            
            const savedUser = await newUser.save();
            done(null, savedUser);
        } catch (error) {
            done(error, null);
        }
    }));
} else {
    console.log('Google OAuth not configured - skipping Google strategy');
}

// GitHub OAuth Strategy (optional - only if credentials are provided)
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let existingUser = await User.findOne({ githubId: profile.id });
            
            if (existingUser) {
                return done(null, existingUser);
            }
            
            // Create new user
            const newUser = new User({
                githubId: profile.id,
                username: profile.username || profile.displayName,
                email: profile.emails ? profile.emails[0].value : null,
                provider: 'github'
            });
            
            const savedUser = await newUser.save();
            done(null, savedUser);
        } catch (error) {
            done(error, null);
        }
    }));
} else {
    console.log('GitHub OAuth not configured - skipping GitHub strategy');
}

module.exports = passport;