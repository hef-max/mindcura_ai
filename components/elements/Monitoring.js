import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MonitoringCard({item}) {
    const getDiagnose = (resdass) => {
        const diagnose = resdass.split(" | ").map((item) => {
            const [type, score] = item.split(" = ");
            return { type, score: parseInt(score, 10) };
        });

        const highestScore = diagnose.reduce((prev, current) => {
            return prev.score > current.score ? prev : current;
        });

        return highestScore;
    };

    const getLevelClass = (type, score) => {
        if (type === "Depression") {
            if (score < 14) return ["bg-success"];
            if (score < 20) return ["bg-success", "bg-warning"];
            return ["bg-success", "bg-warning", "bg-danger"];
        } else if (type === "Anxiety") {
            if (score <= 9) return ["bg-success"];
            if (score <= 14) return ["bg-success", "bg-warning"];
            return ["bg-success", "bg-warning", "bg-danger"];
        } else if (type === "Stress") {
            if (score <= 18) return ["bg-success"];
            if (score <= 25) return ["bg-success", "bg-warning"];
            return ["bg-success", "bg-warning", "bg-danger"];
        }
        return [];
    };
    const highestDiagnosis = getDiagnose(item.resdass);
    const levelClass = getLevelClass(highestDiagnosis.type, highestDiagnosis.score);


    return (
        <div className="flex w-full h-[100px] rounded-lg bg-primary-200 items-center p-2 pl-[10px] gap-3">
            <FontAwesomeIcon icon={faPlus} size="xl" color="" className="bg-white p-7 rounded-lg cursor-pointer w-5 h-5"/>
            <div className="flex flex-col gap-2">
                <h1 className="font-semibold text-lg">{highestDiagnosis.type} Tingkatan</h1>
                <div className="flex gap-2">
                    {levelClass.map((cls, index) => (
                        <div key={index} className={`w-[65px] h-1 rounded-lg ${cls}`}></div>
                    ))}
                </div>
                <ScrollArea className="h-[40px] w-full">
                    <h4 className="font-normal text-xs">{item.chathistory}</h4>
                </ScrollArea>
            </div>
        </div>
    )
}