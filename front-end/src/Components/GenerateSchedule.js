import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import PomodoroTimer from './Timer';
import "../style/generateSchedule.css"
import { useFurhat } from '../Context/FurhatContext';

function GenerateSchedule() {
    const [schedule, setSchedule] = useState([]);
    const [error, setError] = useState(null);
    const [isScheduleGenerated, setIsScheduleGenerated] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [activeSession, setActiveSession] = useState(null);
    const { furhat, furhatConnected } = useFurhat();
    
    // Ref to track if the FocusTimer event has been sent
    const hasSentFocusTimerRef = useRef(false);

    useEffect(() => {
        if (furhatConnected && furhat && !hasSentFocusTimerRef.current) {
            furhat.send({
                event_name: 'FocusTimer'
            });
            console.log("FocusTimer event sent successfully");
            // Mark event as sent
            hasSentFocusTimerRef.current = true;
        }
    }, [furhat, furhatConnected]);

    useEffect(() => {
        const checkSchedule = async () => {
            try {
                const response = await axios.get('http://localhost:6005/api/studyPlan/check-current-week', { withCredentials: true });
                if (response.data.scheduleExists) {
                    setIsScheduleGenerated(true);
                    setSchedule(response.data.schedule);
                    console.log("response.data[0]", response.data.schedule[0])
                    setSelectedDay(response.data.schedule[0].date); 
                }
            } catch (error) {
                console.error('Error checking schedule:', error);
                setError(error.message || 'An error occurred');
            }
        };

        checkSchedule();
    }, []);

    const handleGenerateSchedule = async () => {
        try {           
            const scheduleResponse = await axios.post('http://localhost:6005/api/studyPlan', { withCredentials: true });
            
            console.log('Schedule generated successfully:', scheduleResponse.data);
            setSchedule(scheduleResponse.data);
            console.log("scheduleResponse.data", scheduleResponse.data)
            setIsScheduleGenerated(true);
            setSelectedDay(scheduleResponse.data[0].date); 
        } catch (error) {
            console.error('Error generating schedule:', error);
            setError(error.message || 'An error occurred');
        }
    };

    const handleDayClick = (date) => {
        setSelectedDay(date);
        setActiveSession(null); 
    };

    const handleStartPomodoro = (sessionIndex) => {
        setActiveSession(sessionIndex);
    };

    const renderScheduleForDay = (date) => {
        const daySchedule = schedule.find(day => day.date === date);
        if (!daySchedule) return <p>No sessions scheduled for this day.</p>;
            
        return (
            <div className="focus-window">
                {daySchedule.sessions.map((session, index) => (
                    <div key={index} className="session">
                        
                        <div className="session-task-time">
                            <div className="session-time">
                                <strong>{session.startTime} - {session.endTime}</strong>
                            </div>

                            <div className="session-task">
                                <h3>Study Session</h3>
                                <p>{session.task}</p>
                            </div>
                        </div>

                        <button className="pomodoro-btn" onClick={() => handleStartPomodoro(index)}>Start Pomodoro</button>
                        
                        {activeSession === index && (
                            <PomodoroTimer
                                task={session.task}
                                isActive={activeSession === index}
                                onTimerEnd={() => setActiveSession(null)}
                            />
                        )}
                    </div>

                    
                ))}
            </div>
        );
    };

    return (
        <div className="session-container">
            {error && <div className="error">{error}</div>}
            {!isScheduleGenerated && (
                <button onClick={handleGenerateSchedule}>Generate Schedule</button>
            )}
            {isScheduleGenerated && schedule.length > 0 && (
                <div>
                    <h2>{new Date(selectedDay).toLocaleString('default', { month: 'long' })} {new Date(selectedDay).getFullYear()}</h2>
                    <div className="days">
                        {schedule.map((day, index) => (
                        
                            <button
                                key={index}
                                onClick={() => handleDayClick(day.date)}
                                className={selectedDay === day.date ? 'selected' : ''}
                            >
                                <div className="day">
                                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                </div>

                                <div className="date">
                                    {new Date(day.date).getDate()}
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="day-schedule">
                        {selectedDay && renderScheduleForDay(selectedDay)}
                    </div>
                </div>
            )}
        </div>
    );
}

export default GenerateSchedule;