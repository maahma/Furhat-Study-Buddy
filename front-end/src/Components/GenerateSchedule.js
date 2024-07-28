// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Modal from 'react-modal'; // Make sure to install react-modal

// Modal.setAppElement('#root'); // For accessibility

// function GenerateSchedule() {
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const [studyHoursPerDay, setStudyHoursPerDay] = useState('');
//     const [pomodoroDuration, setPomodoroDuration] = useState('');
//     const [shortBreakDuration, setShortBreakDuration] = useState('');
//     const [longBreakDuration, setLongBreakDuration] = useState('');
//     const [schedule, setSchedule] = useState('');
//     const [classes, setClasses] = useState([]);
//     const [deadlines, setDeadlines] = useState([]);

//     useEffect(() => {
//         console.log("INSIDE USE EFFECT HOOK OF GENERATE SCHEDULE")
//         const fetchClassesAndDeadlines = async () => {
//             try {
//                 const classesResponse = await axios.get("http://localhost:6005/api/classes", { withCredentials: true });
//                 setClasses(classesResponse.data);
//                 console.log("classesResponse.data: ", classesResponse.data)

//                 const deadlinesResponse = await axios.get("http://localhost:6005/api/deadlines", { withCredentials: true });
//                 setDeadlines(deadlinesResponse.data);
//                 console.log("deadlinesResponse.data: ", deadlinesResponse.data)
//             } catch (error) {
//                 console.error('Failed to get classes or deadlines:', error);
//             }
//         };

//         fetchClassesAndDeadlines();
//     }, []);

//     const openModal = () => setModalIsOpen(true);
//     const closeModal = () => setModalIsOpen(false);

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         try {
//             const response = await axios.post('http://localhost:6005/api/schedule', {
//                 userPreferences: {
//                     studyHoursPerDay: parseInt(studyHoursPerDay),
//                     pomodoroDuration: parseInt(pomodoroDuration),
//                     breakDuration: {
//                         short: parseInt(shortBreakDuration),
//                         long: parseInt(longBreakDuration),
//                     },
//                 },
//                 classes: classes,
//                 deadlines: deadlines,
//             });
//             console.log("response.data.schedule: ", response.data.schedule)
//             setSchedule(response.data.schedule);
//             closeModal();
//         } catch (error) {
//             console.error('Error generating schedule:', error);
//         }
//     };

//     return (
//         <div>
//             <button onClick={openModal}>Generate Schedule</button>
//             <Modal
//                 isOpen={modalIsOpen}
//                 onRequestClose={closeModal}
//                 contentLabel="Generate Schedule"
//             >
//                 <h2>Generate Study Schedule</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div>
//                         <label>Study Hours Per Day:</label>
//                         <input
//                             type="number"
//                             value={studyHoursPerDay}
//                             onChange={(e) => setStudyHoursPerDay(e.target.value)}
//                         />
//                     </div>
//                     <div>
//                         <label>Pomodoro Duration (minutes):</label>
//                         <input
//                             type="number"
//                             value={pomodoroDuration}
//                             onChange={(e) => setPomodoroDuration(e.target.value)}
//                         />
//                     </div>
//                     <div>
//                         <label>Short Break Duration (minutes):</label>
//                         <input
//                             type="number"
//                             value={shortBreakDuration}
//                             onChange={(e) => setShortBreakDuration(e.target.value)}
//                         />
//                     </div>
//                     <div>
//                         <label>Long Break Duration (minutes):</label>
//                         <input
//                             type="number"
//                             value={longBreakDuration}
//                             onChange={(e) => setLongBreakDuration(e.target.value)}
//                         />
//                     </div>
//                     <button type="submit">Generate Schedule</button>
//                 </form>
//                 {schedule && (
//                     <div>
//                         <h3>Generated Schedule:</h3>
//                         <pre>{schedule}</pre>
//                     </div>
//                 )}
//                 <button onClick={closeModal}>Close</button>
//             </Modal>
//         </div>
//     );
// }

// export default GenerateSchedule;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Make sure to install react-modal

Modal.setAppElement('#root'); // For accessibility

function GenerateSchedule() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [studyHoursPerDay, setStudyHoursPerDay] = useState('');
    const [pomodoroDuration, setPomodoroDuration] = useState('');
    const [shortBreakDuration, setShortBreakDuration] = useState('');
    const [longBreakDuration, setLongBreakDuration] = useState('');
    const [preferences, setPreferences] = useState('');
    const [error, setError] = useState(null)

    const [schedule, setSchedule] = useState('');
    // const [classes, setClasses] = useState([]);
    // const [deadlines, setDeadlines] = useState([]);


    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userPreferences = {
            studyHoursPerDay: parseInt(studyHoursPerDay),
            pomodoroDuration: parseInt(pomodoroDuration),
            breakDuration: {
                short: parseInt(shortBreakDuration),
                long: parseInt(longBreakDuration),
            }
        }

        try {
            const response = await axios.post('http://localhost:6005/api/preferences', 
                userPreferences, {  withCredentials: true });

            console.log('Preferences stored successfully:', response.data);
            setPreferences(response.data);

            // Generate schedule using the stored preferences, classes, and deadlines
            const scheduleResponse = await axios.post('http://localhost:6005/api/schedule', {}, { withCredentials: true });
            
            console.log('Schedule generated successfully:', scheduleResponse.data);
            setSchedule(scheduleResponse.data);
            
            closeModal();
        } catch (error) {
            console.error('Error setting preferences:', error);
        }
    };

    return (
        <div>
            <button onClick={openModal}>Generate Schedule</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Generate Schedule"
            >
            <h2>Generate Study Schedule</h2>
            <form onSubmit={handleSubmit}>
                <div>
                        <label>Study Hours Per Day:</label>
                        <input
                            type="number"
                            value={studyHoursPerDay}
                            onChange={(e) => setStudyHoursPerDay(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Pomodoro Duration (minutes):</label>
                        <input
                            type="number"
                            value={pomodoroDuration}
                            onChange={(e) => setPomodoroDuration(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Short Break Duration (minutes):</label>
                        <input
                            type="number"
                            value={shortBreakDuration}
                            onChange={(e) => setShortBreakDuration(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Long Break Duration (minutes):</label>
                        <input
                            type="number"
                            value={longBreakDuration}
                            onChange={(e) => setLongBreakDuration(e.target.value)}
                        />
                    </div>
                    <button type="submit">Generate Schedule</button>
                    {error && <div className='error'>ERROR OCCURED IN THE PREFERENCES FORM: {error}</div>}
                </form>
                {schedule && (
                    <div>
                        <h3>Generated Schedule:</h3>
                        <pre>{schedule}</pre>
                    </div>
                )}
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
}

export default GenerateSchedule;