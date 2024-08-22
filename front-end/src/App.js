import {Routes, Route} from "react-router-dom"
import Dashboard from "./Components/Dashboard"
import Login from "./Components/Login"
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Error from './Components/Error';
import Notes from './Components/Notes';
import GenerateSchedule from './Components/GenerateSchedule';
import { ClassesContextProvider } from './Context/ClassesContext';
import { DeadlinesContextProvider } from './Context/DeadlinesContext';
import { FurhatContextProvider } from './Context/FurhatContext'
import "./style/app.css"
import React, {useEffect, useState} from "react";

function App() {

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

                <Route path='/pomodoroFocus' element={<GenerateSchedule />} />

                <Route path="/quiz" element={<Notes />} />

                <Route path='*' element={<Error />} />

              </Routes>
            </div>
          </FurhatContextProvider>
        </DeadlinesContextProvider>
      </ClassesContextProvider>
    );
}

export default App;
