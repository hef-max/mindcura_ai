import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function ScheduleCard({ item }) {
    return (
        <div className="relative w-full flex items-center gap-4 p-2 pl-4 rounded-lg bg-primary-50 mb-2 cursor-pointer">
            <div className={`absolute w-1 h-8 left-0 rounded-r-md ${item.status === "danger" ? "bg-danger" : item.status === "warning" ? "bg-warning" : item.status === "success" ? "bg-success" : ""}`}></div>
            <Image 
                src={item.imageUrl}
                alt='logo image'
                width={200}
                height={200}
                className="w-[30px] h-[30px] rounded-full object-cover"
            />
            <div className="w-[200px]">
                <h2 className="text-md font-semibold line-clamp-1">{item.scheduleTitle}</h2>
                <div className="flex items-center gap-2">
                    <h5 className="text-grey-600 text-sm line-clamp-1">{item.time}</h5>
                </div>
            </div>
        </div>
    );
}
