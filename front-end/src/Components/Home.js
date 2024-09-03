import React from "react";
import "../style/home.css"

const Home = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to RORY: Your Intelligent Study Companion!</h1>
            </header>

            <main className="home-main">
                <p>Inspired by the dedicated and curious student Rory Gilmore from <em>Gilmore Girls</em>, RORY is designed to help you excel in your studies with the power of technology and personalized support.</p>
                <img className="rory-gilmore" src="/images/rory-gilmore.gif" alt="rory-gilmore-image" />

                <p>At the heart of RORY is Furhat, an innovative social robot crafted to interact with humans in a natural and engaging manner. With its lifelike face and expressive features, Furhat communicates through speech, facial expressions, and gestures, making every interaction feel as human-like as possible. Furhat's presence enhances the learning experience, creating an environment that is both interactive and supportive.</p>

                <p>RORY also leverages FaceReader, a sophisticated emotion recognition software that analyzes and interprets human facial expressions with precision. By utilizing advanced algorithms and computer vision techniques, FaceReader can accurately detect and classify a wide range of emotions—whether it’s happiness, sadness, anger, or surprise—by examining subtle facial muscle movements.</p>
                
                <h3>What Can RORY Do for You?</h3>

                <ul className="home-list">
                    <li className="list-item">
                        <strong>Create Your Study Schedule:</strong> Plan and manage your study time effectively with RORY’s scheduling tool. Whether you’re preparing for daily lessons or working on an important assignment, RORY will help you make the ideal schedule to stay on track.
                    </li>

                    <li className="list-item">
                        <strong>Engaging Quizzes:</strong> Test your knowledge with interactive quizzes. RORY uses AI technology to generate questions based on your study notes, and the Furhat Robot quizzes you, making learning both efficient and enjoyable.
                    </li>

                    <li className="list-item">
                        <strong>Personalized Support:</strong> Furhat is here to guide you through your study journey, and with the help of FaceReader, Furhat monitors your mood. If you’re feeling overwhelmed, Furhat will suggest calming activities to help you relax and refocus.
                    </li>
                </ul>

                <p className="last-line">Get started with RORY and discover a new way of studying!</p>
            </main>

            <footer id="developer-info">
                <p>Created with ❤️ by <a href="https://github.com/maahma">@maahma</a></p> 
            </footer>
        </div>
    )
}

export default Home