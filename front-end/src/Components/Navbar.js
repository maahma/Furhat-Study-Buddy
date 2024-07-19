import React from "react";
import "../style/navbar.css";
import {NavLink} from "react-router-dom";

const Navbar = () => {
    return (
        <div>
            <header>
                <nav>
                    <div className="left-side">
                        <h1>Welcome</h1>
                    </div>
                    <div className="right-side">
                        <ul>
                            <li>
                                <img src="#" alt="user-image" />
                            </li>

                            <li>
                                <NavLink to="/logout">
                                    Logout
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </div>
    )
}

export default Navbar