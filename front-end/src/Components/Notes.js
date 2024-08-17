import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Notes = () => {
    const [notes, setNotes] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const notesItem = {notes}

        try{
            const response = await axios.post("http://localhost:6005/api/notes",
                notesItem, {  withCredentials: true });
            
                console.log('Notes created successfully:', response.data);
            
            // RESET THE FORM IF NOTES WERE ADDED 
            setNotes('')      
            setError(null);
        } catch (error) {
            console.error('Error posting notes:', error);
        }
    };

    return (
        <div className="notes-form">
            <h3>Add your Study Notes so I can quiz you</h3>

            <form className="create" onSubmit={handleSubmit}>
                <div className="form-group">
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        required
                        placeholder="Enter your study notes here..."
                        rows="10"
                        cols="50"
                    />
                </div>

                <button type="submit">Add notes</button>

                {error && <div className='error'>ERROR OCCURRED IN THE FORM: {error}</div>}
            </form>
        </div>
    );
}

export default Notes