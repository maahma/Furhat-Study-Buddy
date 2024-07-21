import { useState, useEffect } from 'react'
import axios from 'axios'
import { useDeadlineContext } from '../Hooks/useDeadlineContext';


const DeadlinesForm = ({ user, setDeadlines }) => {
    const { dispatch } = useDeadlineContext();

    const [title, setTitle] = useState('')
    const [dueDate, setdueDate] = useState('')
    const [error, setError] = useState(null)
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        const deadlinesItem = {
            title,
            dueDate
        }

        try{
            const response = await axios.post("http://localhost:6005/api/deadlines",
                deadlinesItem, {  withCredentials: true });
            
                console.log('Deadline created successfully:', response.data);
            
            // RESET THE FORM IF THE DEADLINE WAS ADDED 
            setTitle('')
            setdueDate('')
            setError(null)        
            dispatch({ type: 'CREATE_DEADLINE', payload: response.data }); 
        
        } catch (error) {
            console.error('Error creating deadline:', error);
        }
    };
        
    return (
        <div className="deadline-form">
            <h3>Add a new deadline</h3>
            
            <form className="create" onSubmit={handleSubmit}>
                
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Due Date</label>
                    <input type="date" value={dueDate} onChange={(e) => setdueDate(e.target.value)} required />
                </div>
                
                <button type="submit">Add Deadline</button>

                {error && <div className='error'>ERROR OCCURED IN THE FORM: {error}</div>}
            </form>
        </div>
    )  
}

export default DeadlinesForm