'use client'
import React, { useRef, useState, useEffect } from "react";

const CaptureMedia = ({ onSubmit }) => {
    const videoRef = useRef();
    const [imageData, setImageData] = useState(null);
    const [audioData, setAudioData] = useState(null);
    const mediaRecorderRef = useRef();
    const chunks = useRef([]);

    useEffect(() => {
        const getMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                videoRef.current.srcObject = stream;
            } catch (error) {
                console.error("Error accessing media devices.", error);
            }
        };
        getMedia();
    }, []);

    const handleStartRecording = () => {
        if (videoRef.current.srcObject) {
            mediaRecorderRef.current = new MediaRecorder(videoRef.current.srcObject);
            mediaRecorderRef.current.ondataavailable = (event) => {
                chunks.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
                setAudioData(audioBlob);
            };
            mediaRecorderRef.current.start();
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();

            const video = videoRef.current;
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                setImageData(blob);
            }, "image/jpeg");
        }
    };

    const handleSubmit = () => {
        if (onSubmit && imageData && audioData) {
            onSubmit({ image: imageData, audio: audioData });
        }
    };

    return (
        <div className="media-capture-container">
            <video ref={videoRef} autoPlay playsInline className="video-preview" />
            <button onClick={handleStartRecording}>Start Recording</button>
            <button onClick={handleStopRecording}>Stop Recording</button>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default CaptureMedia;
