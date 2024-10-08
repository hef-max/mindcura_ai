'use client'
import { useState, useEffect } from "react";

const useFetchStressLevel = () => {
    const [stressLevel, setStressLevel] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStressLevel = async () => {
            try {
                const response = await fetch("https://backend.mindcura.net/ api/stress_level", {
                    method: "GET",
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error("Belum ada tingkat stres");
                }
                
                const data = await response.json();
                setStressLevel(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchStressLevel();
    }, []);

    return { stressLevel, error };
};

export default useFetchStressLevel;
