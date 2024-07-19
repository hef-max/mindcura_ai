import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";

export default function NewsDetailCard({ item }) {
    return (
        <div className="relative overflow-visible p-3">
            <Link href={`${item.link}`} legacyBehavior>
                <a className="block transform transition duration-300 ease-in-out hover:text-primary-600 hover:scale-105 hover:shadow-lg flex flex-col gap-2 rounded-lg bg-white border shadow-md p-4 overflow-visible h-full">
                    <div className="flex justify-center">
                        <Image
                            src={item.image}
                            alt={item.title}
                            width={200}
                            height={100}
                            priority={true}
                            className="w-auto h-auto flex rounded-lg object-cover items-center justify-center"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-md font-semibold">{item.title}</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FontAwesomeIcon icon={faClock} size="sm" className="text-gray-600" />
                            <span>{item.date}</span>
                            <span className="bg-blue-100 text-xs text-gray-500 px-2 py-1 rounded inline-block w-auto">
                                {item.category}
                            </span>
                        </div>
                    </div>
                </a>
            </Link>
        </div>
    );
}
