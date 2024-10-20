import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import "../styles/Form.css";

function Form({ route, type }) {
    // Form state management
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); 
    const [errors, setErrors] = useState({}); 
    const [username, setUsername] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic client-side validation
        if (type === 'Register' && (!firstName || !lastName || !email || !password || !username)) { 
            setErrors({ all: 'Please fill in all fields' }); 
            setLoading(false);  
            return;
        }
        if (type === 'Login' && (!email || !password)){
            setErrors({ all: 'Please fill in all fields' }); 
            setLoading(false);  
            return;
        }

        try {
            let res;
            if (type === 'Login') {
                res = await api.post(route, { email, password });
            } else {
                res = await api.post(route, { firstName, lastName, username, email, password });
            }

            if (res && res.data) {
                if (type === 'Login') {
                    localStorage.setItem(ACCESS_TOKEN, res.data.access);
                    localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                    navigate("/");  
                } else {
                    setErrors({});
                    setSuccess(true);
                }
            } else {
                throw new Error("Unexpected response structure");
            }
        } catch (err) {
            if (err.response) {
                const errorMessages = err.response.data;
                if (typeof errorMessages === 'string') {
                    setErrors({ all: errorMessages });
                } else {
                    setErrors(type === "Login" ? { all: errorMessages.detail || "Account likely doesn't exist." } : errorMessages);
                }
            } else {
                setErrors({ all: "An unexpected error occurred. Please try again." });
            }
        } finally {
            setLoading(false);  
        }
    };

    return (
       
        <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
            <h1 className="title-form">{type} Form</h1>
            {errors.all && <p className='error'>{errors.all}</p>}
            {success && <p className='success'>Verify email, please check your inbox.</p>}
            {type === 'Register' && (
                <>
                    <input
                        className="itemInBox"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name*"
                    />
                    <input
                        className="itemInBox"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name*"
                    />
                    {errors.username && <p className="error">{errors.username}</p>}
                    <input
                        className="itemInBox"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username*"
                    />
                </>
            )}
            {errors.email && <p className="error">{errors.email}</p>} 
            <input
                className="itemInBox"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email*"
            />
            {errors.password && <p className="error">{errors.password}</p>}
            <input
                className="itemInBox"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password*"
            />
            <button className="sign" type="submit" disabled={loading}>
                {loading ? 'Loading...' : type}
            </button>
            {type === "Register" && <p className="form-link"><Link to="/login">Already have an account?</Link></p>}
            {type === "Login" && (
                <>
                    <p className="form-link"><Link to="/register">Don't have an account?</Link></p>
                    <p className="form-link"><Link to="/forgot-password">Forgot password?</Link></p>
                </>
            )}
        </form>
        </div>
        
    );
}

export default Form;