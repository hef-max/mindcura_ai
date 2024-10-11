'use client'
import * as React from "react";
import Layout from "@/components/layouts/Layouts";
import { ScrollArea } from "@/components/ui/scroll-area";
import FormattedDate from "@/components/elements/FormattedDate";
import ScheduleCard from "@/components/elements/ScheduleCard";
import { DAILY_ACTIVITY_LIST } from "@/components/layouts/constants";
import { CalendarContainer } from "@/components/ui/calendar-container";
import DailyActivityCard from "@/components/elements/DailyActivityCard";


export default function Schedule() {
    const [date, setDate] = React.useState(new Date());
    const [scheduleList, setScheduleList] = React.useState([]);

    React.useEffect(() => {
        const fetchScheduleList = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schedule`, {
                    method: "GET",
                    credentials: 'include'
                });

                if (res.ok) {
                    const data = await res.json();
                    setScheduleList([data]);
                } else {
                    console.error("Error fetching schedule list:", res.statusText);
                }
            } catch (error) {
                console.error("Error fetching schedule list:", error);
            }
        };

        fetchScheduleList();
    }, []);

    return (
        <Layout>
            <div className="flex flex-col md:flex-row w-full px-4 gap-10 justify-center">
                {/* Left Section for Calendar */}
                <div>
                    <div className="flex justify-between py-4">
                        <h1 className="text-2xl font-semibold">Kalender</h1>
                    </div>
                        <CalendarContainer
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-lg border shadow-lg w-full"
                        />
                    {/* <div className="flex w-full bg-slate-500 items-center place-content-center">
                    </div> */}
                </div>

                {/* Right Section for Schedule and Daily Activity */}
                <div className="flex flex-col w-full md:w-1/2">
                    <div className="w-full">
                        <h1 className="text-2xl font-semibold">Jadwal</h1>
                        <FormattedDate />
                        <ScrollArea className="h-[200px] w-full mt-3">
                            {scheduleList.map((item, index) => (
                                <ScheduleCard item={item} key={index} />
                            ))}
                        </ScrollArea>
                    </div>
                    <div className="h-full w-full py-2">
                        <h1 className="text-2xl font-semibold">Aktivitas Harian</h1>
                        <FormattedDate />
                        <ScrollArea className="h-[300px] w-full mt-3">
                            {DAILY_ACTIVITY_LIST.map((item, index) => (
                                <DailyActivityCard item={item} key={index} />
                            ))}
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </Layout>
    );
}