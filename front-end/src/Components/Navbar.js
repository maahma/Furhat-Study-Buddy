import React, { useEffect, useState } from "react";
import "../style/navbar.css";
import {NavLink} from "react-router-dom";
import axios from "axios";

const Navbar = () => {
    const [userdata, setUserData] = useState({});
    
    const getUser = async () => {
        try {
            const response = await axios.get("http://localhost:6005/login/success", {withCredentials: true});
            setUserData(response.data.user)
            console.log("response.data.user in Navbar is: ", response)
            if(!response.data.user.image){
                console.log("NO USER IMAGE SET")
            }
        } catch (error) {
            console.log("Error getting a response: ", error)
        }
    }   

    // LOGOUT FUNCTION
    const logout = () => {
        window.open("http://localhost:6005/logout", "_self")
    }
    

    useEffect(() => {
        getUser()
    }, [])

    return (
        <>
            <header>
                <nav>
                    <div className="left-side">
                        RORY
                    </div>
                    <div className="right-side">
                        <ul>
                            <li className="home">
                                <NavLink to="/">
                                    <img className="home-image" src="/images/home.png" alt="home-image" title="Home" />
                                </NavLink>
                            </li>
                            {
                                Object?.keys(userdata)?.length > 0 ? (
                                    <>
                                    
                                        <li className="dashboard">
                                            <NavLink to="/dashboard">
                                                <img className="dashboard-image" src="/images/calendar.png" alt="dashboard-image" title="Dashboard" />
                                            </NavLink>
                                        </li>

                                        <li className="pomodoro">
                                            <NavLink to="/pomodoroFocus">
                                                <img className="pomodoro-image" src="/images/pomodoro.png" alt="pomodoro-image" title="Schedule" />
                                            </NavLink>
                                        </li>

                                        <li className="quiz">
                                            <NavLink to="/quiz">
                                                <img className="quiz-image" src="/images/quiz.png" alt="quiz-image" title="Quiz" />
                                            </NavLink>
                                        </li>

                                        <li className="logout" onClick={logout}>
                                            <img className="logout-image" src="/images/logout.png" alt="logout-image" title="Logout" />
                                        </li>


                                        <li className="user-details">
                                            <div className="user-image">
                                                <img src={userdata?.image} alt="user-image" />
                                            </div>
                                            <div className="user-name">
                                                <span>{userdata.name}</span>
                                            </div>

                                        </li>                                        
                                    </>
                                )   : 
                                <li>
                                    <NavLink to="/login">
                                        <img className="login-image" src="/images/logout.png" alt="login-image" title="Login"/>
                                    </NavLink>
                                </li>
                            }
                        </ul>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Navbar