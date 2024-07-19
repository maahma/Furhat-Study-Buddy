import './App.css';
import {Routes, Route} from "react-router-dom"
import Dashboard from "./Components/Dashboard"
import Login from "./Components/Login"
import Navbar from './Components/Navbar';
import Home from './Components/Home';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" 
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          } 
        />

      </Routes>
    </div>
  );
}

export default App;
