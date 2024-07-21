import { useDeadlineContext } from '../Hooks/useDeadlineContext';

const DisplayDeadline = ({deadlineItem}) => {
    const { deadlines } = useDeadlineContext();

    return (
      <div className="deadlines-list">

        <h2>Your Deadlines</h2>
            {deadlines && deadlines.length > 0 ? (
                deadlines.map((deadlineItem) => (
                <div key={deadlineItem._id} className="deadline-item">
                    <h4>{deadlineItem.title}</h4>
                    <p><strong>Due Date:</strong> {deadlineItem.dueDate}</p>
                </div>
                ))
            ) : (
            <p>No deadlines found.</p>
        )}
      </div>
    );
  };

export default DisplayDeadline