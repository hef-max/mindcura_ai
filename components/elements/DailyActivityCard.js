import Image from "next/image";

export default function DailyActivityCard({ item }) {
    return (
        <div className="relative w-full flex items-center gap-4 p-2 pl-4 rounded-lg bg-primary-50 mb-2 cursor-pointer">
            <Image 
                src={item.imageUrl}
                alt='activity image'
                width={200}
                height={200}
                className="w-[50px] h-[50px] rounded-full object-cover"
            />
            <div className="w-[200px]">
                <h2 className="text-md font-semibold line-clamp-1">{item.title}</h2>
                <div className="flex items-center gap-2">
                    <h5 className="text-grey-600 text-sm line-clamp-1">{item.subtitle}</h5>
                </div>
            </div>
        </div>
    );
}
