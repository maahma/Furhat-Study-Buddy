require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db/connection");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./model/userSchema")

const Class = require("./model/classSchema");
const Deadlines = require("./model/deadlinesSchema");

let userId = ""

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
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using https
        httpOnly: true
    }
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
    console.log(user.id)
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// SETUP GOOGLE AUTH LOGIN USING PASSPORT
app.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}));

// app.get("/auth/google/callback", passport.authenticate("google", {
//     successRedirect: "http://localhost:3000/dashboard",
//     failureRedirect: "http://localhost:3000/login"
// }));   // calling from front end

app.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect("http://localhost:3000/login");
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Save the session before redirecting
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect("http://localhost:3000/dashboard");
            });
        });
    })(req, res, next);
});


app.get("/login/success", async(req, res) => {
    console.log("reqqq", req.user);
    if (req.user){
        res.status(200).json({message: "User has logged in", user: req.user});
        console.log("req.user._id: ", req.user._id)
        userId = req.user._id;
    } else {
        res.status(400).json({message: "Not Authorized"})
    }
})

app.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        } else {
            res.redirect("http://localhost:3000");
        }
    });
});

// Use class routes
// app.use("/api/classes", classRoutes);



// -------------------------------- CLASS ROUTES --------------------------------
// GET CLASSES FOR THE USER
app.get("/api/classes", async (req, res) => {
    console.log("REQ USER ID IS: ", userId);
    try{
        const classes = await Class.find({ user: userId });

        // Send the classes as a response
        res.status(200).json(classes);
    } catch (error) {
        console.error('Error getting classes:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// CREATE A CLASS
app.post("/api/classes", async (req, res) => {
    const { title, day, starttime, endtime, repeat } = req.body;
    try {
        const classItem = await Class.create({ title, day, starttime, endtime, repeat, user: userId });
        console.log("NEW CLASS POSTED");
        res.status(200).json(classItem);
    } catch (error) {
        console.log("ERROR POSTING A NEW CLASS");
        res.status(400).json({ error: error.message });
    }
});

// DELETE A CLASS
app.delete("/api/classes/:id", async (req, res) => {
    const { id } = req.params;
    console.log("id: ", id)

    try {
        const classItem = await Class.findOneAndDelete({ _id: id, user: userId });
        if (!classItem) {
            return res.status(404).json({ error: "Class not found or you do not have permission to delete this class." });
        }
        console.log("CLASS DELETED");
        res.status(200).json({ message: "Class deleted successfully." });
    } catch (error) {
        console.log("ERROR DELETING CLASS");
        res.status(400).json({ error: error.message });
    }
});

// UPDATE A CLASS
app.patch("/api/classes/:id", async (req, res) => {

    const { id } = req.params;
    const { title, day, starttime, endtime, repeat } = req.body;
    try {
        const classItem = await Class.findOneAndUpdate(
            { _id: id, user: userId },
            { title, day, starttime, endtime, repeat },
            { new: true }
        );
        if (!classItem) {
            return res.status(404).json({ error: "Class not found or you do not have permission to update this class." });
        }
        console.log("CLASS UPDATED");
        res.status(200).json(classItem);
    } catch (error) {
        console.log("ERROR UPDATING CLASS");
        res.status(400).json({ error: error.message });
    }
});


// -------------------------------- DEADLINES ROUTES --------------------------------
// GET DEADLINES FOR THE USER
app.get("/api/deadlines", async (req, res) => {
    console.log("REQ USER ID IS: ", userId);
    try{
        const deadlines = await Deadlines.find({ user: userId });

        // Send the deadlines as a response
        res.status(200).json(deadlines);
    } catch (error) {
        console.error('Error getting deadlines:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// CREATE A DEADLINE
app.post("/api/deadlines", async (req, res) => {
    const { title, dueDate } = req.body;
    try {
        const deadlineItem = await Deadlines.create({ title, dueDate, user: userId });
        console.log("NEW DEADLINE POSTED");
        res.status(200).json(deadlineItem);
    } catch (error) {
        console.log("ERROR POSTING A NEW DEADLINE");
        res.status(400).json({ error: error.message });
    }
});

// DELETE A DEADLINE
app.delete("/api/deadlines/:id", async (req, res) => {
    const { id } = req.params;
    console.log("id: ", id)
    
    try {
        const deadlineItem = await Deadlines.findOneAndDelete({ _id: id, user: userId });
        if (!deadlineItem) {
            return res.status(404).json({ error: "Deadline not found or you do not have permission to delete this deadline." });
        }
        console.log("DEADLINE DELETED");
        res.status(200).json({ message: "Deadline deleted successfully." });
    } catch (error) {
        console.log("ERROR DELETING DEADLINE");
        res.status(400).json({ error: error.message });
    }
});

// UPDATE A DEADLINE
app.patch("/api/deadlines/:id", async (req, res) => {

    const { id } = req.params;
    const { title, dueDate } = req.body;
    try {
        const deadlineItem = await Deadlines.findOneAndUpdate(
            { _id: id, user: userId },
            { title, dueDate },
            { new: true }
        );
        if (!deadlineItem) {
            return res.status(404).json({ error: "Deadline not found or you do not have permission to update this deadline." });
        }
        console.log("DEADLINE UPDATED");
        res.status(200).json(deadlineItem);
    } catch (error) {
        console.log("ERROR UPDATING DEADLINE");
        res.status(400).json({ error: error.message });
    }
});

app.listen(process.env.PORT, () => {
    console.log("Connected to MongoDB and listening on port", process.env.PORT);
});