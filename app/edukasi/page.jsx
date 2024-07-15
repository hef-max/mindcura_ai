import Layout from "@/components/layouts/Layouts";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewsDetailCard from "@/components/elements/NewsDetailCard";
import { NEWS_LIST } from "@/components/layouts/constants";

export default function Edukasi() {
    return (
        <Layout>
           <div className="flex flex-col items-center gap-5 w-full">
                <h1 className="py-5 text-2xl font-semibold">Edukasi</h1>
                <ScrollArea className="h-full w-full overflow-visible p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 overflow-visible">
                        {NEWS_LIST.map((item, index) => (
                            <NewsDetailCard item={item} key={index} />
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </Layout>
    );
}
