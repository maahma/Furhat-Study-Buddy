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
import { FurhatContextProvider } from './Context/FurhatContext'
import "./style/app.css"
import React, {useEffect, useState} from "react";
import Furhat  from 'furhat-core';
import FurhatGUI from 'furhat-gui';

function App() {

  const address =  'localhost' //'192.168.131.118' 
  const portNumber = 8080      //1932; 
  let callbackFun;
  const [furhatConnected, setFurhatConnected] = useState(false);
  const [furhat, setFurhat] = useState(null);


/////////////////////////////////////////////////////////////////////////////////
// THIS WAS WORKING

//   const FurhatGUI = (callback) => {
//     console.log("Inside the FurhatGUI function");
//     return new Promise((resolve, reject) => {
//         if (callback !== undefined && typeof callback === 'function') {
//             console.log("Inside the if statement of FurhatGUI and connecting to FurhatCore next");
//             let furhat = new Furhat(address, portNumber, 'api');
//             console.log("furhat is: ", furhat);
//             console.log("Trying the furhat init method now");

//             furhat.init()
//                 .then(() => {
//                     console.log("Resolved with Furhat");
//                     resolve(furhat); // Resolve with the Furhat instance
//                 })
//                 .catch((error) => {
//                     console.log("FurhatGUI Promise rejected");
//                     reject(error); // Reject with the error from Furhat.init
//                 });
//         } else {
//             reject(new Error('Callback needs to be a function'));
//         }
//     }).then((furhat) => {
//         // Ensure that the callback is called after Furhat is initialized
//         if (callback) {
//             callback(furhat);
//         }
//     }).catch((error) => {
//         // Handle any errors in the promise chain
//         console.error("Error in FurhatGUI:", error);
//     });
// };
////////////////////////////////////////////////////////////////////////////////////





  // const FurhatGUI = async (callback) => {

  //   // Ensure callback is a function
  //   if (typeof callback !== 'function') {
  //       throw new Error('Callback needs to be a function');
  //   }

  //   try {
  //       let furhatInstance = new Furhat(address, portNumber, 'api');
  //       console.log("furhatInstance in App.js is: ", furhatInstance);

  //       await furhatInstance.init();

  //       // Call the callback with the furhat instance
  //       callback(furhatInstance);

  //       return furhatInstance; // Return the Furhat instance
  //   } catch (error) {
  //       console.error("Error in FurhatGUI:", error);
  //       throw error; // Re-throw the error for further handling
  //   }
  // };

  // useEffect(() => {
    
  //   // Define an async function within the useEffect
  //   const connectToFurhat = async () => {
  //       try {
  //           const hat = FurhatGUI((furhat) => {
  //               setFurhat(furhat);
  //               console.log("Furhat is set", furhat);
  //               setFurhatConnected(true);
  //               console.log("Connected to Furhat successfully!", furhat);
  //           });
  //       } catch (error) {
  //           console.error("Failed to connect to Furhat:", error);
  //       }
  //   };

  //   connectToFurhat();
  // }, []);





////////////////////////////////////////////////////////////////////////////////////
// THIS WAS WORKING BUT REMOVE THE EVENT SO IT ISNT REPEATED
  // useEffect(() => {
  //   console.log("Trying to connect to Furhat from front-end")
  //     // Establish the connection to Furhat
  //     FurhatGUI((hat) => {
  //         // This callback function is triggered once the connection is successful
  //         setFurhat(hat);
  //         console.log("Furhat is set")
  //         setFurhatConnected(true);
  //         console.log("Connected to Furhat successfully!", hat);
  //         hat.send({
  //           event_name: 'furhatos.event.senses.SenseSkillGUIConnected',
  //         })

  //     }).catch((error) => {
  //         if (error.response) {
  //             // The request was made and the server responded with a status code
  //             // that falls out of the range of 2xx
  //             console.log("Error Response Data:", error.response.data);
  //             console.log("Error Response Status:", error.response.status);
  //             console.log("Error Response Headers:", error.response.headers);
  //         } else if (error.request) {
  //             // The request was made but no response was received
  //             console.log("Error Request Data:", error.request);
  //         }
  //         console.log("Failed to connect to Furhat:", error.message);
  //     });
  // }, []);
////////////////////////////////////////////////////////////////////////////////////

    return (
      <ClassesContextProvider>
        <DeadlinesContextProvider>
          <FurhatContextProvider>
            <div className="app-container">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path='/pomodoroFocus' element={<PomodoroFocus />} />

                <Route path="/quiz" element={<Quiz />} />

                <Route path='*' element={<Error />} />

              </Routes>
            </div>
          </FurhatContextProvider>
        </DeadlinesContextProvider>
      </ClassesContextProvider>
    );
}

export default App;
