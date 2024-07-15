import { useRouter } from 'next/router';
import { NEWS_LIST } from '@/components/layouts/constants';
import Layout from '@/components/layouts/Layouts';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

export default function NewsDetailPage() {
    const router = useRouter();
    const { id } = router.query;

    const news = NEWS_LIST.find((item) => item.id === '1');
    console.log(id);

    if (!news) {
        return <p>Loading...</p>;
    }

    return (
        <Layout>
            <div className="p-4">
                <div className="relative h-[300px] md:h-[400px] w-full mb-4">
                    <Image
                        src={news.image}
                        alt={news.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                    />
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
                        <div className="text-xs">{news.category}</div>
                        <h1 className="text-2xl font-bold">{news.title}</h1>
                        <div className="flex items-center gap-2 text-sm">
                            <FontAwesomeIcon icon={faClock} size="sm" />
                            <span>{news.date}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <p>{news.content}</p>
                </div>
            </div>
        </Layout>
    );
}
