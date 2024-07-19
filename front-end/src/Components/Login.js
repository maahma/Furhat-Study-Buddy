import React from "react";
import "../style/login.css"

const Login = () => {

    const loginWithGoogle = () => {
        window.open("http://localhost:6005/auth/google/callback", "_self")
    }

    return (
        <div className="login-page">
            <button className="login-with-google" onClick={loginWithGoogle}>
                SIGN IN WITH GOOGLE
            </button>
        </div>
    )
}

export default Login