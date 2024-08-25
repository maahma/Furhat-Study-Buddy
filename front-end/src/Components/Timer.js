import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import "../style/timer.css"
import axios from 'axios';
import io from 'socket.io-client';
import { useFurhat } from '../Context/FurhatContext';

// Connect to the WebSocket server for FaceReader connection
const socket = io.connect('http://localhost:5051'); 

function PomodoroTimer({ task, isActive, onTimerEnd }) {
    const [time, setTime] = useState(3000); // 50 minutes in seconds
    const [isRunning, setIsRunning] = useState(false);
    const { furhat, furhatConnected } = useFurhat();


    const startFaceReaderAnalysis = () => {
        axios.post('http://localhost:5051/startAnalyzing')
            .then(response => console.log(response.data))
            .catch(error => console.error('Error starting analysis:', error));
    };

    const stopFaceReaderAnalysis = () => {
        axios.post('http://localhost:5051/stopAnalyzing')
            .then(response => console.log(response.data))
            .catch(error => console.error('Error stopping analysis:', error));
    };

    useEffect(() => {
        let timer = null;
        if (isRunning && time > 0) {
            timer = setInterval(() => setTime((prevTime) => prevTime - 1), 1000);
        } else if (time === 0) {
            onTimerEnd();
            clearInterval(timer);
            stopFaceReaderAnalysis(); // Stop FaceReader when time ends
        }

        return () => clearInterval(timer);
    }, [isRunning, time]);

    useEffect(() => {
        if (!isActive) {
            setIsRunning(false);
            setTime(3000); // Reset timer
        }
    }, [isActive]);


    //////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        // Listen for events from the WebSocket server
        socket.on('furhatEvent', (data) => {
            console.log('Received event from server:', data.message);
            console.log("SEND EVENT TO FURHAT FROM TIMER COMPONENT")
            useEffect(() => {
                if (furhatConnected && furhat) {
                    furhat.send({
                        event_name: 'CalmingActivity'
                    });
                    console.log("Calming activity event sent successfully");
                }
            }, [furhat, furhatConnected]);
        
        });

        return () => {
            // Clean up the WebSocket connection when the component unmounts
            socket.off('furhatEvent');
        };
    }, []);
    //////////////////////////////////////////////////////////////////////////





    const startTimer = () => {
        setIsRunning(true);
        startFaceReaderAnalysis(); // Start FaceReader when timer starts
    }

    const stopTimer = () => {
        setIsRunning(false);
        stopFaceReaderAnalysis(); // Stop FaceReader when timer pauses/stops
    }

    const resetTimer = () => {
        setIsRunning(false);
        setTime(3000);
        stopFaceReaderAnalysis();  // Stop FaceReader when timer resets
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