import { useDeadlineContext } from '../Hooks/useDeadlineContext';
import "../style/deadlinesList.css";
import { format } from 'date-fns';
import React from 'react';


const DisplayDeadline = ({deadlineItem}) => {
    const { deadlines } = useDeadlineContext();

    return (
      <div className="deadlines-list">

        <h2>Deadlines</h2>
            {deadlines && deadlines.length > 0 ? (
                deadlines.map((deadlineItem) => (
                <div key={deadlineItem._id} className="deadline-item">
                    <h4>{deadlineItem.title}</h4>
                    <p>{format(new Date(deadlineItem.dueDate), 'EEE, MMM d')}</p>
                </div>
                ))
            ) : (
            <p>No deadlines found.</p>
        )}
      </div>
    );
  };

export default DisplayDeadline