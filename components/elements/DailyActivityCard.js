import React, { useState } from 'react';
import Image from 'next/image';
import Modal from 'react-modal';

export default function DailyActivityCard({ item }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <>
            <div className="relative w-full flex items-center gap-4 p-2 pl-4 rounded-lg bg-primary-50 mb-2 cursor-pointer" onClick={openModal}>
                <Image 
                    src={item.imageUrl}
                    alt='activity image'
                    width={30}
                    height={30}
                    className="w-auto h-auto rounded-full object-cover"
                />
                <div className="w-[200px]">
                    <h2 className="text-md font-semibold line-clamp-1">{item.title}</h2>
                    <div className="flex items-center gap-2">
                        <h5 className="text-grey-600 text-sm line-clamp-1">{item.subtitle}</h5>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Activity Information"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">{item.title}</h2>
                    <Image 
                        src={item.imageUrl}
                        alt='activity image'
                        width={100}
                        height={100}
                        className="w-auto h-auto rounded-full object-cover mb-4"
                    />
                    <p className="text-md mb-4">{item.subtitle}</p>
                    <button onClick={closeModal} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Close</button>
                </div>
            </Modal>
        </>
    );
}
