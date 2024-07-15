'use client'
import React, { useRef, useEffect, useCallback, useState  } from "react";
import { useChat } from "@/hooks/useChat";
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [riwayat, setRiwayat] = useState([]);
  const [consultationCompleted, setConsultationCompleted] = useState(false);
  const [firstConsultationDate, setFirstConsultationDate] = useState(null);
  const firstConsultation = localStorage.getItem('firstConsultationDate');
  
  useEffect(() => {
    if (firstConsultation) {
      setFirstConsultationDate(new Date(firstConsultation));
    }
  }, []);

  const sendMessage = (text) => {
    if (!loading && !message) {
      chat(text);
      if (input.current) input.current.value = '';
      resetTranscript();
      setConsultationCompleted(true);
    }
  };

  const handleVoiceInput = () => {
    sendMessage(transcript);
  };

  const startListening = useCallback(() => {
    SpeechRecognition.startListening({
      continuous: true,
      language: 'id'
    });
  }, []);

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
    handleVoiceInput();
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&apos;t support speech recognition.</span>;
  }

  if (hidden) {
    return null;
  }
  

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const res = await fetch('http://localhost:5001/riwayat', {
          method: 'GET',
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setRiwayat(data);
        } else {
          console.error('Error fetching consultation history:', res.statusText);
        }
      } catch (error) {
        console.error('Error fetching consultation history:', error);
      }
    };

    const addWeeklyConsultationEvent = async (consultationDate) => {
      try {
        const oneWeekLater = new Date(consultationDate);
        oneWeekLater.setDate(consultationDate.getDate() + 7);

        const newEvent = {
          status: 'danger',
          imageUrl: '/images/konsultasi-notif.jpg',
          scheduleTitle: 'Konsultasi Mingguan',
          time: oneWeekLater.toISOString()
        };

        const res = await fetch('http://localhost:5001/api/schedule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newEvent),
          credentials: 'include'
        });

        if (!res.ok) {
          throw new Error('Failed to add event');
        }

        console.log('Weekly consultation event added to calendar');
      } catch (error) {
        console.error('Error adding weekly consultation event:', error);
      }
    };

    if (consultationCompleted && !firstConsultationDate) {
      const now = new Date();
      setFirstConsultationDate(now);
      localStorage.setItem('firstConsultationDate', now.toISOString());
      addWeeklyConsultationEvent(now);
      setConsultationCompleted(false);
    }

    fetchRiwayat();
  }, [consultationCompleted, firstConsultationDate]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
        </div>
        <div className="w-full flex flex-col items-end justify-center gap-4">
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="pointer-events-auto bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-md"
          >
            {cameraZoomed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
          <input
            className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
            placeholder={transcript}
            disabled="disabled"
          />
         <button
            onClick={listening ? stopListening : startListening}
            className={`bg-blue-500 hover:bg-blue-600 text-white p-4 px-10 font-semibold uppercase rounded-full ${
              loading || message ? "cursor-not-allowed opacity-30" : ""
            }`}
          >
            {listening ? 
            <svg 
              fill="#fff" 
              width="24px" 
              height="24px" 
              viewBox="0 0 1920 1920" 
              xmlns="http://www.w3.org/2000/svg">
              <path d="M621.452 435.678c0-186.858 152.004-338.862 338.862-338.862 159.316 0 293.306 110.504 329.336 258.896L724.351 1162.76c-63.433-61.62-102.899-147.78-102.899-242.994V435.678Zm46.834 807.122c-88.168-79.79-143.65-195.06-143.65-323.033V435.679C524.636 195.475 720.111 0 960.315 0c176.955 0 329.645 106.09 397.775 257.997L1538.8 0l92.38 64.669L333.381 1917.48 241 1852.81l305.287-435.84C414.414 1301.53 331 1132.02 331 943.411V709.984h96.818v233.427c0 155.809 67.319 296.239 174.392 393.719l66.076-94.33Zm292.028 15.83c-9.387 0-18.687-.39-27.883-1.14l-62.071 88.62c29.036 6.12 59.127 9.34 89.955 9.34 240.205 0 435.675-195.48 435.675-435.683V595.685l-96.81 138.223v185.858c0 186.854-152.01 338.864-338.866 338.864Zm-162.996 191.75-57.715 82.4c54.294 20.4 112.13 33.5 172.305 38.1v252.3H669.861V1920h580.909v-96.82h-242.044v-252.3c324.464-24.8 580.904-296.76 580.904-627.469V709.984h-96.82v233.427c0 293.549-238.94 532.499-532.495 532.499-56.824 0-111.602-8.96-162.997-25.53Z" fillRule="evenodd"/>
            </svg> : 
            <svg 
              fill="#fff"
              width="24px"
              height="24px"
              viewBox="0 0 1920 1920"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M960.315 96.818c-186.858 0-338.862 152.003-338.862 338.861v484.088c0 186.858 152.004 338.862 338.862 338.862 186.858 0 338.861-152.004 338.861-338.862V435.68c0-186.858-152.003-338.861-338.861-338.861M427.818 709.983V943.41c0 293.551 238.946 532.497 532.497 532.497 293.55 0 532.496-238.946 532.496-532.497V709.983h96.818V943.41c0 330.707-256.438 602.668-580.9 627.471l-.006 252.301h242.044V1920H669.862v-96.818h242.043l-.004-252.3C587.438 1546.077 331 1274.116 331 943.41V709.983h96.818ZM960.315 0c240.204 0 435.679 195.475 435.679 435.68v484.087c0 240.205-195.475 435.68-435.68 435.68-240.204 0-435.679-195.475-435.679-435.68V435.68C524.635 195.475 720.11 0 960.315 0Z" fillRule="evenodd"/>
            </svg>}
          </button>
        </div>
      </div>
    </>
  );
};
