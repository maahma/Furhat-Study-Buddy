import React, { useState } from 'react';
import { useClassContext } from '../Hooks/useClassContext';
import axios from 'axios';
import "../style/updateClasses.css";

const UpdateClassForm = ({ classItem, onClose, dispatch }) => {
    const [title, setTitle] = useState(classItem.title);
    const [starttime, setStarttime] = useState(classItem.starttime);
    const [endtime, setEndtime] = useState(classItem.endtime);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedClass = { title, starttime, endtime };
            const response = await axios.put(`http://localhost:6005/api/classes/${classItem._id}`, updatedClass, { withCredentials: true });
            dispatch({ type: 'UPDATE_CLASS', payload: response.data });
            onClose();
        } catch (error) {
            console.error('Failed to update class:', error);
        }
    };

    return (
        <div className="update-class-form">
            <h3>Update Class</h3>
            <form onSubmit={handleUpdate}>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Start Time </label>
                    <input type="time" value={starttime} onChange={(e) => setStarttime(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>End Time</label>
                    <input type="time" value={endtime} onChange={(e) => setEndtime(e.target.value)} />
                </div>

                <button type="submit">Update</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default UpdateClassForm;