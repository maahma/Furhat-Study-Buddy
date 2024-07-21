import { useClassContext } from '../Hooks/useClassContext';


const DisplayClass = ({classItem}) => {
    const { classes } = useClassContext();

    return (
      <div className="class-list">

        <h2>Your Classes</h2>
            {classes && classes.length > 0 ? (
                classes.map((classItem) => (
                <div key={classItem._id} className="class-item">
                    <h4>{classItem.title}</h4>
                    <p><strong>Day:</strong> {classItem.day}</p>
                    <p><strong>Start Time:</strong> {classItem.starttime}</p>
                    <p><strong>End Time:</strong> {classItem.endtime}</p>
                </div>
                ))
            ) : (
            <p>No classes found.</p>
        )}
      </div>
    );
  };

export default DisplayClass