'use client';
import Image from "next/image";
import Layout from "@/components/layouts/Layouts";

export default function About() {
    return (
        <Layout>
            <div className="flex flex-col gap-10 w-full h-full">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-black mb-4">Tentang Kami</h1>
                    <h5 className="text-grey-600">#Your Mental Health Matters</h5>
                </div>
                <div className="flex flex-col-reverse lg:flex-row gap-5 p-5">
                    <div className="flex flex-col text-center lg:text-left gap-4 w-full lg:w-[50%]">
                        <div className="text-xl font-semibold">
                            MindCura<br></br>
                        </div>
                        <div className="text-grey-600 text-justify">
                         <b>MindCura</b> merupakan salah satu dari <b>PKM Karsa Cipta Universitas Teknologi Yogyakarta</b>  yang berfokus pada solusi kesehatan mental yang inovatif.
                          Kami mengembangkan aplikasi yang menggabungkan <i>Augmented reality</i> (AR) dan <i>Artificial Intelligence</i> (AI) untuk membantu individu mengelola dan meningkatkan kesehatan mental mereka.
                           Produk kami, aplikasi MindCura, menawarkan terapi interaktif dan rekomendasi hasil personalisasi yang dapat diakses kapan saja, dan di mana saja.
                            Dengan tim ahli di bidang teknologi dan psikologi, MindCura berkomitmen untuk meningkatkan kesejahteraan mental melalui pendekatan modern dan efektif.
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row justify-center lg:items-start lg:justify-end w-full lg:w-[50%]">
                        <Image 
                            src="/images/Ellipse 9.png"
                            alt='logo image'
                            width={400}
                            height={400}
                            className="w-auto h-auto rounded-sm overflow-hidden"
                        />
                    </div>
                </div>
                <div className="text-center">
                    <h5 className="text-xl font-semibold">Mitra Kami</h5> <br></br>
                </div>
                <div className="flex justify-center gap-5 flex-wrap p-5">
                    <Image 
                        src="/images/logo dikti.png" 
                        alt="Supported by" 
                        width={90} 
                        height={90} 
                        className="w-auto h-auto" 
                    />
                    <Image 
                        src="/images/logo uty.png" 
                        alt="Supported by" 
                        width={80} 
                        height={110} 
                        className="w-auto h-auto" 
                    />
                    <Image 
                        src="/images/Logo_Kampus_Merdeka_Kemendikbud.png" 
                        alt="Supported by" 
                        width={110} 
                        height={20} 
                        className="w-auto h-auto" 
                    />
                    <Image 
                        src="/images/Logo-PKM-Warna.png" 
                        alt="Supported by" 
                        width={120} 
                        height={80} 
                        className="w-auto h-auto" 
                    />
                    <Image 
                        src="/images/Logo-BS-Warna.png" 
                        alt="Supported by" 
                        width={110} 
                        height={80} 
                        className="w-auto h-auto" 
                    />
                    <Image 
                        src="/images/logo simbelmawa.png" 
                        alt="Supported by" 
                        width={120} 
                        height={20} 
                        className="w-auto h-auto" 
                    />
                </div>
                
                <div className="flex flex-col-reverse lg:flex-row-reverse gap-5 bg-primary-50 p-5 rounded-md">
                    <div className="flex flex-col text-center lg:text-left gap-4 w-full lg:w-[50%]">
                        <div className="text-xl font-semibold">
                            Tujuan Kami<br></br>
                        </div>
                        <div className="text-grey-600 text-justify">
                            Melalui teknologi<i> Augmented Reality</i> (AR) dan <i>Artificial Intelligence</i> (AI), MindCura menghadirkan platrfrom
                            interaktif untuk membantu pengguna dalam <b>memahami kondisi mental</b> mereka dengan lebih <b>mudah</b> dan <b>efisien</b>.
                            Diharapkan dengan adanya sistem ini dapat <b>mendeteksi</b> gangguan kesehatan mental <b>secara dini </b> dan 
                            <b> memberikan terapi</b> yang berguna untuk meningkatkan <b>kualitas</b> kesehatan mental sekaligus <b>kesadaran akan pentingnnya
                            kesehatan mental</b>.
                        </div>
                    </div>
                    <div className="flex justify-center lg:items-start lg:justify-start w-full lg:w-[50%]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15813.593041053755!2d110.34511595964429!3d-7.747513037593612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a58f2d747cc8d%3A0xba7c703a016a750e!2sUniversitas%20Teknologi%20Yogyakarta!5e0!3m2!1sid!2sid!4v1720186788968!5m2!1sid!2sid"
                            width="400"
                            height="300"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
