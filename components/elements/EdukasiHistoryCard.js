import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function EdukasiHistoryCard({ item }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <Image
                src={item.image}
                alt={item.title}
                width={70}
                height={70}
                className="w-[70px] h-[70px] rounded-lg object-cover"
            />
            <div className="flex flex-col">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <div className="flex items-center gap-2 text-sm text-grey-600">
                    <Image
                        src={item.authorAvatar}
                        alt={item.author}
                        width={24}
                        height={24}
                        className="w-[24px] h-[24px] rounded-full object-cover"
                    />
                    <span>{item.author}</span>
                    <FontAwesomeIcon icon={faClock} size="sm" className="text-grey-600" />
                    <span>{item.date}</span>
                </div>
            </div>
        </div>
    );
}
