"use client"
import { useState } from "react";
import Image from "next/image";
import Modal from "@/components/elements/Modal";

const TherapistCard = ({ item }) => {
    const [showModal, setShowModal] = useState(false);

    const handleChatClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="bg-white p-4 rounded shadow hover:bg-gray-100 cursor-pointer">
            <div className="flex items-center gap-4">
                <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="border rounded-full object-cover"
                />
                <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p>{item.specialization}</p>
                    <p className="text-gray-400 text-sm">{item.location}</p>
                </div>
            </div>
            <button
                onClick={handleChatClick}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
                Chat
            </button>

            <Modal show={showModal} onClose={handleCloseModal}>
                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-semibold mb-4">Hubungi Terapis</h2>
                    <button
                        onClick={() => window.location.href = `https://wa.me/${item.whatsapp}`}
                        className="bg-green-500 text-white py-2 px-4 rounded mb-2"
                    >
                        WhatsApp
                    </button>
                    <button
                        onClick={() => window.location.href = `mailto:${item.email}`}
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                        Email
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default TherapistCard;
