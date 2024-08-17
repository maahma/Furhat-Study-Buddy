const axios = require('axios');
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
// const Preferences = require("./model/preferencesSchema")
const Notes = require("./model/notesSchema")
const Quiz = require("./model/quizSchema")
const StudyPlan = require("./model/studyPlanSchema")
const { OpenAI } = require('openai');

// const FURHAT_API_URL = 'http://localhost:4000';
// const FURHAT_API_KEY = '4b0e1ba2-94c0-4fdf-af01-87501f570da3';    // NO AUTHORIZATION REQUIRED ACCORDING TO SETUP

let userId = ""

// const allowedOrigins = [
//     "http://localhost:3000",
//     "http://localhost:4000"
// ];

// app.use(cors({
//     origin: function(origin, callback) {
//         if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true
// }));


app.use(cors({
    origin: "http://localhost:3000",
    methods:"GET,POST,PUT,DELETE",
    credentials: true
}));

// app.use(cors());

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

        ////////////////////////////////////////////////
        res.status(200).json({
            message: "User has logged in",
            user: {
                id: req.user._id,
                name: req.user.displayName
            }
        });
        //////////////////////////////////////////////

        console.log("req.user._id: ", req.user._id)
        userId = req.user._id;

        // sendRequestToFurhat()
            

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
// app.post("/api/preferences", async (req, res) => {
//     try {
//         const { studyHoursPerDay, pomodoroDuration, breakDuration } = req.body;

//         // Validate request body
//         if (!userId || !studyHoursPerDay || !pomodoroDuration || !breakDuration) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         const preferenceItem = await Preferences.create({ userId, studyHoursPerDay, pomodoroDuration, breakDuration });
//         console.log("NEW PREFERENCE POSTED");
//         res.status(200).json(preferenceItem);
//     } catch (error) {
//         console.log("ERROR POSTING A NEW PREFERENCE");
//         res.status(400).json({ error: error.message });
//     }
// });

// // UPDATE A PREFERENCE
// app.patch("/api/preferences/:id", async (req, res) => {

//     const { id } = req.params;
//     const { dueDatestudyHoursPerDay, pomodoroDuration, breakDuration } = req.body;
//     try {
//         const preferenceItem = await Preferences.findOneAndUpdate(
//             { _id: id, userId: userId },
//             { dueDatestudyHoursPerDay, pomodoroDuration, breakDuration },
//             { new: true }
//         );
//         if (!preferenceItem) {
//             return res.status(404).json({ error: "Preference not found or you do not have permission to update this preference." });
//         }
//         console.log("PREFERENCE UPDATED");
//         res.status(200).json(preferenceItem);
//     } catch (error) {
//         console.log("ERROR UPDATING PREFERENCE");
//         res.status(400).json({ error: error.message });
//     }
// });
// ----------------------------------------------------------------------------------


// -------------------------------- STUDY PLAN ROUTE --------------------------------
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY 
  });

const getStartAndEndOfNext7Days = () => {
    const today = new Date();
    const startDate = today;
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 6); // +6 days to cover a full week

    return { startDate, endDate };
};

const getNext7DaysData = async () => {
    const { startDate, endDate } = getStartAndEndOfNext7Days();
    console.log("START DATE: ", startDate)
    console.log("END DATE: ", endDate)

    try {
        const startOfDay = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
        const endOfDay = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));

        const classes = await Class.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        }).exec();

        classes.sort((a, b) => {
            const dateA = new Date(`${a.date.toISOString().split('T')[0]}T${a.starttime}:00`);
            const dateB = new Date(`${b.date.toISOString().split('T')[0]}T${b.starttime}:00`);
            return dateA - dateB;
        });

        return { classes };
    } catch (error) {
        console.error('Error fetching data for the next 7 days:', error);
        throw error;
    }
};

async function generateSchedule(classes, deadlines) {
    const messages = [
        {
            role: "system", content: "You are a helpful assistant for scheduling study hours and tasks."
        },
        {   role: "user", content: `
            Based on the class schedule and deadlines provided, create a study schedule with specific study hours and to-do lists for each session in the following format :
            
            ### **[Day of the week], [Month] [Day], [Year]**
                - **[Start Time] - [End Time]**: Study Session
                  - **To-Do List**: [Specific task for this session]

            **Preferences:**
            - 5 study sessions every day with 4 sessions for daily work (lecture notes, lab work, tutorial work) and 1 session for assignment work

            **Classes:**
            ${classes.map(c => `- ${c.title} on ${c.date} from ${c.starttime} to ${c.endtime}`).join("\n")}

            **Deadlines:**
            ${deadlines.map(d => `- ${d.title} due on ${d.dueDate}`).join("\n")}

            **Format:**
            - Only provide day, date, time, title of task, and to-do list for each study session.
            - Avoid using session titles like "Morning Session" or "Afternoon Session".
            - List specific study hours for each day with date, avoiding overlap with classes and ensuring ensuring a buffer period of 30 minutes before and after each class to prevent scheduling study sessions too closely to class times.
            - Do not schedule study sessions during class times.
            - Space study sessions evenly throughout the day, ensuring a mix of morning and afternoon sessions (e.g., 3 in the morning, 2 in the afternoon) to prevent burnout and maintain energy levels.
            - Include a to-do list for each study session, specifying tasks like reviewing lecture notes, lab work, tutorial work, and assignments. Ensure variety in the tasks to cover all necessary activities.
            - Include realistic breaks between sessions, especially around lunch and dinner times, and ensure that there is time for rest and other activities.
            `
        }
    ]

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            max_tokens: 1400,
            temperature: 0.5,
        });

        const schedule = response.choices[0].message.content;
        return schedule;
    } catch (error) {
        console.error("Error generating schedule:", error);
        throw new Error("Failed to generate schedule");
    }
}

const parseSchedule = (originalText) => {
    let splitOriginalText = originalText.split(/\n(?=### \*\*)/);

    // splitOriginalText = splitOriginalText.slice(1);

    const finalSchedule = [];

    splitOriginalText.forEach((element) => {
        const text = element;

        const sessions = text.split(/-\s\*\*/).filter(session => session.trim().length > 0);
        const cleanedSessions = sessions.map(session => `- **${session.trim()}`);

        // Regex patterns to get data from the generated text 
        const datePattern = /### \*\*(.*?)\*\*/;
        const timePattern = /-\s\*\*(\d{2}:\d{2}) - (\d{2}:\d{2})\*\*/;
        const taskPattern = /- \*\*To-Do List\*\*:\s(.*)/;

        // Extract the date
        const dateMatch = cleanedSessions[0].match(datePattern);
        const dateStr = dateMatch ? dateMatch[1] : null;

        if (!dateStr) return; // Skip if date is not found
        const date = new Date(dateStr);

        // Prepare arrays to hold sessions' data
        const sessionsData = [];

        let currentSession = {};
        for (let i = 1; i < cleanedSessions.length; i++) {
            const sessionText = cleanedSessions[i];

            if (timePattern.test(sessionText)) {
                const timeMatch = sessionText.match(timePattern);
                currentSession = {
                    startTime: timeMatch[1],
                    endTime: timeMatch[2],
                    task: ''
                };
                sessionsData.push(currentSession);
            } else if (taskPattern.test(sessionText)) {
                const taskMatch = sessionText.match(taskPattern);
                if (currentSession) {
                    currentSession.task = taskMatch[1].trim();
                }
            }
        }

        finalSchedule.push({
            date: date.toDateString(),
            sessions: sessionsData
        });
    });

    console.log("FINAL SCHEDULE")
    console.log(JSON.stringify(finalSchedule, null, 2));
    return finalSchedule;
};

// CREATE A STUDY PLAN FOR THE WEEK
app.post('/api/studyPlan', async (req, res) => {
    try {
        console.log("USER ID INSIDE POST OPEN API : ", userId)

        // Fetch user preferences
        // const preferences = await Preferences.findOne({ userId });
        // if (!preferences) {
        //     return res.status(404).json({ message: "Preferences not found" });
        // }

        // console.log("PREFERENCES FOUND : ", preferences)

        const { classes } = await getNext7DaysData();
        const deadlines = await Deadlines.find({ user: userId });
        
        console.log("CLASSES FOUND : ", classes)
        console.log("DEADLINES FOUND : ", deadlines)
        
        const generatedSchedule = await generateSchedule(classes, deadlines);
        console.log("SCHEDULE GENERATED: ")
        console.log(generatedSchedule)

        const finalSchedule = parseSchedule(generatedSchedule);

        const studyPlans = finalSchedule.map(plan => ({
            user: userId, 
            date: new Date(plan.date),
            sessions: plan.sessions.map(session => ({
                startTime: session.startTime,
                endTime: session.endTime,
                task: session.task
            }))
        }));        

        const savedPlans = await StudyPlan.create(studyPlans)

        console.log("PLAN SAVED SUCCESSFULLY")
        res.status(200).json(savedPlans);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET ALL STUDY PLANS 
app.get("/api/studyPlan", async (req, res) => {
    console.log("REQ USER ID IS: ", userId);
    try{
        const studyPlan = await StudyPlan.find({ user: userId });
        res.status(200).json(studyPlan);
    } catch (error) {
        console.error('Error getting deadlines:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get("/api/studyPlan/check-current-week", async (req, res) => {
    try {
        // Calculate the start and end dates of the current week
        const { startDate, endDate } = getStartAndEndOfNext7Days();

        // Fetch the study plans for the current week
        const schedule = await StudyPlan.find({
            user: userId,
            date: { 
                $gte: new Date(startDate),    // date greater than or equal to
                $lte: new Date(endDate)       // date less than or equal to
            }
        }).sort({ date: 1 }); 

        // Check if schedule is empty
        if (schedule.length > 0) {
            console.log("SCHEDULE EXISTS AND HERE IT IS")
            res.status(200).json({ scheduleExists: true, schedule });
        } else {
            console.log("SCHEDULE DOES NOT EXIST SORRY")
            res.status(200).json({ scheduleExists: false, schedule: [] });
        }
    } catch (error) {
        console.error('Error checking schedule:', error);
        res.status(500).json({ message: "Server error" });
    }
});
// ----------------------------------------------------------------------------------


// ----------------------- GENERATE QUIZ FROM NOTES ROUTE ---------------------------
app.post("/api/notes", async (req, res) => {
    const { notes } = req.body;
    try {
        console.log("INSIDE POST NOTES")
        const notesItem = await Notes.create({ notes, user: userId });
        console.log("NEW NOTES POSTED");

        // Generate the quiz based on the notes
        const quizContent = await generateQuiz(notesItem.notes);
        const questions = parseQuiz(quizText);

        console.log("QUIZ CONTENT: ")
        console.log(quizContent)

        // Save the quiz to the database
        const quiz = await Quiz.create({ user: userId, questions });
        console.log("Quiz created successfully:", quiz);

        res.status(200).json({ notesItem, quiz });
    } catch (error) {
        console.log("ERROR POSTING NEW NOTES");
        res.status(400).json({ error: error.message });
    }
});

const parseQuiz = (quiz) => {
    let quizItems = quiz.split("\n\n");
    console.log(quizItems);

    const questions = quizItems.map(item => {
        const questionMatch = item.match(/\*\*Question:\*\* (.*?)(?=\*\*Answer:\*\*)/s);
        const answerMatch = item.match(/\*\*Answer:\*\* (.*?)(?=\n|$)/s);
        return {
            questionText: questionMatch ? questionMatch[1].trim() : '',
            answer: { answerText: answerMatch ? answerMatch[1].trim() : '' }
        };
    });

    return questions;
}

// app.get("/api/notes", async(req, res) => {
//     try{
//         const notes = await Notes.find({ user: userId });
//         res.status(200).json(notes);
//     } catch (error) {
//         console.error('Error getting notes:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// })

async function generateQuiz(notes) {
    const messages = [
        {
            role: "system", content: "You are a helpful assistant that generates quizzes from user notes. Your task is to convert the provided notes into quiz questions and answers."
        },
        {   role: "user", content: `
            I have provided the following notes. Please generate a quiz based on these notes. The quiz should consist of questions and answers derived directly from the content of the notes.

            ### Notes:
            ${notes}

            **Format:**
            - Create 20 questions that are clear and directly related to the content of the notes.
            - Provide a single answer for each question that is accurate and concise.
            - Format the output as a list of questions with their corresponding answers.

            **Example:**
            1. **Question:** What is the capital of France?
                **Answer:** Paris

            2. **Question:** Where is Sheffield in England?
                **Answer:** South Yorkshire
            `
        }
    ]

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            max_tokens: 1400,
            temperature: 0.5,
        });

        const quiz = response.choices[0].message.content;
        return quiz;
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz");
    }
}

// app.post("/api/quiz", async(req, res) => {
//     try{
//     } catch {

//     }
// })
// ----------------------------------------------------------------------------------

// ------------------ FURHAT ROUTE --------------------------------------------------
// app.post("/api/furhat-connect", async (req, res) => {
//     try {
//         console.log('Connection request received from Furhat.');
//         res.json({ message: 'Connected to Furhat successfully!' });
//     } catch (error) {
//         console.error('Error processing request:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }    
// });

// const sendRequestToFurhat = async () => {
//     try {
//         const response = await axios.post("http://localhost:5000/webapp-connect", {
//             headers: {
//                 'Content-Type': 'application/json'
//             }, 
//             message: 'Request to connect to Furhat from backend server',
//         }, { withCredentials: true });
//         console.log(response.data.message);
//     } catch (error) {
//         console.error('Error connecting to Furhat from backend server: ', error);
//     }
// }

// app.post("/api/furhat-greet", async (req, res) => {
//     try {
//         console.log()
//         console.log("INSIDE FURHAT GREET FUNCTION IN SERVER.JS")
//         console.log()
//         const userName = req.body.name; // Get the user's name from the request body

//         const response = await axios.post("http://localhost:4000", {
//             // text: "Hello, " + userName,
//             // blocking: true,
//             event_name: "GreetUser",
//             data: { name: userName }
//         });

//         // Send a response back to the frontend to confirm that the request was sent
//         res.status(200).json({ status: 'success', message: 'Greeting request sent.' });
//     } catch (error) {
//         console.error('Error sending greeting to Furhat:', error);
//         res.status(500).json({ message: 'Failed to send greeting' });
//     }
// });

// ----------------------------------------------------------------------------------

const server = app.listen(process.env.PORT, () => {
    console.log("Connected to MongoDB and listening on port", process.env.PORT);
});