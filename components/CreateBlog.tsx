"use client";
import React, { useState, useRef, useEffect } from "react";
import Multiselect from "multiselect-react-dropdown";
import SpeechToText from "./SpeechToText";
import CreateBlog from "@/app/create/page";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const options = [
    "Data Science",
    "Programming",
    "Poetry",
    "Machine Learning",
    "Covid 19",
    "Life",
    "Python",
    "Technology",
    "Startup",
    "Writing",
    "Life Lessons",
    "Love",
    "Self Improvement",
    "Business",
    "Software Development",
    "Relationships",
    "Blockchain",
    "Politics",
    "Cryptocurrency",
    "Artificial Intelligence",
    "JavaScript",
    "Mental Health",
    "Health",
    "Coronavirus",
    "History",
    "Entrepreneurship",
    "Self",
    "Humor",
    "Culture",
    "Education",
    "Leadership",
    "Creativity",
    "Marketing",
    "Design",
    "Women",
    "Web Development",
    "Bitcoin",
    "Productivity",
    "Fiction",
    "Christmas",
    "Data Visualization",
    "Music",
    "Family",
    "Personal Development",
    "Deep Learning",
    "Social Media",
    "Science",
    "Travel",
    "Money",
    "Finance",
    "Short Story",
    "UX",
    "Coding",
    "React",
    "Psychology",
    "News",
    "Inspiration",
    "Spirituality",
    "Parenting",
    "Work",
    "Data",
    "Self-awareness",
    "Art",
    "Christianity",
    "Writing Tips",
    "Tech",
    "Baby",
    "2020",
    "LGBTQ",
    "Books",
    "Society",
    "Motivation",
    "Ethereum",
    "Defi",
    "Investing",
    "Film",
    "Software Engineering",
    "Food",
    "Pandemic",
    "Lifestyle",
    "Crypto",
    "Trump",
    "DevOps",
    "Movies",
    "Poem",
    "AI",
    "Equality",
    "Racism",
    "Development",
    "Careers",
    "Philosophy",
    "Advice",
    "Entertainment",
    "Mindfulness",
    "Gaming",
    "Learning",
    "Freelancing",
    "Poetry On Medium",
    "Personal Growth",
    "Success",
];

type Props = {
    session: Session | null;
};

const CreateBlogs = (props: Props) => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [next, setNext] = useState([]);
    const [errorText, setErrorText] = useState("");
    const [loading, setLoading] = useState(false);
    let categories: string[] = [];
    const router = useRouter();

    const container = {
        hidden: { opacity: 1, scale: 0 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delayChildren: 0.5,
                staggerChildren: 0.2,
            },
        },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    const onMessageUpdated = (message: string) => {
        setMessage(message);
    };

    const fetchNextWords = async (str: string) => {
        if (str === "") return;
        fetch(`/api/ml/nextword?str=${str}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => setNext(data.result));
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            console.log(message);
            const words = message.split(" ");
            const last10Words = words.slice(Math.max(words.length - 10, 0));
            const str = last10Words.join(" ");
            fetchNextWords(str);
        }, 2000);

        return () => clearTimeout(delayDebounceFn);
    }, [message]);

    const onNextClick = (word: string) => {
        setMessage(message + word + " ");
        setNext([]);
    };

    const createBlog = async (
        title: string,
        message: string,
        categories: string[]
    ) => {
        const author = props.session?.user?.name;
        const authorImage = props.session?.user?.image;
        console.log(author, authorImage);
        fetch("/api/blog", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                text: message,
                tags: categories,
                author: author,
                authorImage: authorImage,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading(false);
                router.push(`/blog/${data.id}`);
            });
    };

    const onPublish = async () => {
        let error = "";
        if (title === "") {
            error = "Title cannot be empty";
        } else if (message === "") {
            error = "Message cannot be empty";
        } else if (message.length < 100) {
            error = "Message should be atleast 100 characters long";
        } else if (categories.length === 0) {
            error = "Please select atleast one category";
        }
        if (error !== "") {
            setTimeout(() => {
                setErrorText("");
            }, 3000);
            setErrorText(error);
            return;
        }
        if (!loading) {
            setLoading(true);
            createBlog(title, message, categories);
        }
    };

    if (!props.session) {
        return (
            <div className="max-w-[1420px] mx-auto flex flex-col justify-center items-center p-4 mt-32">
                <section className="bg-white dark:bg-gray-900">
                    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                        <div className="mx-auto max-w-screen-md sm:text-center">
                            <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                                Log In to create a blog...
                            </h2>
                            <button
                                onClick={() => router.push("/login")}
                                className="inline-flex items-center justify-center px-6 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="md:w-[90%] max-w-[1420px] mx-auto border-none focus:ring-0 bg-slate-50 mt-20 p-4 md:p-10 border-1 rounded dark:bg-gray-800 dark:text-white ">
            <input
                type="text"
                className="text-lg md:text-4xl border-hidden w-full antialiased italicborder-hidden overflow-scroll p-2.5 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Type your title here..."
                onChange={(e) => setTitle(e.target.value)}
            />
            {next.length > 0 && (
                <div className="">
                    <div className="mb-2">Next word suggestion</div>
                    <motion.div
                        className="flex flex-row gap-4"
                        variants={container}
                        initial="hidden"
                        animate="visible"
                    >
                        {next.map((item, id) => (
                            <motion.span
                                key={id}
                                onClick={() => onNextClick(item)}
                                className="px-4 py-2 rounded-full border-2 p-2.5 text-md text-gray-900 bg-gray-50 ring-blue-500 border-blue-500 dark:bg-gray-700 dark:text-white dark:ring-blue-500 dark:border-blue-500 font-semibold text-sm flex align-center cursor-pointer active:bg-gray-300 transition duration-300 ease"
                                variants={item}
                            >
                                {item}
                            </motion.span>
                        ))}
                    </motion.div>
                </div>
            )}
            <SpeechToText setMessage={setMessage} message={message} />

            <Multiselect
                className="mt-10 dark:bg-gray-800 dark:text-black ring-blue-500 border-blue-500"
                isObject={false}
                onKeyPressFn={function noRefCheck() {}}
                onRemove={(selectedList, selectedItem) => {
                    categories = categories.filter(
                        (item) => item !== selectedItem
                    );
                }}
                onSearch={function noRefCheck() {}}
                onSelect={(selectedList, selectedItem) => {
                    categories.push(selectedItem);
                }}
                showCheckbox={true}
                options={options}
                style={{
                    chips: {
                        background: "#53b0ee",
                    },
                    multiselectContainer: {
                        color: "#065f9a",
                    },
                    searchBox: {
                        border: "#065f9a",
                        "border-bottom": "1px solid #065f9a",
                        "border-radius": "1px",
                    },
                }}
            />

            <div className="grid place-content-center pt-10">
                <button
                    onClick={onPublish}
                    className="px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
                >
                    Publish
                </button>
                {errorText !== "" && (
                    <div className="text-xs mt-2 text-red-500 w-full mx-auto">
                        {errorText}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateBlogs;

// Path: components\CreateBlog\CreateBlog.tsx
