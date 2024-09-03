import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useFurhat } from '../Context/FurhatContext';
import "../style/notes.css"

const Notes = () => {
    const [notes, setNotes] = useState('')
    const [error, setError] = useState(null)
    const [notesList, setNotesList] = useState('')

    const [quiz, setQuiz] = useState(null); // State for quiz data
    const { furhat, furhatConnected } = useFurhat();


    useEffect(() => {
        if (furhatConnected && furhat) {
            furhat.send({
                event_name: 'QuizPage'
            });
            console.log("QuizPage event sent successfully")
        }
    }, [furhat, furhatConnected])

    // Fetch notes when the component mounts
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.get("http://localhost:6005/api/notes", { withCredentials: true });
                setNotesList(response.data);  // Store the fetched notes in the state
            } catch (error) {
                console.error('Error fetching notes:', error);
                setError('Failed to fetch notes');
            }
        };

        fetchNotes();
    }, []);  

    const handleQuizMe = async (noteId) => {
        try {
            // Fetch the quiz associated with the selected note
            const response = await axios.get(`http://localhost:6005/api/quiz/${noteId}`, { withCredentials: true });
            const quizData = response.data.quiz;

            const formattedQuestions = quizData.questions.map(question => ({
                questionText: question.questionText,
                answerText: question.answer.answerText
            }));
    
            console.log("formattedQuestions inside handleQuizMe is ", formattedQuestions)

            furhat.send({
                event_name: 'QuizMe',
                data: formattedQuestions
            });
            console.log("QuizMe event sent successfully");

        } catch (error) {
            console.error('Error retrieving quiz data:', error);
            setError('Failed to retrieve quiz data');
        }
    };

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

            const quizData = response.data.quiz;
            setQuiz(quizData); // Store the quiz from the response

            const formattedQuestions = quizData.questions.map(question => ({
                questionText: question.questionText,
                answerText: question.answer.answerText
            }));
    
            console.log("formattedQuestions inside handleQuizMe is ", formattedQuestions)

            furhat.send({
                event_name: 'QuizMe',
                data: formattedQuestions
            });
            console.log("QuizMe event sent successfully");

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

                <button type="submit">Quiz Me</button>

                {error && <div className='error'>ERROR OCCURRED IN THE FORM: {error}</div>}
            </form>

            {/* Display notes if they exist */}
            {notesList.length > 0 && (
                <div className="notes-list">
                    <h3>Your Notes</h3>
                    <ul>
                        {notesList.map((note, index) => (
                            <li key={index} className="note-item">
                                <div className="note-preview">
                                    {note.notes.substring(0, 100)}...
                                </div>
                                <button onClick={() => handleQuizMe(note._id)}>Quiz Me</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            

            {/* Display the quiz if it exists */}
            {/* {quiz && (
                <div className="quiz-container">
                    <h3>Generated Quiz</h3>
                    <ul>
                        {quiz.questions.map((q, index) => (
                            <li key={index} className="quiz-item">
                                <div className="question">{index + 1}. {q.questionText}</div>
                                <div className="answer">Answer: {q.answer.answerText}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}

        </div>
    );
}

export default Notes