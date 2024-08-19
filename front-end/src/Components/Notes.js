import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useFurhat } from '../Context/FurhatContext';

const Notes = () => {
    const [notes, setNotes] = useState('')
    const [error, setError] = useState(null)

    const [quiz, setQuiz] = useState(null); // State for quiz data
    const { furhat, furhatConnected } = useFurhat();

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

            if (furhatConnected && furhat) {
                furhat.send({
                    event_name: 'QuizMe',
                    data: quizData
                });
                console.log("QuizMe event sent successfully")
            } else {
                console.log("Furhat is not connected in the Quiz component");
            }
        } catch (error) {
            console.error('Error posting notes:', error);
        }
    };

    if (furhatConnected && furhat) {
        furhat.send({
            event_name: 'QuizPage'
        });
    }
    
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


            {/* Display the quiz if it exists */}
            {quiz && (
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
            )}

        </div>
    );
}

export default Notes