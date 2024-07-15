import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faDownload } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function ChatHistoryCard({ item }) {
    const handleDownload = async () => {
        console.log(item);
        try {
            const response = await fetch(`http://localhost:5001/download_summary/${item.id}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `consultation_summary_${item.id}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.error("Failed to download PDF");
            }
        } catch (error) {
            console.error("Error downloading PDF", error);
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md flex flex-col gap-4 relative">
            <div className="flex items-center gap-4">
                <Image 
                    src={item.ava}
                    alt='Therapist Avatar'
                    width={50}
                    height={50}
                    className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <div>
                    <h2 className="text-md font-semibold">{item.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FontAwesomeIcon icon={faClock} size="sm" />
                        <span>{item.date}</span>
                    </div>
                </div>
            </div>
            <div>
                <p>{item.resdass}</p>
                <p>{item.resdsm}</p>
            </div>
            <button 
                className="absolute bottom-3 right-3 bg-primary-400 text-white p-2 rounded-lg"
                onClick={handleDownload}
            >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Download
            </button>
        </div>
    );
}
