import React, { useState } from 'react';
import axios from 'axios';

function GenerateSchedule() {
    const [schedule, setSchedule] = useState('');
    const [error, setError] = useState(null);

    const handleGenerateSchedule = async () => {
        try {
            const scheduleResponse = await axios.post('http://localhost:6005/api/studyPlan', { withCredentials: true });
            
            console.log('Schedule generated successfully:', scheduleResponse.data);
            setSchedule(scheduleResponse.data);  

        } catch (error) {
            console.error('Error generating schedule:', error);
            setError(error.message || 'An error occurred');
        }
    };

    return (
        <div>
            <button onClick={handleGenerateSchedule}>Generate Schedule</button>
            {error && <div className='error'>ERROR OCCURED IN THE SCHEDULE GENERATION: {error}</div>}
            {schedule && (
                <div>
                    <h3>Generated Schedule:</h3>
                    <pre>{schedule}</pre>
                </div>
            )}
        </div>
    );
}

export default GenerateSchedule;