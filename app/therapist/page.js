"use client"
import Image from "next/image";
import Layout from "@/components/layouts/Layouts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WHY_LIST, THERAPIST_LIST } from "@/components/layouts/constants";
import TherapistCard from "@/components/elements/TherapistCard";
import WhyCard from "@/components/elements/WhyCard";

export default function Therapist() {
    return (
        <Layout>
            <div className="w-full h-full">
                <div>
                    <Image 
                        src="/images/Rectangle 39.png"
                        alt='logo image'
                        width={10000}
                        height={300}
                        className="rounded-sm w-full h-[150px] object-cover"
                    />
                </div>
                <div className="flex flex-col xl:flex-row justify-between w-full gap-10 p-5">
                    {/* WHY NEED CONSULTATIONS? */}
                    <div className="w-full xl:w-1/3">
                        <h1 className="py-5 text-2xl font-semibold">Mengapa perlu konsultasi?</h1>
                        {WHY_LIST.map((item, index) => (
                            <WhyCard item={item} key={index} index={index}/>
                        ))}
                    </div>
                    {/* THERAPIST LIST CONTAINER */}
                    <div className="w-full xl:w-2/3 h-full p-4 overflow-hidden">
                        <h1 className="text-2xl font-semibold">Rekomendasi Terapis</h1>
                        <h5>konsultasi online dengan terapis siaga kami</h5>
                        <ScrollArea className="h-[600px]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {THERAPIST_LIST.map((item, index) => (
                                    <TherapistCard item={item} key={index}/>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
