import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faDownload, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function ChatHistoryCard({ item }) {
    const [showModal, setShowModal] = useState(false);

    const handleDownload = async () => {
        console.log(item);
        try {
            const response = await fetch(`http://13.212.181.136:5001/download_summary/${item.id}`, {
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
        <>
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
                <div className="absolute bottom-3 right-3 flex gap-2">
                    <button 
                        className="bg-blue-500 text-white p-2 rounded-lg"
                        onClick={() => setShowModal(true)}
                    >
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                        Detail
                    </button>
                    <button 
                        className="bg-primary-400 text-white p-2 rounded-lg"
                        onClick={handleDownload}
                    >
                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                        Download
                    </button>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-4">Detail Konsultasi</h2>
                        <p><strong>Nama:</strong> {item.name}</p>
                        <p><strong>Tanggal:</strong> {item.date}</p>
                        <p><strong>Hasil DASS 21:</strong> {item.resdass}</p>
                        <p><strong>Hasil DSM:</strong> {item.resdsm}</p>
                        <p><strong>Riwayat:</strong> {item.chathistory}</p>
                        <button 
                            className="mt-4 bg-red-500 text-white p-2 rounded-lg"
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
