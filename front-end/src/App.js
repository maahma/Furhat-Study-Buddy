import {Routes, Route} from "react-router-dom"
import Dashboard from "./Components/Dashboard"
import Login from "./Components/Login"
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Error from './Components/Error';
import GenerateSchedule from './Components/GenerateSchedule'
import { ClassesContextProvider } from './Context/ClassesContext';
import { DeadlinesContextProvider } from './Context/DeadlinesContext';
import "./style/app.css"

function App() {
  return (
    <ClassesContextProvider>
      <DeadlinesContextProvider>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/schedule" element={<GenerateSchedule />} />

          <Route path='*' element={<Error />} />

        </Routes>
      </div>
      </DeadlinesContextProvider>
    </ClassesContextProvider>
  );
}

export default App;
