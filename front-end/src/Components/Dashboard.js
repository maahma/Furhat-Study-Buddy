import React, {useState, useEffect} from "react";
import "../style/dashboard.css"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import ClassForm from "./ClassForm";
import DeadlinesForm from "./DeadlinesForm"
import DisplayClass from "./DisplayClass"
import DisplayDeadlines from "./DisplayDeadlines"
import WeeklyCalendar from "./WeeklyCalendar"


const Dashboard = () => {

    const navigate = useNavigate();
    const [userdata, setUserData] = useState({});
    const [showDeadlineForm, setShowDeadlineForm] = useState(false);
    const [showClassForm, setShowClassForm] = useState(false);
    
    const getUser = async () => {
        try {
            const response = await axios.get("http://localhost:6005/login/success", {withCredentials: true});
            setUserData(response.data.user);
            console.log("response", response)
        } catch (error) {
            navigate("*")
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    const toggleDeadlineForm = () => {
        setShowDeadlineForm(!showDeadlineForm);
        setShowClassForm(false); // Hide class form when deadline form is toggled
      };
    
      const toggleClassForm = () => {
        setShowClassForm(!showClassForm);
        setShowDeadlineForm(false); // Hide deadline form when class form is toggled
      };

    return (
        <div>
            <h1>Dashboard</h1>
            {Object.keys(userdata).length > 0 ? (
                <div>
                    <div>
                        <h2>Welcome, {userdata.displayName}</h2>
                    
                        <button onClick={toggleDeadlineForm}>
                            {showDeadlineForm ? 'Hide Deadline Form' : 'Add Deadline'}
                        </button>

                        <button onClick={toggleClassForm}>
                            {showClassForm ? 'Hide Class Form' : 'Add Class'}
                        </button>
                    </div>

                    {showDeadlineForm && <DeadlinesForm />}
                    {showClassForm && <ClassForm />}
                    
                    {/* <div className="class-list-container"> 
                        <DisplayClass /> 
                    </div> */}

                    <div className="calendar-container">
                        <WeeklyCalendar />
                    </div>


                    <div className="deadlines-list-container">
                        <DisplayDeadlines />
                    </div>
                    
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default Dashboard