import React, { useState } from 'react';
import { useDeadlineContext } from '../Hooks/useDeadlineContext';
import axios from 'axios';
import "../style/updateDeadlines.css";

const UpdateDeadlineForm = ({ deadline, onClose }) => {
    const { dispatch } = useDeadlineContext();
    const [title, setTitle] = useState(deadline.title);
    const [dueDate, setDueDate] = useState(deadline.dueDate);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:6005/api/deadlines/${deadline._id}`, { title, dueDate }, { withCredentials: true });
            console.log("Response: ", response)
            dispatch({ type: 'UPDATE_DEADLINE', payload: response.data });
            onClose(); // Close the modal after successful update
        } catch (error) {
            console.error('Failed to update deadline:', error);
        }
    };

    return (
        <div className="update-deadline-form">
            <h2>Update Deadline</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>Due Date</label>
                    <input 
                        type="date" 
                        value={dueDate} 
                        onChange={(e) => setDueDate(e.target.value)} 
                    />
                </div>

                <button className="update-btn" type="submit">Update</button>
                <button className="cancel-btn" type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default UpdateDeadlineForm;