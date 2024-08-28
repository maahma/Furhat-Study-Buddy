import React, { useState, useEffect, useContext } from 'react';
import { format, startOfWeek, addWeeks, subWeeks, eachDayOfInterval, endOfWeek, startOfDay } from 'date-fns';
import axios from 'axios';
import { ClassesContext } from '../Context/ClassesContext';
import "../style/weeklyCalendar.css";


const Calendar = () => {
  const [startDate, setStartDate] = useState(new Date());
  const { classes, dispatch } = useContext(ClassesContext);

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

  return (
    <>
      <div className="calendar-header">
        <button className="previous-week" onClick={handlePreviousWeek}><img src="/images/left-arrow.png" alt="left-arrow" /></button>
        <h2 className='calendar-date'>{format(weekStart, 'MMMM yyyy')}</h2>
        <button className="next-week" onClick={handleNextWeek}><img src="/images/right-arrow.png" alt="left-arrow" /></button>
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
                    <div className="class-title">
                      <h4>{classItem.title}</h4>
                    </div>
                    <div className="class-time">
                      <p>{classItem.starttime} - {classItem.endtime}</p>
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
    </>
  );
};

export default Calendar;