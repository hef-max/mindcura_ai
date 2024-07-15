"use client"
import { useEffect } from "react";

const Modal = ({ show, onClose, children }) => {
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [show]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition duration-200" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">Kontak Terapis</h2>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
