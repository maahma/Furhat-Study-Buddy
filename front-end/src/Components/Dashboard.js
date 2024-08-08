import React, {useState, useEffect} from "react";
import "../style/dashboard.css"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import ClassForm from "./ClassForm";
import DeadlinesForm from "./DeadlinesForm"
import DisplayClass from "./DisplayClass"
import DisplayDeadlines from "./DisplayDeadlines"
import WeeklyCalendar from "./WeeklyCalendar"
import Furhat from "furhat-gui";
import FurhatConnect from "./FurhatConnect";

const Dashboard = () => {

    const navigate = useNavigate();
    const [userdata, setUserData] = useState({});
    const [userName, setUserName] = useState("")
    const [showDeadlineForm, setShowDeadlineForm] = useState(false);
    const [showClassForm, setShowClassForm] = useState(false);

    const getUser = async () => {
        try {
            const response = await axios.get("http://localhost:6005/login/success", {withCredentials: true});
            setUserData(response.data.user);
            console.log("response", response.data.user)
            setUserName(response.data.user.name)
            // console.log("BEFORE SENDING TO FURHAT USERNAME IS: ", response.data.user.name)

        } catch (error) {
            navigate("*")
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    // METHOD 1
    // useEffect(() => {
    //     if (userName) {
    //         // Optionally send a greeting to Furhat when user data is available
    //         window.FurhatGUI.send({ type: 'say', message: `Welcome, ${userName}` });
    //     }
    // }, []);

    // FROM BEN'S CODE
    // furhat.send({
    //     event_name: "GreetingUser",
    //     data: userName
    // })

    const toggleDeadlineForm = () => {
        setShowDeadlineForm(!showDeadlineForm);
        setShowClassForm(false); // Hide class form when deadline form is toggled
      };
    
      const toggleClassForm = () => {
        setShowClassForm(!showClassForm);
        setShowDeadlineForm(false); // Hide deadline form when class form is toggled
      };

    return (
        <div className="dashboard-container">
            {/*METHOD 2*/}
            <FurhatConnect/>

            {Object.keys(userdata).length > 0 ? (
                <div className="some-container">
                    <div className="heading">
                        <h2 className="greetings-user">Welcome, {userdata.displayName}</h2>
                    
                        <div className="button-group">
                            <button className="class-button" onClick={toggleClassForm}>
                                {showClassForm ? 'Hide Class Form' : 'Add Class'}
                            </button>

                            <button className="deadlines-button" onClick={toggleDeadlineForm}>
                                {showDeadlineForm ? 'Hide Deadline Form' : 'Add Deadline'}
                            </button>
                        </div>

                    </div>

                    {showDeadlineForm && <DeadlinesForm />}
                    {showClassForm && <ClassForm />}

                    <div className="class-deadlines-container">
                        <div className="calendar-container">
                            <WeeklyCalendar />
                        </div>


                        <div className="deadlines-list-container">
                            <DisplayDeadlines />
                        </div>
                    </div>
                    
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default Dashboard