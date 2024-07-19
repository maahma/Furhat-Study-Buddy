require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db/connection");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./model/userSchema")

app.use(cors({
    origin: "http://localhost:3000",
    methods:"GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(express.json());

// SETUP SESSION
app.use(session({
    secret: "furhatapp1234567890",
    resave: false,
    saveUninitialized: true
}));

// SETUP PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new OAuth2Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET_KEY,
        callbackURL: "/auth/google/callback",
        scope:["profile", "email"]
    }, 
    async(accessToken, refreshToken, profile, done) => {
        // console.log("profile: ", profile)
        try {
            let user = await userdb.findOne({googleId: profile.id})

            if (!user) {
                user = new userdb({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    image: profile.photos[0].value
                });

                await user.save();
            }

            return done(null, user)
        } catch (error){
            return done(error, null)
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// SETUP GOOGLE AUTH LOGIN USING PASSPORT
app.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}));

app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:3000/dashboard",
    failureRedirect: "http://localhost:3000/login"
}));   // calling from front end

app.get("/login/success", async(req, res) => {
    // console.log("reqqq", req.user)

    if (req.user){
        res.status(200).json({message: "User has logged in", user: req.user});
    } else {
        res.status(400).json({message: "Not Authorized"})
    }
})

app.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        } 

        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.clearCookie('connect.sid', { path: '/' });
            res.redirect("http://localhost:3000");
        });
        
        // else {
        //     res.redirect("http://localhost:3000");
        // }
    });
});

app.listen(process.env.PORT, () => {
    console.log("Connected to MongoDB and listening on port", process.env.PORT);
});