"use client";
import Link from "next/link";
import { useState } from "react";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const poppins = Poppins({  
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: '--font-poppins'
});

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
            
            if (res.ok) {
                router.push("/dashboard");
                return;
            } else {
                setError("User invalid.");
            }
        } 
        catch (error) {
            console.log(error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          handleSubmit(e);
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen px-2 py-5 ${poppins.className}`}>
            <div className="flex flex-col gap-4 w-[320px] shadow-lg p-5 rounded-lg border-t-4 border-primary-600 bg-primary-100">
                <h1 className="text-2xl font-semibold my-4 text-center">Login</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex px-4 py-3 gap-2 items-center bg-white rounded-lg">
                        <FontAwesomeIcon icon={faEnvelope} size="lg" className="w-5 h-5" color="#3C81F5"/>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Email"
                            onKeyDown={handleKeyDown} // Add this line
                            className="w-full outline-none border-none bg-transparent p-0"
                            autoComplete="email"
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex px-4 py-3 gap-2 items-center bg-white rounded-lg">
                            <FontAwesomeIcon icon={faLock} size="lg" className="w-5 h-5" color="#3C81F5"/>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Kata Sandi"
                                onKeyDown={handleKeyDown} // Add this line
                                className="w-full outline-none border-none bg-transparent p-0"
                                autoComplete="current-password"
                            />
                        </div>
                        <Link className="mt-3 text-right opacity-80 text-xs" href={"/forgotpass"}>
                            Lupa Kata Sandi?
                        </Link>
                    </div>
                    <div className="flex flex-col w-full">
                        <button className="bg-primary-600 text-white font-bold cursor-pointer py-2 rounded-lg">
                            Login
                        </button>
                        {error && (
                            <div className="bg-danger text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                            {error}
                            </div>
                        )}
                    </div>
                    <h1 className="text-sm font-medium mt-3 text-center">
                        {`Belum punya akun? `}<Link className="font-semibold" href={"/consent"}>Daftar</Link>
                    </h1>
                </form>
            </div>
            <div className="mt-5 flex flex-col items-center">
                <h2 className="text-sm text-center mb-5">Didukung oleh</h2>
                <Image src={"/images/Header Logo.png"}
                priority={true}
                width={257}
                height={357}
                className="h-auto w-auto"
                alt="Logo support by"
                />
            </div>
        </div>
    );
}