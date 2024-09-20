import React, { useState, useEffect } from 'react';
import LoadingBar from 'react-top-loading-bar';

const LoadingPage = ({ setLoadingComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(interval);
                    setLoadingComplete();
                    return 100;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 500);

        return () => {
            clearInterval(interval);
        };
    }, [setLoadingComplete]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-primary-100 z-50">
            <LoadingBar color="#007bff" progress={progress} />
            <div className="text-2xl font-semibold mt-4 text-black">Loading...</div>
        </div>
    );
};

export default LoadingPage;
