import { useState, useEffect } from 'react';
import axios from 'axios';

function useCsrfToken() {
    const [csrfToken, setCsrfToken] = useState(null);
    const BASE_API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        async function fetchCsrfToken() {
            try {
                axios.defaults.withCredentials = true; // Ensure cookies are sent
                const response = await axios.get(`${BASE_API_URL}/api/csrf-token/`);
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Failed to fetch CSRF token:', error);
            }
        }

        fetchCsrfToken();
    }, []);

    return csrfToken;
}

export default useCsrfToken;

