import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate} from 'react-router-dom';
import '../styles/Form.css';

function Verify() {
    const [status, setStatus] = useState(0); // 0: Verifying, 1: Success, 2: Failed
   
    const { token } = useParams();
    const BASE_API_URL = import.meta.env.VITE_API_URL;

   
    const verifyEmail = async () => {
       


        try {
            console.log('Sending request to verify token:', token);

            const response = await fetch(`${BASE_API_URL}/api/validate-email-token/?token=${token}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            console.log('Response received:', response);

            if (response.ok) {
                const data = await response.json();
                console.log('Response data:', data);

                if (data.status === 'success') {
                    setStatus(1); 
                } else {
                    setStatus(2); 
                }
            } else {
                console.error('Response not OK:', response);
                setStatus(2); 
            }
        } catch (error) {
            console.error('Error during verification:', error);
            setStatus(2); 
        }
    };

    useEffect(() => {
        if (token) {
            verifyEmail();
        }
    }, [token]);

    return (
        <div>
            {status === 1 && <Navigate to="/login"></Navigate>}
            {status === 2 && (
                <>
                    <h1 className="failed" style={{color: "white"}}>Verification failed. Token may be old or account may already be verified.</h1>
                    <p style={{color: "white"}}>If you can log in, you have already been verified.</p>
                    <p ><Link to="/login">Try logging in.</Link></p>
                </>
            )}
            {status === 0 && <h1>Verifying your email...</h1>}
        </div>
    );
}

export default Verify;