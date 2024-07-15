'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import Layout from "@/components/layouts/Layouts";
import { useEffect, useState } from 'react';
import { useAuth } from '../authContext';
import Link from 'next/link';
import { MOODS_LIST } from "@/components/layouts/constants";

export default function Dashboard() {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [selectedMood, setSelectedMood] = useState(null);
    const [messageType, setMessageType] = useState("");

    const moodColors = {
        angry: 'bg-red-300',
        sad: 'bg-blue-300',
        neutral: 'bg-green-300',
        happy: 'bg-yellow-300',
        excited: 'bg-orange-300',
    };

    const handleMoodClick = async (mood) => {
        setSelectedMood(mood);
        try {
            const res = await fetch("http://localhost:5001/dashboard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: mood.name,
                    day: new Date().toISOString().split('T')[0],
                    color: moodColors[mood.name]
                }),
                credentials: 'include'
            });

            if (res.ok) {
                setMessage("Mood berhasil ditambahkan!");
                setMessageType("success");
            } else {
                const errorData = await res.json();
                setMessage(errorData.message);
                setMessageType("error");
            }
            setTimeout(() => {
                setMessage(null);
            }, 3000); // Remove message after 3 seconds
        } catch (error) {
            console.error("Error adding mood:", error);
            setMessage("Error adding mood.");
            setMessageType("error");
        }
    };

    return (
        <Layout>
            <div className="flex flex-col items-center">
                <div className="w-full max-w-6xl flex flex-col items-center px-4">
                    <Image  src="/images/mindcura3 - bg.png" alt="Background" layout="fill" className="absolute inset-0 w-full h-full opacity-100"/>
                    
                    {/* Health Solutions Section */}
                    <div className="w-full bg-slate-50 rounded-xl p-6 mb-8 relative">
                        <h2 className="text-4xl font-semibold">Solusi Kesehatan Mental Anda</h2><br></br>
                        <p>Stres tidak selalu buruk, namun stres jangka panjang bisa ganggu kesehatanmu.</p>
                        <p>Merasa cemas itu biasa, namun kecemasan yang berlebihan itu tidak.</p>
                        <p className="mb-6">Depresi adalah perasaan sedih atau putus asa yang mendalam dan bertahan lama.</p>
                        <p>Jika kamu terus merasa kehilangan minat terhadap hal yang biasa disukai, dapatkan</p>
                        <p>bantuan ahli. Mereka dapat membantumu menemukan penyebabnya dan</p>
                        <p className="mb-6">menentukan apakah depresimu ringan, sedang atau parah.</p>
                        <div className="flex flex-wrap gap-8">
                            <Link href='/consulting'>
                                <div className="flex flex-col items-center p-4 bg-white rounded shadow hover:bg-gray-100 cursor-pointer">
                                    <Image src="/icons/Icon Terapis.png" alt="Chat dengan Dokter" width={110} height={100} className="border-solid rounded"/>
                                    <span className="mt-2 text-center">Konsultasi</span>
                                </div>
                            </Link>
                            <Link href='/therapist'>
                                <div className="flex flex-col items-center p-4 bg-white rounded shadow hover:bg-gray-100 cursor-pointer">
                                    <Image src="/icons/Icon Konsultasi.png" alt="Toko Kesehatan" width={110} height={100} className="border-solid rounded"/>
                                    <span className="mt-2 text-center">Terapis</span>
                                </div>
                            </Link>
                            <div className="flex flex-col p-4 bg-white rounded shadow cursor-pointer">
                                <div className="font-semibold text-lg mb-2 text-center">Bagaimana Perasaan Kamu Hari ini?</div>
                                <div className="flex gap-3 bg-primary-50 p-2 rounded-lg w-fit mx-auto justify-center">
                                    {MOODS_LIST.map((item, index) => (
                                        <div 
                                            key={index} 
                                            className={`flex flex-col items-center gap-1 font-semibold p-2 rounded-lg cursor-pointer hover:bg-primary-50 transform transition duration-300 ${moodColors[item.name]}`}
                                            onClick={() => handleMoodClick(item)}
                                        >
                                            <Image
                                                src={`/icons/${item.name}.png`}
                                                alt={item.name}
                                                width={50}
                                                height={50}
                                                className="rounded-full w-10 h-10 object-cover"
                                            />
                                            <h4 className="text-xs capitalize">{item.name}</h4>
                                        </div>
                                    ))}
                                </div>
                                {message && 
                                    <div className={`message-box ${messageType === 'success' ? 'success' : 'error'}`}>
                                        <p>{message}</p>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
