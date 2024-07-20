const express = require("express");
const Class = require("../model/classSchema");

const router = express.Router();

router.get("/", (req, res) => {
    // console.log("User object:", req); 
    res.json({mssg: "GET ALL CLASSES"});
})

router.post("/", async (req, res) => {
    const {title, day, starttime, endtime, repeat} = req.body;
    try {
        
        const classItem = await Class.create({title, day, starttime, endtime, repeat, user: req.userId});
        console.log("NEW CLASS POSTED");
        res.status(200).json(classItem);
    } catch (error) {
        console.log("ERROR POSTING A NEW CLASS");
        res.status(400).json({error: error.message});
    }
});

router.delete("/:id", (req, res) => {
    res.json({mssg: "DELETE A CLASS"})
})

router.patch(":/id", (req, res) => {
    res.json({mssg: "UPDATE A CLASS"})
})

module.exports = router