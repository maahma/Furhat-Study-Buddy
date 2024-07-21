import './App.css';
import {Routes, Route} from "react-router-dom"
import Dashboard from "./Components/Dashboard"
import Login from "./Components/Login"
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Error from './Components/Error';
import { ClassesContextProvider } from './Context/ClassesContext';
import { DeadlinesContextProvider } from './Context/DeadlinesContext';


function App() {
  return (
    <ClassesContextProvider>
      <DeadlinesContextProvider>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path='*' element={<Error />} />

        </Routes>
      </div>
      </DeadlinesContextProvider>
    </ClassesContextProvider>
  );
}

export default App;
