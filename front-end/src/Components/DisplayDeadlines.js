import { useDeadlineContext } from '../Hooks/useDeadlineContext';
import "../style/deadlinesList.css";
import { format } from 'date-fns';
import React, { useState } from 'react';
import axios from 'axios';
import UpdateDeadlineForm from './UpdateDeadlineForm'; 

const DisplayDeadline = () => {

  const { deadlines, dispatch } = useDeadlineContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentDeadline, setCurrentDeadline] = useState(null);

  const handleDelete = async (id) => {
      try {
          await axios.delete(`http://localhost:6005/api/deadlines/${id}`, { withCredentials: true });
          dispatch({ type: 'DELETE_DEADLINE', payload: id });
      } catch (error) {
          console.error('Failed to delete deadline:', error);
      }
  };

  const handleUpdateClick = (deadlineItem) => {
    setCurrentDeadline(deadlineItem);
    setIsUpdating(true); // Open the update form modal
  };

  const closeUpdateForm = () => {
      setIsUpdating(false);
      setCurrentDeadline(null);
  };

  return (
      <div className="deadlines-list">
          <h2>Deadlines</h2>
          {deadlines && deadlines.length > 0 ? (
              deadlines.map((deadlineItem) => (
                  <div key={deadlineItem._id} className="deadline-item">
                      <div className="items">
                        <h4>{deadlineItem.title}</h4>
                        <p>{format(new Date(deadlineItem.dueDate), 'EEE, MMM d')}</p>
                      </div>
                      <div className="buttons">
                        <button onClick={() => handleDelete(deadlineItem._id)} title="Delete">
                          <img className="delete-image" src="/images/delete.png" alt="delete-image" />
                        </button>
                        <button onClick={() => handleUpdateClick(deadlineItem)} title="Update">
                          <img className="update-image" src="/images/update.png" alt="update-image" />
                        </button>
                      </div>
                  </div>
              ))
          ) : (
              <p>No deadlines found.</p>
          )}

          {isUpdating && currentDeadline && (
              <UpdateDeadlineForm 
                  deadline={currentDeadline} 
                  onClose={closeUpdateForm} 
              />
          )}
      </div>
  );
};

export default DisplayDeadline