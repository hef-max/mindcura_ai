'use client'
import React, { useRef, useCallback, useEffect, useState } from "react";
import { useChat } from "@/hooks/useChat";
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Image from "next/image";
import { useCamera } from "@/hooks/useCamera";

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showHeadphoneWarning, setShowHeadphoneWarning] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const { videoRef, cameraError } = useCamera();
  const [emotion, setEmotion] = useState(null);
  const [lstmPrediction, setLstmPrediction] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const classifyFrame = async (frame) => {
    const formData = new FormData();
    formData.append('file', frame, 'frame.jpg');

    try {
      const response = await fetch('http://localhost:5001/classify', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const result = await response.json();
      setEmotion(result.emotion);
    } catch (error) {
      console.error('Error classifying frame:', error);
    }
  };

  const captureFrame = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      classifyFrame(blob);
    }, 'image/jpeg');
  }, [videoRef]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        captureFrame();
      }
    }, 5000); // Capture frame every 5 second

    return () => clearInterval(intervalId);
  }, [videoRef, captureFrame]);

  const sendMessage = useCallback((text) => {
    if (!loading && !message) {
      chat(text);
      if (input.current) input.current.value = "";
      resetTranscript();
      setConsultationCompleted(true); 
    }
  }, [loading, message, chat, resetTranscript]);

  const handleVoiceInput = useCallback(() => {
    const text = transcript;
    sendMessage(text);
  }, [transcript, sendMessage]);

  const startRecording = useCallback(async () => {
    if (mediaRecorder) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    recorder.ondataavailable = (event) => {
      setAudioChunks((prev) => [...prev, event.data]);
    };

    recorder.start();
    setIsRecording(true);
  }, [mediaRecorder]);

  const stopRecording = useCallback(() => {
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    setIsRecording(false);
    setMediaRecorder(null);
  }, [mediaRecorder]);

  const startListening = useCallback(() => {
    SpeechRecognition.startListening({
      continuous: true,
      language: 'id'
    });
    startRecording();
  }, [startRecording]);

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
    handleVoiceInput();
    stopRecording();
  }, [handleVoiceInput, stopRecording]);

  const processAudio = useCallback(async () => {
    const blob = new Blob(audioChunks, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('audio_file', blob, 'audio.wav');

    try {
      const response = await fetch('http://localhost:5001/api/classify_lstm', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();
      setLstmPrediction(result.emotion);

    } catch (error) {
      console.error('Error making LSTM prediction:', error);
    }
  }, [audioChunks]);

  useEffect(() => {
    const headphoneTimeout = setTimeout(() => {
      setShowHeadphoneWarning(false);
      setShowInstructions(true);
    }, 5000); // hide headphone warning after 5 seconds

    const instructionsTimeout = setTimeout(() => {
      setShowInstructions(false);
      setShowContent(true);
    }, 15000); // hide instructions after 10 seconds

    return () => {
      clearTimeout(headphoneTimeout);
      clearTimeout(instructionsTimeout);
    };
  }, []);

  useEffect(() => {
    if (!isRecording) {
      processAudio();
    }
  }, [isRecording, processAudio]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&apos;t support speech recognition.</span>;
  }

  if (hidden) {
    return null;
  }

  if (cameraError) {
    return <span>Camera error: {cameraError.message}</span>;
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-center items-center p-4 flex-col pointer-events-none">
        {showHeadphoneWarning && (
            <div className="self-center backdrop-blur-md bg-primary-400 justify-items-center bg-opacity-80 p-5 rounded-lg">
              <p className="text-center font-semibold">Direkomendasikan menggunakan headphone untuk pengalaman lebih baik
                <Image src="/icons/headphones.png" alt="Step 0" width={20} height={20} className="h-auto w-auto"/>
              </p>
            </div>
          )}
          {showInstructions && (
            <div className="self-center backdrop-blur-md bg-primary-400 bg-opacity-80 p-5 justify-items-center rounded-lg flex flex-col items-center gap-5">
              <p className="text-center font-semibold">Ikuti langkah-langkah untuk menggunakan fitur Avatar:</p>
              <Image src="/icons/microphone.png" alt="Step 1" width={30} height={30} className="h-auto w-auto" />
              <p className="text-center">Step 1: Klik tombol mikrofon untuk mulai berbicara.</p>
              <Image src="/icons/voice.png" alt="Step 2" width={30} height={30} className="h-auto w-auto" />
              <p className="text-center">Step 2: Suara Anda akan diproses oleh sistem.</p>
              <Image src="/icons/voice2.png" alt="Step 3" width={30} height={30} className="h-auto w-auto" />
              <p className="text-center">Step 3: Anda akan melihat avatar merespons masukan Anda.</p>
            </div>
          )}
      </div>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        {showContent && (
          <>
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
            <video ref={videoRef} autoPlay muted className="hidden"/>
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
        </>
      )}
    </div>
    </>
  );
};
