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
const Preferences = require("./model/preferencesSchema")
const { OpenAI } = require('openai');

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
    const { title, date, starttime, endtime, repeat } = req.body;
    try {
        const classItem = await Class.create({ title, date, starttime, endtime, repeat, user: userId });
        
        if (repeat) {
            // Add the class to the next weeks
            const classDate = new Date(date);
            for (let i = 1; i <= 10; i++) {  // Repeat for the next 10 weeks
                classDate.setDate(classDate.getDate() + 7);
                const repeatedClass = new Class({ 
                    title, 
                    date: classDate.toISOString(), 
                    starttime, 
                    endtime, 
                    repeat, 
                    user: userId 
                });
                await repeatedClass.save();
            }
        }
        
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
    const { title, date, starttime, endtime, repeat } = req.body;
    try {
        const classItem = await Class.findOneAndUpdate(
            { _id: id, user: userId },
            { title, date, starttime, endtime, repeat },
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

// GET CLASSES FOR THE WEEK
app.get("/api/classes", async (req, res) => {
    // console.log("INSIDE GET DATES REQUEST IN SERVER JS")
    const { startDate, endDate } = req.query;

    // console.log(`Received startDate: ${startDate}, endDate: ${endDate}`);

    try {
        const classes = await Class.find({
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }).populate('user');

        res.status(200).json(classes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})
// ----------------------------------------------------------------------------------


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
// ----------------------------------------------------------------------------------


// -------------------------------- PREFERENCES ROUTE --------------------------------
// CREATE A PREFERENCE
app.post("/api/preferences", async (req, res) => {
    try {
        const { studyHoursPerDay, pomodoroDuration, breakDuration } = req.body;

        // Validate request body
        if (!userId || !studyHoursPerDay || !pomodoroDuration || !breakDuration) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const preferenceItem = await Preferences.create({ userId, studyHoursPerDay, pomodoroDuration, breakDuration });
        console.log("NEW PREFERENCE POSTED");
        res.status(200).json(preferenceItem);
    } catch (error) {
        console.log("ERROR POSTING A NEW PREFERENCE");
        res.status(400).json({ error: error.message });
    }
});

// UPDATE A PREFERENCE
app.patch("/api/preferences/:id", async (req, res) => {

    const { id } = req.params;
    const { dueDatestudyHoursPerDay, pomodoroDuration, breakDuration } = req.body;
    try {
        const preferenceItem = await Preferences.findOneAndUpdate(
            { _id: id, userId: userId },
            { dueDatestudyHoursPerDay, pomodoroDuration, breakDuration },
            { new: true }
        );
        if (!preferenceItem) {
            return res.status(404).json({ error: "Preference not found or you do not have permission to update this preference." });
        }
        console.log("PREFERENCE UPDATED");
        res.status(200).json(preferenceItem);
    } catch (error) {
        console.log("ERROR UPDATING PREFERENCE");
        res.status(400).json({ error: error.message });
    }
});
// ----------------------------------------------------------------------------------


// -------------------------------- SCHEDULE ROUTE --------------------------------
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY 
  });

async function generateSchedule(userPreferences, classes, deadlines) {
    const messages = [
        {
            role: "system", content: "You are a helpful assistant for generating study schedules."
        },
        {   role: "user", content: `
            Generate a study schedule based on the following preferences, classes, and deadlines:

            **Rules:**
            1. Use only the provided classes, deadlines, and user preferences.
            2. Prioritize subjects with nearest deadlines.
            3. Include short breaks every hour and a longer break after 4 hours of study.
            4. Avoid scheduling study sessions during class times.

            **Preferences:**
            - Study hours per day: ${userPreferences.studyHoursPerDay}
            - Pomodoro duration (minutes): ${userPreferences.pomodoroDuration}
            - Short break duration (minutes): ${userPreferences.breakDuration.short}
            - Long break duration (minutes): ${userPreferences.breakDuration.long}

            **Classes:**
            ${classes.map(c => `- ${c.title} on ${c.date} from ${c.starttime} to ${c.endtime}`).join("\n")}

            **Deadlines:**
            ${deadlines.map(d => `- ${d.title} due on ${d.dueDate}`).join("\n")}

            Create a study schedule that:
            - Adheres to the above rules.
            - Ensures all deadlines are met.
            - Considers the user preferences for study and break durations.
            - Avoids overlap with class times.

            Format the schedule with the following details for each day:
            - Time slots
            - Activity type (study, break, class, deadline)
            - Duration of each activity
            - Any additional notes or considerations.
            `
        }
    ]

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 500,
            temperature: 0.5,
        });

        const schedule = response.choices[0].message.content;
        console.log("SCHEDULE GENERATED: ", schedule);
        return schedule;
    } catch (error) {
        console.error("Error generating schedule:", error);
        throw new Error("Failed to generate schedule");
    }
}

app.post('/api/schedule', async (req, res) => {
    try {
        console.log("USER ID INSIDE POST OPEN API : ", userId)
        // Fetch user preferences
        const preferences = await Preferences.findOne({ userId });
        if (!preferences) {
            return res.status(404).json({ message: "Preferences not found" });
        }

        console.log("PREFERENCES FOUND : ", preferences)

        // Fetch classes and deadlines
        const classes = await Class.find({ user: userId });
        const deadlines = await Deadlines.find({ user: userId });
        
        console.log("CLASSES FOUND : ", classes)
        console.log("DEADLINES FOUND : ", deadlines)

        // Generate the schedule using OpenAI
        const schedule = await generateSchedule(preferences, classes, deadlines);

        console.log("SCHEDULE GENERATED: ", schedule)

        res.status(200).json({ schedule });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// ----------------------------------------------------------------------------------

app.listen(process.env.PORT, () => {
    console.log("Connected to MongoDB and listening on port", process.env.PORT);
});