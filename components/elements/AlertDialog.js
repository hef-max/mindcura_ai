'use client'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

export default function AlertDialogComponent({
    alertDialogTitle, 
    alertDialogDesc,
    alertDialogCancel,
    alertDialogAction,
    onActionClick,
    actionButtonColor,
    children
    }) {

    const handleActionClick = () => {
        if (onActionClick) {
            onActionClick();
        }
    };

    return(
        <AlertDialog>
            <AlertDialogTrigger>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="w-full">
                <AlertDialogHeader>
                    <AlertDialogTitle>{alertDialogTitle}</AlertDialogTitle>
                    <AlertDialogDescription>{alertDialogDesc}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{alertDialogCancel}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleActionClick} className={`${actionButtonColor} text-white`}>{alertDialogAction}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}