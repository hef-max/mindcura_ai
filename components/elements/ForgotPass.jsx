"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: '--font-poppins'
});

const ResetPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(new Array(6).fill(''));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const inputRefs = useRef([]);
    const router = useRouter();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/send_verification_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {
                setStep(2);
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            setError('An error occurred while sending the verification code.');
        }
    };

    const handleCodeChange = (e, index) => {
        const { value } = e.target;
        if (/^\d*$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);
            // Auto focus to next input
            if (value !== "" && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        try {
            const response = await fetch('/verify_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: verificationCode }),
            });
            if (response.ok) {
                setStep(3);
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            setError('An error occurred while verifying the code.');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await fetch('/update_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, new_password: newPassword }),
            });
            if (response.ok) {
                alert("Password updated successfully!");
                router.push('/login'); // Mengarahkan kembali ke halaman login
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            setError('An error occurred while updating the password.');
        }
    };

    return (
        <div className={poppins.className}>
            <div className={'flex items-center justify-center w-full h-full px-2 py-10 overflow-x-hidden'}>
                <div className="flex flex-col gap-4 w-full sm:w-[60%] h-full shadow-lg p-5 rounded-lg border-t-4 border-primary-600 bg-primary-100">
                    <Link href={"/"}><FontAwesomeIcon icon={faArrowLeft} size="lg" className="cursor-pointer pr-2 text-600" />Kembali</Link>
                    <h1 className="text-2xl font-semibold my-4 text-center">Reset Password</h1>
                    
                    {step === 1 && (
                        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-10 items-center w-full">
                            <div className="flex px-4 py-3 gap-2 items-center bg-white rounded-lg w-[300px] min-w-[300px]">
                                <FontAwesomeIcon icon={faEnvelope} size="lg" className="w-5 h-5" color="#3C81F5"/>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="Email"
                                    className="w-full outline-none border-none bg-transparent p-0"
                                />
                            </div>
                            <button className="bg-primary-600 text-white font-bold cursor-pointer py-2 mb-6 rounded-lg w-full max-w-[300px]">
                                Send Verification Code
                            </button>
                            {error && <div className="text-red-500">{error}</div>}
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleCodeSubmit} className="flex flex-col gap-10 items-center w-full">
                            <div className="flex gap-2">
                                {code.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleCodeChange(e, idx)}
                                        ref={el => inputRefs.current[idx] = el}
                                        className="w-10 h-10 text-center text-xl border border-gray-300 rounded"
                                    />
                                ))}
                            </div>
                            <button className="bg-primary-600 text-white font-bold cursor-pointer py-2 rounded-lg w-full max-w-[300px]">
                                Verify Code
                            </button>
                            {error && <div className="text-red-500">{error}</div>}
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-10 items-center w-full">
                            <div className="flex px-4 py-3 gap-2 items-center bg-white rounded-lg w-full min-w-[300px]">
                                <FontAwesomeIcon icon={faLock} size="lg" className="w-5 h-5" color="#3C81F5"/>
                                <input
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    type="password"
                                    placeholder="New Password"
                                    className="w-full outline-none border-none bg-transparent p-0"
                                />
                            </div>
                            <div className="flex px-4 py-3 gap-2 items-center bg-white rounded-lg w-full min-w-[300px]">
                                <FontAwesomeIcon icon={faLock} size="lg" className="w-5 h-5" color="#3C81F5"/>
                                <input
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    type="password"
                                    placeholder="Confirm New Password"
                                    className="w-full outline-none border-none bg-transparent p-0"
                                />
                            </div>
                            <button className="bg-primary-600 text-white font-bold cursor-pointer py-2 rounded-lg w-full max-w-[300px]">
                                Update Password
                            </button>
                            {error && <div className="text-red-500">{error}</div>}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
