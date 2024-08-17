// import React from 'react';
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// import {useState, useContext, useEffect} from "react";
// import axios from 'axios';
// import 'react-circular-progressbar/dist/styles.css';
// import "../style/timer.css"

// const red = '#f54e4e';
// const green = '#4aec8c';

// const Timer = () => {

//     const [isPaused, setIsPaused] = useState(false);
//     const [secondsLeft, setSecondsLeft] = useState(0);
//     const [preferences, setPreferences] = useState(null);

//     useEffect(() => {
//         const fetchPreferences = async() => {
//             try {
//                 const response = await axios.get("http://localhost:6005/api/preferences", {withCredentials: true});
//                 setPreferences(response.data)
//             } catch (error) {
//                 console.error('Error fetching preferences:', error);
//             }
//         };

//         fetchPreferences();
//     }, []);

//     useEffect(() => {
//         if (preferences) {
//             setSecondsLeft(preferences.pomodoroDuration * 60); // Initialize with Pomodoro duration in seconds
//         }
//     }, [preferences]);

//     const handleStartStop = () => {
//         setIsPaused(!isPaused);
//     };

//     // function initTimer() {
//     //     setSecondsLeft()
//     // }

//     // useEffect(effect : () => {
//     //     initTimer();
//     // }, )

//     return (
//         <div>
//             <CircularProgressbar
//                 className="timer"
//                 value={secondsLeft ? (secondsLeft / (preferences?.pomodoroDuration * 60)) * 100 : 0}
//                 text={`${Math.floor(secondsLeft / 60)}:${secondsLeft % 60}`}
//                 styles={buildStyles({
//                     textColor: '#000',
//                     pathColor: red,
//                     tailColor: 'rgba(255, 255, 255, .2)',
//                 })}
//             />
//             <div>
//                 <button onClick={handleStartStop} className={isPaused ? "play-btn" : "stop-btn"}>
//                     <img
//                         className={isPaused ? "play-button" : "stop-button"}
//                         src={isPaused ? "/images/play.png" : "/images/stop.png"}
//                         alt={isPaused ? "play-button" : "stop-button"}
//                     />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Timer;


import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import "../style/timer.css"


function PomodoroTimer({ task, isActive, onTimerEnd }) {
    const [time, setTime] = useState(3000); // 50 minutes in seconds
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timer = null;
        if (isRunning && time > 0) {
            timer = setInterval(() => setTime((prevTime) => prevTime - 1), 1000);
        } else if (time === 0) {
            onTimerEnd();
            clearInterval(timer);
        }

        return () => clearInterval(timer);
    }, [isRunning, time]);

    useEffect(() => {
        if (!isActive) {
            setIsRunning(false);
            setTime(3000); // Reset timer
        }
    }, [isActive]);

    const startTimer = () => setIsRunning(true);
    const stopTimer = () => setIsRunning(false);
    const resetTimer = () => {
        setIsRunning(false);
        setTime(3000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const percentage = (time / 3000) * 100; // Calculate the percentage for the progress bar

    return (
        <div className="pomodoro-timer">
            <h4>{task}</h4>
            <div className="timer">
                {/* <span>{formatTime(time)}</span> */}
                <CircularProgressbar
                    value={percentage}
                    text={formatTime(time)}
                    styles={buildStyles({
                        textSize: '16px',
                        pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
                        textColor: '#f88',
                        trailColor: '#d6d6d6',
                        backgroundColor: '#3e98c7',
                    })}
                />
            </div>
            <div className="controls">
                {!isRunning ? <button onClick={startTimer}>Start</button> : <button onClick={stopTimer}>Pause</button>}
                <button onClick={resetTimer}>Reset</button>
            </div>
        </div>
    );
}

export default PomodoroTimer;