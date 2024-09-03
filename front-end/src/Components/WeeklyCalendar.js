import React, { useState, useEffect, useContext } from 'react';
import { format, startOfWeek, addWeeks, subWeeks, eachDayOfInterval, endOfWeek, startOfDay } from 'date-fns';
import axios from 'axios';
import { ClassesContext } from '../Context/ClassesContext';
import "../style/weeklyCalendar.css";

import UpdateClassForm from './UpdateClassForm';

const Calendar = () => {
  const [startDate, setStartDate] = useState(new Date());
  const { classes, dispatch } = useContext(ClassesContext);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);

  // Fetch classes from the server
  const fetchClasses = async () => {
    try {
      const start = startOfWeek(startDate, { weekStartsOn: 1 }); // Monday start
      const endDate = endOfWeek(startDate, { weekStartsOn: 1 }); // End of the current week
      const response = await axios.get('http://localhost:6005/api/classes', {
        params: {
          startDate: start.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      dispatch({ type: 'SET_CLASSES', payload: response.data });
      console.log('Fetched classes are:', classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [startDate]);

  // Calculate the start and end dates of the current week
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 }); // Monday start
  const weekEnd = endOfWeek(startDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  });


  const handleNextWeek = () => {
    setStartDate(addWeeks(startDate, 1));
  };

  const handlePreviousWeek = () => {
    setStartDate(subWeeks(startDate, 1));
  };



  // Handle delete class
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:6005/api/classes/${id}`, { withCredentials: true });
      dispatch({ type: 'DELETE_CLASS', payload: id });
    } catch (error) {
      console.error('Failed to delete class:', error);
    }
  };

  // Handle update class click
  const handleUpdateClick = (classItem) => {
    setCurrentClass(classItem);
    setIsUpdating(true);
  };

  const closeUpdateForm = () => {
    setIsUpdating(false);
    setCurrentClass(null);
  };

  return (
    <>
      <div className="calendar-header">
        <button className="previous-week" onClick={handlePreviousWeek}>
          <img src="/images/left-arrow.png" alt="left-arrow" title="Previous Week" />
        </button>

        <h2 className='calendar-date'>{format(weekStart, 'MMMM yyyy')}</h2>

        <button className="next-week" onClick={handleNextWeek}>
          <img src="/images/right-arrow.png" alt="right-arrow" title="Next Week" />
        </button>
      </div>

      <div className="calendar-grid">
        {weekDays.map((day) => {
          const dayClasses = classes.filter(
            (classItem) => {
              const classDate = new Date(classItem.date);
              return classDate.toDateString() === day.toDateString();
            }
          );
          
          return (
            <div key={day.toDateString()} className="calendar-day">
              <h3>{format(day, 'EEE d')}</h3>
              {dayClasses.length ? (
                dayClasses.map((classItem) => (
                  <div key={classItem._id} className="class-item">
                    <div className="class-title-time">
                      <h4>{classItem.title}</h4>
                      <p>{classItem.starttime} - {classItem.endtime}</p>
                    </div>

                    <div className="class-buttons">
                      <button onClick={() => handleDelete(classItem._id)} title="Delete">
                        <img className="delete-image" src="/images/delete.png" alt="delete-image" />
                      </button>
                      <button onClick={() => handleUpdateClick(classItem)} title="Update">
                        <img className="update-image" src="/images/update.png" alt="update-image" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No classes</p>
              )}
            </div>
          );
        })}
      </div>

      {isUpdating && currentClass && (
        <UpdateClassForm 
          classItem={currentClass} 
          onClose={closeUpdateForm} 
          dispatch={dispatch} // Pass dispatch to update the state after update
        />
      )}
    </>
  );
};

export default Calendar;