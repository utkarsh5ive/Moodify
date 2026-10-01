import React, {useState} from 'react'
import "../style/login.scss"
import FormGroup from "../components/FormGroup"
import {Link} from "react-router"
import {useAuth} from "../hooks/useAuth"
import {useNavigate} from "react-router"

const Login = () => {

    const{loading, handleLogin} = useAuth();

    const navigate = useNavigate();

    
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e){
        e.preventDefault();
        const success = await handleLogin({email: identifier, username: identifier, password})
        
        if (success) {
            navigate("/")
        }
    }
    return (
        <main className='auth-page'>
            <div className='form-container solid-panel'>
                <h1>Login</h1>
                <form onSubmit={handleSubmit} >
                    <FormGroup value={identifier} onChange={(e)=>setIdentifier(e.target.value)} label="Email or Username" placeholder="Enter email or username" />
                    <FormGroup value={password} onChange={(e)=>setPassword(e.target.value)} label="Password" type="password" placeholder="Enter your password" />
                    <button className='button' type='submit'>Login</button>
                </form>
                <p>Don't have an account? <Link to="/register" >Register here</Link> </p>
            </div>

        </main>
    )
}

export default Login
