"use client"
import Image from "next/image";

export default function WhyCard({ item }) {
    return (
        <div className="flex items-start gap-4 p-4 bg-white rounded-lg  cursor-pointer transition-shadow duration-300 mb-4">
            <Image 
                src={item.image}
                alt={item.title}
                width={55}
                height={55}
                className="w-13 h-13 rounded-full border"
            />
            <div>
                <h4 className="text-sm">{item.title}</h4>
            </div>
        </div>
    );
}
