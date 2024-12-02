import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const useFetchWithAuth = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('token');

        console.log(token);
        
        if (!token) {
            navigate('/');
            return;
        }

        const headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setData(result);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [url, navigate, options.headers]); 

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, error, loading };
};

export default useFetchWithAuth;
