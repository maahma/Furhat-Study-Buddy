import React from "react";
import "../style/login.css"

const Login = () => {

    const loginWithGoogle = () => {
        window.open("http://localhost:6005/auth/google/callback", "_self")
    }

    return (
        <div className="login-page">
            <h1>Get studying</h1>
            <button className="login-with-google" onClick={loginWithGoogle}>
                <img className="google-image" src="/images/google-symbol.png" alt="google-image" />
                SIGN IN WITH GOOGLE
            </button>
        </div>
    )
}

export default Login