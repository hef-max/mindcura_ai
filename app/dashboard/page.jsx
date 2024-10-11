'use client';
import Image from "next/image";
import Layout from "@/components/layouts/Layouts";
import { useState } from 'react';
import { Poppins } from "next/font/google";
import Link from 'next/link';
import { MOODS_LIST } from "@/components/layouts/constants";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: '--font-poppins'
});

export default function Dashboard() {
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard`, {
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
            <div className={`flex flex-col items-center w-full h-screen ${poppins.className}`}>
                <div className="flex flex-col lg:flex-row items-center px-4 lg:px-20 w-full h-full">
                    {/* Health Solutions Section */}
                    <div className="w-fit lg:w-8/12 rounded-xl pb-8 relative text-md">
                        <h2 className="text-xl font-semibold">Solusi Kesehatan Mental Anda</h2><br></br>
                        <p>Stres tidak selalu buruk. Dalam jangka pendek, stres bisa memotivasi kita</p>
                        <p>untuk menyelesaikan tugas atau tantangan. Namun, stres jangka panjang</p>
                        <p className="mb-6">dapat mengganggu kesehatan fisik dan mental kita</p>
                        <p>Kecemasan adalah perasaan khawatir atau takut terhadap situasi tertentu.</p>
                        <p>Normalnya, ini bisa membantu kita waspada. Namun, kecemasan yang</p>
                        <p className="mb-6">berlebihan dan berlangsung lama dapat mengganggu aktivitas sehari-hari.</p>
                        <p>Depresi adalah kondisi mental yang ditandai dengan perasaan sedih yang mendalam</p>
                        <p>dan bertahan lama. ini mempengaruhi perasaan, dan aktivitas sehari-hari. Jika merasa</p>
                        <p>kehilangan minat terhadap hal-hal yang biasa disukai, penting untuk mencari bantuan ahli.</p>
                        <p className="mb-6"></p>
                        <div className="flex flex-wrap gap-y-6 lg:gap-8 mt-16 w-full lg:w-fit justify-between">
                            <Link href='/consulting'>
                                <div className="flex flex-col items-center p-4 bg-white rounded shadow hover:bg-gray-100 cursor-pointer">
                                    <Image src="/icons/Icon Terapis.png" alt="Chat dengan Dokter" width={110} height={100} className="w-auto h-auto border-solid rounded" />
                                    <span className="mt-2 text-center">Konsultasi</span>
                                </div>
                            </Link>
                            <Link href='/therapist'>
                                <div className="flex flex-col items-center p-4 bg-white rounded shadow hover:bg-gray-100 cursor-pointer">
                                    <Image src="/icons/Icon Konsultasi.png" alt="Toko Kesehatan" width={110} height={100} className="w-auto h-auto border-solid rounded" />
                                    <span className="mt-2 text-center">Terapis</span>
                                </div>
                            </Link>
                            <div className="flex flex-col bg-white rounded shadow cursor-pointer">
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
                    <div className="invisible lg:visible">
                        <div className="flex w-full-justify-center">
                            <Image
                                src="/images/mindcura3 - bg.png"
                                alt="Background"
                                width={1202}
                                height={1000}
                                className="lg:max-w-lg bg-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
