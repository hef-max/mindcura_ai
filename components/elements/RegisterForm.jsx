"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({ 
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: '--font-poppins'
});

export default function RegisterForm() {
    const [username, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [JK, setJK] = useState("");
    const [birth, setBirth] = useState("");
    const [birthError, setBirthError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const router = useRouter();

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long';
        } else if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            return 'Password must contain uppercase, lowercase, number, and special character';
        } else {
            return '';
        }
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const error = validatePassword(newPassword);
        setPasswordError(error);
        if (confirmPassword) {
            setConfirmPasswordError(newPassword !== confirmPassword ? 'Passwords do not match' : '');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        setConfirmPasswordError(newConfirmPassword !== password ? 'Passwords do not match' : '');
    };

    const handleBirthChange = (e) => {
        const newBirth = e.target.value;
        setBirth(newBirth);
        const today = new Date();
        const birthDate = new Date(newBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        if (birthDate > today) {
            setBirthError('Tanggal lahir tidak boleh lebih dari tanggal sekarang');
        } else if (age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
            setBirthError('Usia harus lebih dari atau sama dengan 18 tahun');
        } else {
            setBirthError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !email || !password || !JK || !birth ) {
            setError("All fields are necessary.");
            return;
        }

        try {
            
            const res = await fetch("http://localhost:5001/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    JK,
                    birth
                }),
            });

            if (res.ok) {
                const form = e.target;
                form.reset();
                router.push("/");
            } else {
                console.log("User registration failed.");
            }
        } catch (error) {
            console.log("Error during registration: ", error);
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center w-full h-full px-2 py-10 overflow-x-hidden ${poppins.className}`}>
            <div className="flex flex-col gap-4 w-full sm:w-[60%] h-full shadow-lg p-5 rounded-lg border-t-4 border-primary-600 bg-primary-100">
                <h1 className="text-2xl font-semibold my-4 text-center">Daftar</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-10 items-center">
                    <div className="flex gap-4 flex-wrap justify-center">
                        <div className="flex px-4 py-3 gap-2 items-center bg-white rounded-lg w-[45%] min-w-[300px]">
                            <input
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                placeholder="Nama Lengkap"
                                className="w-full outline-none border-none bg-transparent p-0"
                            />
                        </div>
                        <div className="flex px-4 py-3 gap-2 items-center bg-white rounded-lg w-[45%] min-w-[300px]">
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="E-mail"
                                className="w-full outline-none border-none bg-transparent p-0"
                            />
                        </div>
                        <div className="flex px-4 py-3 gap-2 items-center bg-white rounded-lg w-[45%] min-w-[300px]">
                            <input
                                onChange={handlePasswordChange}
                                type="password"
                                placeholder="Kata Sandi"
                                className="w-full outline-none border-none bg-transparent p-0"
                            />
                        </div>
                        <div className="flex px-4 py-3 gap-2 items-center bg-white rounded-lg w-[45%] min-w-[300px]">
                            <input
                                onChange={handleConfirmPasswordChange}
                                type="password"
                                placeholder="Konfirmasi Kata Sandi"
                                className="w-full outline-none border-none bg-transparent p-0"
                            />
                        </div>
                        <div className="flex px-4 py-3 gap-2 items-center bg-white rounded-lg w-[45%] min-w-[300px]">
                            <select
                                onChange={(e) => setJK(e.target.value)}
                                className="w-full outline-none border-none bg-transparent p-0"
                            >
                                <option value="" disabled selected className="text-gray-200">Jenis Kelamin</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>
                        <div className="flex px-4 py-3 gap-2 items-center bg-white rounded-lg w-[45%] min-w-[300px]">
                            <input
                                onChange={handleBirthChange}
                                type="date"
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full outline-none border-none bg-transparent p-0"
                            />
                        </div>
                        {birthError && (
                            <div className="text-red-500 text-sm">{birthError}</div>
                        )}
                    </div>

                    {passwordError && (
                        <div className="text-red-500 text-sm">{passwordError}</div>
                    )}

                    {confirmPasswordError && (
                        <div className="text-red-500 text-sm">{confirmPasswordError}</div>
                    )}
                    
                    <div className="grid gap-1 w-[300px]">
                        <button className="bg-primary-600 text-white font-bold cursor-pointer py-2 rounded-lg">
                            Daftar
                        </button>
                        {error && (
                            <div className="bg-danger text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                            {error}
                            </div>
                        )}
                    </div>

                    <h1 className="text-sm font-medium text-center">
                        {`Sudah punya akun? `}<Link className="font-semibold" href={"/"}>Login</Link>
                    </h1>
                </form>
            </div>
            <div className="mt-5">
                <h2 className="text-sm text-center mb-5">Didukung oleh</h2>
                <Image src={"/images/Header Logo.png"}
                width={500}
                height={500}
                className="w-80" alt="logo support by"
                />
            </div>
        </div>
    );
}
