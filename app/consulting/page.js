'use client';
import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import Layout from "@/components/layouts/Layouts";
import LoadingPage from "@/components/elements/LoadingPage";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: '--font-poppins'
});

const QUESTIONS = [
    "Saya merasa sulit untuk beristirahat",
    "Saya merasa bibir saya sering kering",
    "Saya sama sekali tidak dapat merasakan perasaan positif",
    "Saya mengalami kesulitan bernafas (misalnya: seringkali terengah-engah atau tidak dapat bernafas padahal tidak melakukan aktivitas fisik sebelumnya)",
    "Saya merasa sulit untuk meningkatkan inisiatif dalam melakukan sesuatu",
    "Saya cenderung bereaksi berlebihan terhadap suatu situasi",
    "Saat merasa gemetar (misalnya: pada tangan)",
    "Saya merasa telah menghabiskan banyak energi untuk merasa cemas",
    "Saya merasa khawatir dengan situasi dimana saya mungkin menjadi panik dan mempermalukan diri sendiri",
    "Saya merasa tidak ada hal yang dapat diharapkan di masa depan",
    "Saya menemukan diri saya mudah gelisah",
    "Saya merasa sulit untuk bersantai",
    "Saya merasa putus asa dan sedih",
    "Saya tidak dapat memaklumi hal apapun yang menghalangi saya untuk menyelesaikan hal yang sedang saya lakukan",
    "Saya merasa saya hampir panik",
    "Saya tidak merasa antusias dalam hal apapun",
    "Saya merasa bahwa saya tidak berharga sebagai seorang manusia",
    "Saya merasa bahwa saya mudah tersinggung", 
    "Saya menyadari kegiatan jantung, walaupun saya tidak sehabis melakukan aktivitas fisik (misalnya: merasa detak jantung meningkat atau melemah)",
    "Saya merasa takut tanpa alasan yang jelas",
    "Saya merasa bahwa hidup tidak berarti"
];

export default function Consulting() {
    const [responses, setResponses] = useState(Array(QUESTIONS.length).fill(null));
    const [error, setError] = useState("");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);


    const handleOptionChange = (index, value) => {
        const newResponses = [...responses];
        newResponses[index] = value;
        setResponses(newResponses);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (responses.includes(null)) {
            setError("Please answer all questions.");
            return;
        }

        try {
            const res = await fetch("http://13.212.181.136:5001/api/submit_response", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ answers: responses.map(Number) }),
                credentials: "include"
            });

            if (res.ok) {
                setTimeout(() => {
                    router.push('/avatar');
                    setIsLoading(false);
                }, 6000);
            } else {
                const data = await res.json();
                setError(data.message || "An error occurred");
            }
        } catch (error) {
            setError("An error occurred");
        }
    };

    return (
        <Layout>
            {isLoading && <LoadingPage setLoadingComplete={() => setIsLoading(false)} />}
            <div className={`flex justify-center w-screen h-screen px-2 py-5`}>
                <div className="flex flex-col gap-4 h-[2550px] shadow-lg p-5 rounded-lg border-t-4 border-primary-400">
                    <h1 className="text-2xl font-semibold my-4">KUISIONER DEPRESSION ANXIETY STRESS SCALE 21 (DASS-21)</h1>
                    <p>Petunjuk Pengisian: </p>
                    <p>Kuesioner ini terdiri dari berbagai pernyataan yang mungkin sesuai dengan pengalaman anda dalam menghadapi situasi hidup sehari-hari. Terdapat empat pilihan jawaban yang disediakan untuk setiap pernyataan yaitu:</p>
                    <ul>
                        <li>0 : Tidak sesuai dengan saya sama sekali, atau tidak pernah</li>
                        <li>1 : Sesuai dengan saya sampai batas yang dapat dipertimbangkan, atau kadang-kadang (pernah mengalami 1-2 kali)</li>
                        <li>2 : Sesuai dengan saya sampai tingkat tertentu, atau Sering (pernah mengalami 3-4 kali)</li>
                        <li>3 : Sangat sesuai dengan saya, atau sering sekali (pernah mengalami lebih dari 4 kali)</li>
                    </ul>
                    <p>Selanjutnya, anda diminta untuk menjawab dengan cara memberi tanda silang (x) pada salah satu kolom yang paling sesuai dengan pengalaman anda selama satu minggu belakangan ini.
                        Tidak ada jawaban yang benar ataupun salah, karena itu isilah sesuai dengan keadaan diri anda yang sesungguhnya, yaitu berdasarkan jawaban pertama yang terlintas dalam pikiran anda.
                    </p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {QUESTIONS.map((question, index) => (
                            <div key={index}>
                                <h1>{question}</h1>
                                <div className="flex px-4 py-3 gap-5 items-center bg-primary-200 rounded-lg">
                                    <label className="custom-radio flex items-center gap-1">
                                        <input type="radio" value="0" checked={responses[index] === '0'} onChange={() => handleOptionChange(index, '0')} />
                                        <span className="radio-label">0</span>
                                    </label>
                                    <label className="custom-radio flex items-center gap-1">
                                        <input type="radio" value="1" checked={responses[index] === '1'} onChange={() => handleOptionChange(index, '1')} />
                                        <span className="radio-label">1</span>
                                    </label>
                                    <label className="custom-radio flex items-center gap-1">
                                        <input type="radio" value="2" checked={responses[index] === '2'} onChange={() => handleOptionChange(index, '2')} />
                                        <span className="radio-label">2</span>
                                    </label>
                                    <label className="custom-radio flex items-center gap-1">
                                        <input type="radio" value="3" checked={responses[index] === '3'} onChange={() => handleOptionChange(index, '3')} />
                                        <span className="radio-label">3</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                        {error && (
                            <div className="bg-danger text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                                {error}
                            </div>
                        )}
                        <div className="flex flex-col w-[10%] justify-center text-center">
                            <button className="bg-primary-500 text-white font-bold cursor-pointer py-2 rounded-lg justify-center">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
