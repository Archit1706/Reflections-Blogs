"use client";
import React, { useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import LoadingComponent2 from "./Loading2";

type Props = {
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    message: string;
};

const SpeechToText = ({ message, setMessage }: Props) => {
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: false,
        useLegacyResults: false,
    });

    const [isCorrecting, setIsCorrecting] = useState(false);

    useEffect(() => {
        results.forEach((result) => {
            setMessage(message + result.transcript + " ");
        });
    }, [results]);

    const grammerCheck = async () => {
        setIsCorrecting(true);
        const res = await fetch("/api/ml/correct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: message }),
        });
        const data = await res.json();
        console.log(data);
        setMessage(data.result);
        setIsCorrecting(false);
    };

    return (
        <div className="pt-4">
            <div className="">
                <label
                    htmlFor="message"
                    className="block mb-2 text-md font-medium text-zinc-900 dark:text-white"
                >
                    Your Story
                </label>
                {isCorrecting && <LoadingComponent2 />}
                <textarea
                    id="message"
                    rows={10}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="block p-2.5 w-full text-md text-zinc-900 bg-zinc-50 rounded-lg border border-zinc-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write your thoughts here..."
                ></textarea>
            </div>
            {error ? (
                <p className="mt-4">
                    Web Speech API is not available in this browser 🤷‍
                </p>
            ) : (
                <div className="mt-4">
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            {isRecording ? (
                                <div
                                    onClick={stopSpeechToText}
                                    className="h-12 w-12 bg-white rounded-lg p-2 cursor-pointer"
                                >
                                    <img
                                        src="/voice_recording.png"
                                        alt=""
                                        className="h-full w-full"
                                    />
                                </div>
                            ) : (
                                <div
                                    onClick={startSpeechToText}
                                    className="h-12 w-12 bg-white rounded-lg p-2 cursor-pointer"
                                >
                                    <img
                                        src="/voice_normal.png"
                                        alt=""
                                        className="h-full w-full"
                                    />
                                </div>
                            )}
                            <div
                                className="ml-4 cursor-pointer"
                                onClick={
                                    isRecording
                                        ? stopSpeechToText
                                        : startSpeechToText
                                }
                            >
                                {isRecording
                                    ? "Recording..."
                                    : "Click to start recording"}
                            </div>
                        </div>
                        <button
                            onClick={grammerCheck}
                            className="px-4 py-1.5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
                        >
                            Grammer Correction
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpeechToText;
