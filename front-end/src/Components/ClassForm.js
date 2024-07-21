import { useState, useEffect } from 'react'
import axios from 'axios'
import { useClassContext } from '../Hooks/useClassContext';

const ClassForm = ({ user, setClasses }) => {
    const { dispatch } = useClassContext();

    const [title, setTitle] = useState('')
    const [day, setDay] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [repeat, setRepeat] = useState(false)
    const [error, setError] = useState(null)
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        const classItem = {
            title,
            day,
            starttime: startTime,
            endtime: endTime,
            repeat
        }

        try{
            const response = await axios.post("http://localhost:6005/api/classes",
                classItem, {  withCredentials: true });
            
                console.log('Class created successfully:', response.data);
            
            // RESET THE FORM IF THE CLASS WAS ADDED 
            setTitle('')
            setDay('')
            setStartTime('')
            setEndTime('')
            setRepeat(false)
            setError(null)
            dispatch({ type: 'CREATE_CLASS', payload: response.data });        
        
        } catch (error) {
            console.error('Error creating class:', error);
        }
    };
        
    return (
        <div className="class-form">
            <h3>Add a new class</h3>
            
            <form className="create" onSubmit={handleSubmit}>
                
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Day</label>
                    <select value={day} onChange={(e) => setDay(e.target.value)} required>
                        <option value="">Select Day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Start Time</label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>End Time:</label>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Repeat:</label>
                    <input type="checkbox" checked={repeat} onChange={(e) => setRepeat(e.target.checked)} />
                </div>

                <button type="submit">Add class</button>

                {error && <div className='error'>ERROR OCCURED IN THE FORM: {error}</div>}
            </form>
        </div>
    )  
}

export default ClassForm