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
            <div className={`flex flex-col items-center w-full h-full ${poppins.className}`}>
                <div className="flex flex-col-reverse lg:flex-row justify-center items-center px-4 lg:px-10 2xl:px-20 gap-5 2xl:gap-14">
                    {/* Health Solutions Section */}
                    <div className="w-fit lg:w-full rounded-xl pt-10 lg:pt-0  pb-10 relative text-md lg:text-xs xl:text-lg 2xl:text-xl h-full">
                        <h2 className="text-xl 2xl:text-2xl font-semibold">Solusi Kesehatan Mental Anda</h2><br></br>
                        <p className="mb-6 text-justify">Stres tidak selalu buruk. Dalam jangka pendek, stres bisa memotivasi kita
                            untuk menyelesaikan tugas atau tantangan. Namun, stres jangka panjang dapat mengganggu kesehatan fisik dan mental kita
                            Kecemasan adalah perasaan khawatir atau takut terhadap situasi tertentu.
                            <br /><br />
                            Normalnya, ini bisa membantu kita waspada.
                            Namun, kecemasan yang berlebihan dan berlangsung lama dapat mengganggu aktivitas sehari-hari.
                            <br /><br />
                            Depresi adalah kondisi mental yang ditandai dengan perasaan sedih yang mendalam
                            dan bertahan lama. ini mempengaruhi perasaan, dan aktivitas sehari-hari. Jika merasa
                            kehilangan minat terhadap hal-hal yang biasa disukai, penting untuk mencari bantuan ahli.
                        </p>
                        <div className="flex flex-col w-full lg:flex-row mt-16 gap-4">
                            <div className="flex gap-6 lg:gap-4 w-auto xl:w-7/12 justify-center lg:justify-normal">
                                <Link href='/consulting'>
                                    <div className="flex flex-1 flex-col items-center p-4 bg-white rounded shadow hover:bg-gray-100 cursor-pointer">
                                        <Image src="/icons/Icon Terapis.png" alt="Chat dengan Dokter" width={110} height={100} className="w-auto h-auto border-solid rounded" />
                                        <span className="mt-2 text-center">Konsultasi</span>
                                    </div>
                                </Link>
                                <Link href='/therapist'>
                                    <div className="flex flex-1 flex-col items-center p-4 bg-white rounded shadow hover:bg-gray-100 cursor-pointer">
                                        <Image src="/icons/Icon Konsultasi.png" alt="Toko Kesehatan" width={110} height={100} className="w-auto h-auto border-solid rounded" />
                                        <span className="mt-2 text-center">Terapis</span>
                                    </div>
                                </Link>
                            </div>
                            <div className="flex flex-col bg-white rounded shadow cursor-pointer w-auto lg:w-full h-fit">
                                <div className="font-semibold text-lg lg:text-sm 2xl:text-lg mb-2 text-center">Bagaimana Perasaan Kamu Hari ini?</div>
                                <div className="grid grid-cols-3 lg:flex gap-2 bg-primary-50 p-2 rounded-lg w-full mx-auto justify-center">
                                    {MOODS_LIST.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`flex flex-col w-auto lg:w-full items-center gap-1 font-semibold p-1 rounded-lg cursor-pointer hover:bg-primary-50 transform transition duration-300 ${moodColors[item.name]}`}
                                            onClick={() => handleMoodClick(item)}
                                        >
                                            <Image
                                                src={`/icons/${item.name}.png`}
                                                alt={item.name}
                                                width={50}
                                                height={50}
                                                className="rounded-full w-10 h-10 lg:w-7 lg:h-7 2xl:w-10 2xl:h-10 object-cover"
                                            />
                                            <h4 className="text-xs xl:text-md capitalize">{item.name}</h4>
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

                    <div className="flex w-52 lg:w-6/12 2xl:w-7/12 justify-center">
                        <Image
                            src="/images/mindcura3 - bg.png"
                            alt="Background"
                            width={1202}
                            height={1000}
                            className="bg-transparent"
                        />
                    </div>

                </div>
            </div>
        </Layout>
    );
}
