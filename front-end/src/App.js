import {Routes, Route} from "react-router-dom"
import Dashboard from "./Components/Dashboard"
import Login from "./Components/Login"
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Error from './Components/Error';
import Quiz from './Components/Quiz';
import GenerateSchedule from './Components/GenerateSchedule';
import PomodoroFocus from './Components/PomodoroFocus';
import { ClassesContextProvider } from './Context/ClassesContext';
import { DeadlinesContextProvider } from './Context/DeadlinesContext';
import "./style/app.css"
import {useEffect, useState} from "react";
// import Furhat from "furhat-gui";
import FurhatGUI, { Furhat } from 'furhat-gui'

function App() {

    // const [furhat, setFurhat] = useState(null);
    //
    // useEffect(() => {
    //     const connect = async () => {
    //         try {
    //             console.log("[App.js] Connecting to Furhat...");
    //             const connection = await Furhat();
    //             console.log("connection established with Furhat")
    //             setFurhat(connection);
    //
    //             if (!connection) {
    //                 console.log("[App.js] Connection failed.")
    //                 return
    //             }
    //             console.log("[App.js] Connection success!")
    //
    //             // Send a greeting message to Furhat
    //             try {
    //                 connection.subscribe({
    //                     event_name: "furhatos.app.studdybuddy.GreetingEvent", // Example event
    //                     message: "Hi, I'm Furhat!"
    //                 });
    //                 console.log("Sent greeting message to Furhat.");
    //             } catch (sendError) {
    //                 console.error("[App.js] Error sending message to Furhat:", sendError);
    //             }
    //
    //             console.log("Sent greeting message to Furhat.");
    //
    //             // connection.subscribe('furhatos.app.studdybuddy.UserLoginEvent', (data) => {
    //             //     console.log("[App.js] Subscribing to UserLoginEvent event...", data);
    //             // })
    //         } catch (e) {
    //             console.error("[App.js] Error connecting to Furhat:", e);
    //
    //             // Log the error response if possible
    //             if (e.response) {
    //                 console.error("[App.js] Response data:", e.response.data);
    //                 console.error("[App.js] Response status:", e.response.status);
    //                 console.error("[App.js] Response headers:", e.response.headers);
    //             }
    //         }
    //     }
    //
    //     connect()
    // }, [])
    //

    return (
    <ClassesContextProvider>
      <DeadlinesContextProvider>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<Dashboard/>} />

          <Route path='/pomodoroFocus' element={<PomodoroFocus />} />

          <Route path="/quiz" element={<Quiz />} />

          <Route path='*' element={<Error />} />

        </Routes>
      </div>
      </DeadlinesContextProvider>
    </ClassesContextProvider>
    );
}

export default App;
