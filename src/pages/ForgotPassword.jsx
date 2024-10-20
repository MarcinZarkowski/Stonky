import "../styles/Form.css"
import { useState } from "react"

function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState("")

    const BASE_API_URL = import.meta.env.VITE_API_URL;
  
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (email.length === 0) {
            setError("Please input your email")
            setLoading(false)
            return;
        }

        try {
            const response = await fetch(`${BASE_API_URL}/api/request-password-change/?email=${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            const responseData = await response.json();

            if (!response.ok) {
                setError(responseData.message || "Something went wrong. Please try again.");
            } else {
                setSuccess(responseData.message)
                setError(""); 
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container" >
            <form className="form" onSubmit={handleSubmit}>
                <h1 className="title">Change Password</h1>
                <p className="description">Please input your email to send a password reset email.</p>
                {success && <p className="success">{success}</p>}
                {error && <p className="error">{error}</p>}
                <input
                    className="itemInBox"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Input your email*"
                />
                <button className="sign" type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Send email'}
                </button>
            </form>
        </div>
    )
}

export default ForgotPassword;