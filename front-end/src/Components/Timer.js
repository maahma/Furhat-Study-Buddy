import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import {useState, useContext, useEffect} from "react";
import axios from 'axios';
import 'react-circular-progressbar/dist/styles.css';
import "../style/timer.css"

const red = '#f54e4e';
const green = '#4aec8c';

const Timer = () => {

    const [isPaused, setIsPaused] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [preferences, setPreferences] = useState(null);

    useEffect(() => {
        const fetchPreferences = async() => {
            try {
                const response = await axios.get("http://localhost:6005/api/preferences", {withCredentials: true});
                setPreferences(response.data)
            } catch (error) {
                console.error('Error fetching preferences:', error);
            }
        };

        fetchPreferences();
    }, []);

    useEffect(() => {
        if (preferences) {
            setSecondsLeft(preferences.pomodoroDuration * 60); // Initialize with Pomodoro duration in seconds
        }
    }, [preferences]);

    const handleStartStop = () => {
        setIsPaused(!isPaused);
    };

    // function initTimer() {
    //     setSecondsLeft()
    // }

    // useEffect(effect : () => {
    //     initTimer();
    // }, )

    return (
        <div>
            <CircularProgressbar
                className="timer"
                value={secondsLeft ? (secondsLeft / (preferences?.pomodoroDuration * 60)) * 100 : 0}
                text={`${Math.floor(secondsLeft / 60)}:${secondsLeft % 60}`}
                styles={buildStyles({
                    textColor: '#000',
                    pathColor: red,
                    tailColor: 'rgba(255, 255, 255, .2)',
                })}
            />
            <div>
                <button onClick={handleStartStop} className={isPaused ? "play-btn" : "stop-btn"}>
                    <img
                        className={isPaused ? "play-button" : "stop-button"}
                        src={isPaused ? "/images/play.png" : "/images/stop.png"}
                        alt={isPaused ? "play-button" : "stop-button"}
                    />
                </button>
            </div>
        </div>
    );
};

export default Timer;