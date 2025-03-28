'use client';
import * as React from "react";
import Image from "next/image";
import Layout from "@/components/layouts/Layouts";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatHistoryCard from "@/components/elements/ChatHistoryCard";
import MonitoringCard from "@/components/elements/Monitoring";

export default function Activity() {
    const [moodStats, setMoodStats] = React.useState([]);
    const [consultationHistory, setConsultationHistory] = React.useState([]);
    const [latestConsultation, setLatestConsultation] = React.useState(null);
    const scrollRef = React.useRef(null);

    React.useEffect(() => {
        const fetchMoodHistory = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mood_history`, {
                    method: "GET",
                    credentials: 'include'
                });

                if (res.ok) {
                    const data = await res.json();
                    setMoodStats(data);
                } else {
                    console.error("Error fetching mood history:", res.statusText);
                }
            } catch (error) {
                console.error("Error fetching mood history:", error);
            }
        };

        const fetchConsultationHistory = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultation_history`, {
                    method: "GET",
                    credentials: 'include'
                });

                if (!res.ok) {
                    throw new Error("Belum ada Riwayat");
                }

                if (res.ok) {
                    const data = await res.json();
                    setConsultationHistory(data);
                    const latest = data.reduce((latest, current) => {
                        const latestDate = new Date(latest.date);
                        const currentDate = new Date(current.date);
                        return currentDate > latestDate ? current : latest;
                    }, data[0]);
                    setLatestConsultation(latest)
                } else {
                    console.error("Error fetching consultation history:", res.statusText);
                }
            } catch (error) {
                console.error("Error fetching consultation history:", error);
            }
        };

        fetchMoodHistory();
        fetchConsultationHistory();
    }, []);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth; // Scroll to the rightmost position
        }
    }, [moodStats]);
    

    return (
        <Layout>
            <div className="flex flex-col md:flex-row gap-10 w-full">
                {/* Left Section */}
                <div className="flex flex-col gap-5 w-full md:w-1/3">
                    {/* Blok Stress Decreased */}
                    <div className="flex w-full h-[120px] rounded-lg bg-primary-200 items-center p-2 pl-[10px] gap-3">
                        {latestConsultation && <MonitoringCard item={latestConsultation}/>}
                    </div>
                    {/* Blok Mood History */}
                    <div className="flex w-full w-full h-auto rounded-lg bg-primary-200 items-center p-2 flex-col gap-2">
                        <div className="flex w-full justify-between mb-1">
                            <h4 className="font-medium font-semibold text-m">Riwayat Mood</h4>
                        </div>
                        {/* make it show for a week*/}
                        {/* Scrollable mood history for a week */}
                        <div ref={scrollRef} className="w-full h-full overflow-x-scroll scroll-hidden">
                            <div className="flex flex-row-reverse gap-2 w-[640px]"> 
                                {moodStats.map((mood, index) => (
                                    <div key={index} className={`p-2 rounded-lg flex flex-col w-[80px] items-center ${mood.color}`}>
                                        <Image
                                            src={`/icons/${mood.name}.png`}
                                            alt='mood day'
                                            width={25}
                                            height={28}
                                            className="w-[25px] h-[28px] object-contain"
                                        />
                                        <h4 className="font-semibold text-xs">{mood.day}</h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right Section */}
                <div className="w-full md:w-2/3 h-full p-4 overflow-hidden border rounded-lg">
                    <h1 className="py-5 text-2xl font-semibold text-center">Riwayat Konsultasi</h1>
                    {consultationHistory ? (
                        <ScrollArea className="h-full">
                            <div className="grid grid-cols-1 gap-4">
                                {consultationHistory.map((item, index) => (
                                    <ChatHistoryCard item={item} key={index} />
                                ))}
                            </div>
                        </ScrollArea>
                    ) : (
                        <p className="text-black">{error || "Loading..."}</p>
                    )}
                </div>
            </div>
        </Layout>
    );
}
