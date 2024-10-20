import { useState } from 'react';
import axios from 'axios';
import useCsrfToken from '../components/UseCSRF';
import { useParams,useNavigate } from 'react-router-dom';


function PasswordReset() {
    const [firstPassword, setFirstPassword] = useState('');
    const [secondPassword, setSecondPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(''); 

    const { token } = useParams();
    const csrfToken = useCsrfToken(); 
    console.log(csrfToken);
    const BASE_API_URL = import.meta.env.VITE_API_URL;
    const navigate=useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (firstPassword.length === 0) {
            setError("Please input your new password");
            setLoading(false);
            return;
        }
        if (firstPassword !== secondPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }
        if (firstPassword.length < 8) {
            setError("Password must be at least 8 characters");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${BASE_API_URL}/api/password-change/?token=${token}`, 
                { password: firstPassword },
                { 
                    headers: {
                        'X-CSRFToken': csrfToken, 
    
                    }
                }
            );
            setSuccess(response.data.message);
            setError(""); 
        } catch (error) {
            setError(error.response?.data.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    const handleClick = () => {
        navigate('/login');
    }
    return (
        <div className='form-container'>
            {success && <><h1 className="success">{success}. Please login.</h1><button className="login-link" onClick={handleClick}>Login</button></>}
            {success==="" && <>
                <form className="form" onSubmit={handleSubmit}>
                    <h1 className="title">Change Password</h1>
                    <p className="description">Please input your new password.</p>
                    {error && <p className="error">{error}</p>}
                    <input
                        className="itemInBox"
                        type="password"
                        value={firstPassword}
                        onChange={(e) => setFirstPassword(e.target.value)}
                        placeholder="Input new password*"
                    />
                    <input
                        className="itemInBox"
                        type="password"
                        value={secondPassword}
                        onChange={(e) => setSecondPassword(e.target.value)}
                        placeholder="Re-write new password*"
                    />
                
                    <button className="sign" type="submit" disabled={loading}>
                        {loading ? 'Loading...' : 'Change Password'}
                    </button>
                    
                </form>
            </>}
        </div>
    );
}

export default PasswordReset;