"use client";
import React, { useState } from 'react';
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";

const poppins = Poppins({  
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: '--font-poppins'
});

export default function ConsentForm() {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (checked) => {
        setIsChecked(checked);
    };

    const router = useRouter();

    const handleChangePage = (path) => {
        router.push(path);
    };
    
    return (
        <div className={`w-full h-full flex flex-col lg:flex-row ${poppins.className}`}>
            <div className="w-full lg:w-[80%] h-100px lg:h-100px bg-primary-50 p-5 sm:p-10 flex flex-col gap-5">
                <h1 className="font-bold text-2xl capitalize mb-5">Formulir Persetujuan yang Diinformasikan</h1>
                <p className="text-justify"><b>Tujuan Pengambilan Data: </b>
                Dalam proses penilaian dan intervensi, penting untuk kami jelaskan tujuan di balik pengumpulan informasi Anda. Hal ini dilakukan dengan tujuan memahami kebutuhan Anda secara menyeluruh dan memberikan bantuan yang sesuai. Kami menghargai kepercayaan Anda dalam memberikan informasi pribadi. Setiap data yang Anda berikan akan digunakan untuk merancang rencana perawatan yang sesuai dengan kebutuhan Anda. Sebelum kami mulai proses penilaian atau intervensi, kami akan menjelaskan secara jelas tujuan kami mengumpulkan informasi dari Anda. Hal ini bertujuan untuk memastikan bahwa setiap langkah yang kami ambil sesuai dengan kebutuhan Anda dan memberikan manfaat yang maksimal. Tujuan kami dalam mengambil data untuk assessment dan intervensi adalah untuk memahami situasi Anda secara holistik dan menyediakan bantuan yang paling efektif sesuai dengan kebutuhan Anda.</p>
                <p className="text-justify"><b>Prosedur: </b>
                Prosedur dalam dilakukannya assessment dan intervensi ini akan secara sistematis dengan dilakukannya tahapan-tahapan secara terarah dengan sistem aplikasi yang sudah diaplikasikan. Tahap tersebut berupa persetujuan dalam surat informed consent yang tersedia, lalu terdapat tahapan assessment yang meliputi wawancara, psychologyal testing, dan intervensi. untuk memunculkan kecenderungan terkait gangguan yang dihasilkan dari tahapan assessment harus diperlukan masa sekurang-kurangnya diperlukan masa sekurang-kurangnya 2 minggu.</p>
                <p className="text-justify"><b>Persepsi Resiko dan Kenyamanan: </b>
                Tidak ada resiko yang berarti di dalam proses assessment dan intervensi ini, namun pembicaraan ini akan direkam oleh sistem dan Anda mungkin merasakan ketidaknyamanan. System akan berusaha semaksimal mungkin agar membuat suasana assessment dan intervensi sealami mungkin.</p>
                <p className="text-justify"><b>Potensi Manfaat: </b>
                Anda telah memberikan persetujuan untuk terlibat dalam proses assessment dan intervensi yang kami sediakan. Tujuan dari proses ini adalah untuk memahami situasi Anda dengan lebih baik dan memberikan bantuan yang sesuai. Potensi manfaat yang dapat Anda harapkan dari assessment dan intervensi ini meliputi:</p>
                <ul className="text-justify">
                    <li>Pemahaman yang lebih mendalam tentang tantangan atau masalah yang Anda hadapi,
                         Pengembangan strategi dan keterampilan baru untuk mengatasi kesulitan yang mungkin Anda hadapi 
                         Perbaikan dalam kesejahteraan mental, emosional, atau psikologis Anda secara keseluruhan 
                         Penemuan solusi yang dapat membantu Anda mencapai tujuan hidup Anda. Dengan memberikan persetujuan Anda, Anda membuka pintu untuk pertumbuhan dan perubahan yang positif dalam kehidupan Anda.</li>
                </ul>
                <p className="text-justify"><b>Kerahasiaan: </b>
                Pengambilan data ini dilakukan untuk Program Kreatif Mahasiswa (PKM) dan dapat dikembangkan menjadi penelitian yang akan dipublikasikan. Apabila hasil suara ini digunakan untuk kepentingan pembelajaran di luar kelas, identitas Anda sebagai informan yang terlibat dalam proses ini dirahasiakan.</p>
                <p className="text-justify"><b>Hak untuk Menyatakan Ketidaksetujuan dan Persetujuan: </b>
                Partisipasi Anda di dalam proses terkait bersifat terikat. Oleh karenanya, Anda boleh menyatakan ketidaksetujuan sebelum menandatangani form ini.</p>
            </div>
            <div className="w-full lg:w-[50%] h-100px lg:h-100px bg-primary-200 p-4 sm:p-14 flex flex-col items-center justify-evenly">
                <div className="flex gap-3 items-center">
                    <Image
                        src="/images/logo.png"
                        alt="logo image"
                        width={200}
                        height={200}
                        priority={true}
                        className="w-[70px] sm:w-[100px] h-[100px] sm:h-[400px] object-contain"
                    />
                    <h1 className="font-bold text-2xl sm:text-5xl text-primary-600">MindCura</h1>
                </div>
                <div className="flex flex-col gap-4">
                    <h1 className="font-bold text-lg sm:text-2xl">Pernyataan Persetujuan</h1>
                    <div className="flex gap-2 items-start">
                        <Checkbox
                            checked={isChecked}
                            onCheckedChange={handleCheckboxChange}
                        />
                        <h2 className="text-sm text-justify">Tanda tangan Anda menunjukkan bahwa Anda sudah membaca atau dibacakan lembar persetujuan ini, dan Anda secara sukarela bersedia untuk menjadi klien dalam kegiatan ini.</h2>
                    </div>
                    <Button
                        onClick={() => handleChangePage("/register")}
                        className={`w-full sm:w-fit py-4 px-10 rounded-lg bg-primary-600 text-white ${!isChecked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!isChecked}
                    >Selanjutnya</Button>
                </div>
            </div>
        </div>
    )
};
