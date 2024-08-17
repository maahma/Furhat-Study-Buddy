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
import React, {useEffect, useState} from "react";
import Furhat  from 'furhat-core';
import FurhatGUI from 'furhat-gui';
// import FurhatGUI from './Components/FurhatConnect';

function App() {

  const address =  'localhost' //'192.168.131.118' 
  const portNumber = 8080      //1932; 
  let callbackFun;
  const [furhatConnected, setFurhatConnected] = useState(false);
  const [furhat, setFurhat] = useState(null);


  //////////////////////////////////////////////////////////////////////////////////////////////
  const InitCallback = (status, hat) => {
    console.log("Inside the initCallback function")
      if (status === 'open') {
        console.log("status is open")
        hat.send({
          event_name: 'furhatos.event.senses.SenseSkillGUIConnected',
          port: portNumber,
        });
        callbackFun(hat);
      } else if (status === 'closed' || status === 'failed') {
          console.log('Trying to reestablish connection to Furhat');
          hat.init(address, portNumber, 'api', InitCallback);
      }
  };

  // const FurhatGUI = (callback) => {
  //   console.log("Inside the FurhatGUI function");
  //   return new Promise((resolve, reject) => {
  //     if (callback !== undefined && typeof callback === 'function') {
  //       console.log("Inside the if statement of FurhatGUI and connecting to FurhatCore next");
  //       let furhat = new Furhat(address, portNumber, 'api');
  //       console.log("furhat is: ", furhat)
  //       console.log("Trying the furhat init method now")
  //       furhat.init()
  //       .then(() => {
  //         console.log("Resolved with Furhat")
  //         resolve(furhat); // Resolve with the Furhat instance
  //       })
  //       .catch((error) => {
  //         console.log("FurhatGui Promise rejected")
  //         reject(error); // Reject with the error from Furhat.init
  //       });
  //     } else {
  //       reject(new Error('Callback needs to be a function'));
  //     }
  //   })
  // };

  const FurhatGUI = (callback) => {
    console.log("Inside the FurhatGUI function");
    return new Promise((resolve, reject) => {
        if (callback !== undefined && typeof callback === 'function') {
            console.log("Inside the if statement of FurhatGUI and connecting to FurhatCore next");
            let furhat = new Furhat(address, portNumber, 'api');
            console.log("furhat is: ", furhat);
            console.log("Trying the furhat init method now");

            furhat.init()
                .then(() => {
                    console.log("Resolved with Furhat");
                    resolve(furhat); // Resolve with the Furhat instance
                })
                .catch((error) => {
                    console.log("FurhatGUI Promise rejected");
                    reject(error); // Reject with the error from Furhat.init
                });
        } else {
            reject(new Error('Callback needs to be a function'));
        }
    }).then((furhat) => {
        // Ensure that the callback is called after Furhat is initialized
        if (callback) {
            callback(furhat);
        }
    }).catch((error) => {
        // Handle any errors in the promise chain
        console.error("Error in FurhatGUI:", error);
    });
};

  useEffect(() => {
    console.log("Trying to connect to Furhat from front-end")
      // Establish the connection to Furhat
      FurhatGUI((hat) => {
          // This callback function is triggered once the connection is successful
          setFurhat(hat);
          console.log("Furhat is set")
          setFurhatConnected(true);
          console.log("Connected to Furhat successfully!", hat);
          hat.send({
            event_name: 'furhatos.event.senses.SenseSkillGUIConnected',
          })
      }).catch((error) => {
          if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log("Error Response Data:", error.response.data);
              console.log("Error Response Status:", error.response.status);
              console.log("Error Response Headers:", error.response.headers);
          } else if (error.request) {
              // The request was made but no response was received
              console.log("Error Request Data:", error.request);
          }
          console.log("Failed to connect to Furhat:", error.message);
      });
  }, []);
  //////////////////////////////////////////////////////////////////////////////////////////////






    // const [furhat, setFurhat] = useState(null);
    // // console.log("Furhat(): ", Furhat())

    // console.log("Furhat(): ", FurhatGUI())

    // useEffect(() => {
    //   console.log("INSIDE CONNECT WITH FURHAT")
    //     const connect = async () => {
    //         try {
    //             console.log("[App.js] Connecting to Furhat...");
    //             const connection = await FurhatGUI();
    //             console.log("connection established with Furhat")
    //             setFurhat(connection);
    
    //             if (!connection) {
    //                 console.log("[App.js] Connection failed.")
    //                 return
    //             }
    //             console.log("[App.js] Connection success! Furhat is: ", furhat)
    
    //             connection.subscribe('furhatos.app.furgui.FurhatStudyBuddySkill', (data) => {
    //               console.log("[App.js] Subscribing to FurhatStudyBuddySkill event...", data);
    //             })
    //         } catch (e) {
    //             console.error("[App.js] Error connecting to Furhat:", e);
    //         }
    //     }
    //     connect()
    // }, [])

    return (
      <ClassesContextProvider>
        <DeadlinesContextProvider>
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
        </DeadlinesContextProvider>
      </ClassesContextProvider>
    );
}

export default App;
