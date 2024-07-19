import React, { useEffect, useState } from "react";
import "../style/navbar.css";
import {NavLink} from "react-router-dom";
import axios from "axios"

const Navbar = () => {
    const [userdata, setUserData] = useState({});
    console.log("userdata: ", userdata)
    
    const getUser = async () => {
        try {
            const response = await axios.get("http://localhost:6005/login/success", {withCredentials: true});
            setUserData(response.data.user)
        } catch (error) {
            console.log("Error getting a response: ", error)
        }
    }   

    // LOGOUT FUNCTION
    const logout = () => {
        const googleLogoutUrl = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000";
        // window.open("http://localhost:6005/logout", "_self")
        window.location.href = googleLogoutUrl;
    }
    

    useEffect(() => {
        getUser()
    }, [])

    return (
        <>
            <header>
                <nav>
                    
                    <div className="right-side">
                        <ul>
                            <li>
                                <NavLink to="/">
                                    Home
                                </NavLink>
                            </li>
                            {
                                Object?.keys(userdata)?.length > 0 ? (
                                    <>
                                        <li className="user-name">
                                            {userdata?.displayName}
                                        </li>
                                        <li>
                                            <NavLink to="/dashboard">
                                                Dashboard
                                            </NavLink>
                                        </li>

                                        <li>
                                            <img src={userdata?.image} alt="user-image" />
                                        </li>

                                        <li onClick={logout}>
                                            Logout
                                        </li>
                                    </>
                                )   : 
                                <li>
                                    <NavLink to="/login">
                                        Login
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