import React from "react";
import {useNavigate} from "react-router-dom"

const Error = () => {

    const navigate = useNavigate();

    return (
        <div>
            <h1>Error! Something went wrong </h1>
            <button style={{cursor:"pointer"}} onClick={()=>navigate("/")}>Back To Home</button>
        </div>
    )
}

export default Error