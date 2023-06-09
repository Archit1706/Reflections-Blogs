"use client";
import React, { useEffect, useState } from "react";
import data from "./sample.json";
import { ChevronLeftIcon, PlayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Blog from "@/types/Blog";
import { useRouter } from "next/navigation";
import { TextToSpeech, useTts } from "tts-react";
import parse from "html-react-parser";
import Link from "next/link";
import Comments from "components/Comments";
import { BsBookmarkCheckFill, BsBookmarkDash } from "react-icons/bs";
import { motion } from "framer-motion";
type Props = {};

const blogDetail = {
    id: 56920,
    title: "Algorithms Explained",
    text: "Photo by Siora Photography on Unsplash\n\nI answered this way:\n\nThat’s probably a habit you picked up as a child when any size denomination of money would have been viewed as valuable and worth accumulating.\n\nOld habits like that are hard to break, even after we become adults. Besides, it’s a harmless habit.\n\nPersonally, I’ve graduated to actively looking for quarters, although I won’t pass up other coins.\n\nI wrote a poem that gives my philosophy on being selective about which pennies I reach down to pick up:\n\n__________________\n\nThanks for reading.",
    authors: "Margherita Gilley",
    timestamp: "2020-06-25 14:39:13.134000+00:00",
    tags: "Culture Society Book Review Trends Algorithms",
    image: "https://miro.medium.com/max/1400/0*UPrR_YckGORrt5LF",
};

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

const BlogDetail = ({ params }: any) => {
    const play = () => {};
    const bid = params["bid"];
    const [blog, setBlog] = useState<Blog>();
    const [recs, setRecs] = useState<Blog[]>([]);
    const [summary, setSummery] = useState<string>("");
    const [readFull, setReadFull] = useState(false);

    const router = useRouter();

    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const usrEmail = localStorage.getItem("userEmail");
        if (usrEmail?.length > 0) {
            setUserEmail(usrEmail);
            fetchBookmarks();
        }
    }, [userEmail]);
    const fetchBlog = async () => {
        if (bid) {
            // @ts-ignore
            fetch(`/api/blog/${bid}`)
                .then((res) => res.json())
                .then((data) => setBlog(data));
        }
    };
    const fetchRecs = async () => {
        if (bid) {
            // @ts-ignore
            fetch(`/api/blog/recommend?id=${bid}`)
                .then((res) => res.json())
                .then((data) => setRecs(data));
        }
    };
    const fetchSummary = async (text: string) => {
        fetch(`/api/ml/summerizer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: text,
            }),
        })
            .then((res) => res.json())
            .then((data) => setSummery(data.result));
    };

    const fetchBookmarks = () => {
        if (userEmail.length > 0) {
            fetch(`/api/user/get-bookmarks?userEmail=${userEmail}`)
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) setIsLiked(data.includes(bid));
                });
        }
    };

    useEffect(() => {
        if (blog && summary === "") fetchSummary(blog.text);
    }, [blog]);
    useEffect(() => {
        fetchBlog();
        fetchRecs();
    }, []);

    useEffect(() => {
        if (bid) {
            localStorage.setItem("bid", bid);
        }
    }, [bid]);
    const [scroll, setScroll] = useState("");
    useEffect(() => {
        let progressBarHandler = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;

            setScroll(scroll);
        };

        window.addEventListener("scroll", progressBarHandler);

        return () => window.removeEventListener("scroll", progressBarHandler);
    });

    const formatDate = (date: string | undefined) => {
        if (data === undefined) return "";
        const d = new Date(date!);
        return d.toDateString();
    };

    const onRecClick = (id: string) => {
        router.push(`/blog/${id}`);
    };

    const [isLiked, setIsLiked] = useState(false);
    const addBookmarked = (bid: string) => {
        setIsLiked(!isLiked);
        fetch(`/api/user/bookmark`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userEmail: userEmail,
                blogId: bid,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            });
    };
    const deleteBookmarked = (bid: string) => {
        setIsLiked(!isLiked);
        fetch(`/api/user/bookmark`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userEmail: userEmail,
                blogId: bid,
            }),
        })
            .then((res) => res.json())
            .then((data) => {});
    };

    return (
        <div className="flex flex-col">
            <div id="progressBarContainer">
                <div
                    id="progressBar"
                    style={{
                        transform: `scale(${scroll}, 1)`,
                        opacity: `${scroll}`,
                    }}
                />
            </div>
            <div className="flex flex-col flex-grow w-screen mx-auto p-4 md:p-8 dark:bg-zinc-800 bg-gray-100">
                <div className="mt-20 flex flex-row items-center cursor-pointer">
                    <ChevronLeftIcon className="h-4 w-4 text-blue-500 dark:text-white" />
                    <div
                        onClick={() => router.back()}
                        className="ml-2 text-md font-bold text-blue-500 dark:text-white"
                    >
                        Back to home
                    </div>
                </div>
                <div className="mt-6">
                    {blog && blog?.tags && blog?.tags?.length > 0 && (
                        <img
                            src={`https://source.unsplash.com/random/?${blog?.tags?.join(
                                ","
                            )}`}
                            alt=""
                            className="w-full max-h-[300px] lg:max-h-[450px] object-cover"
                        />
                    )}
                </div>
                <div className="flex flex-row mt-6 flex-wrap gap-3 md:gap-1">
                    {blog &&
                        blog?.tags?.map((tag, id) => (
                            <span
                                key={id}
                                className="px-4 py-1.5 mr-2 rounded-full text-blue-500 dark:text-white dark:bg-[#213ABF] bg-blue-100 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-zinc-300 transition duration-300 ease"
                            >
                                <Link href={`/blogs?category=${tag}`}>
                                    {tag}
                                </Link>
                            </span>
                        ))}
                </div>
                <div className="mt-4 md:text-4xl text-3xl font-bold dark:text-white">
                    {blog?.title}
                </div>
                {summary && summary.length > 0 && (
                    <div className="mt-12">
                        <div className="text-2xl font-bold mb-2 dark:text-white">
                            Summary
                        </div>
                        <article className=" dark:text-[#D1CFDB] text-left">
                            {summary}
                        </article>
                    </div>
                )}
                <div className="flex mt-8 justify-between">
                    <div className="flex mt-8 ">
                        <img
                            className="h-20 w-20 rounded-full"
                            src={`https://api.dicebear.com/5.x/personas/svg?seed=${blog?.authors}}`}
                        />
                        <div className="flex flex-col justify-evenly ml-4">
                            <div className=""></div>
                            <div className="uppercase dark:text-white font-semibold">
                                {blog?.authors}
                            </div>
                            <div className="dark:text-[#D1CFDB] font-semibold">
                                {formatDate(blog?.timestamp)}
                            </div>
                        </div>
                    </div>
                    {isLiked ? (
                        <BsBookmarkCheckFill
                            className="h-10 w-10 dark:text-white"
                            onClick={() => deleteBookmarked(blog.id)}
                        />
                    ) : (
                        <BsBookmarkDash
                            className="h-10 w-10 dark:text-white"
                            onClick={() => addBookmarked(blog.id)}
                        />
                    )}
                </div>

                <div className="flex justify-center items-center">
                    <button
                        className="justify-center px-5 py-3 mr-3 w-max  text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
                        onClick={() => setReadFull(!readFull)}
                    >
                        {readFull ? "Hide Blog" : "Read Full Blog"}
                    </button>
                </div>

                {readFull && (
                    <>
                        <hr className="h-px my-8 bg-zinc-200 border-0 dark:bg-zinc-700" />
                        <div className="mt-6 text-left new-line text-lg dark:text-[#D1CFDB]">
                            {/*  */}
                            <article>
                                <TextToSpeech
                                    align="vertical"
                                    allowMuting
                                    markBackgroundColor="#55AD66"
                                    markColor="white"
                                    markTextAsSpoken
                                    onBoundary={function noRefCheck() {}}
                                    onEnd={function noRefCheck() {}}
                                    onError={function noRefCheck() {}}
                                    onPause={function noRefCheck() {}}
                                    onPitchChange={function noRefCheck() {}}
                                    onRateChange={function noRefCheck() {}}
                                    onStart={function noRefCheck() {}}
                                    onVolumeChange={function noRefCheck() {}}
                                    position="topLeft"
                                    rate={1}
                                    size="medium"
                                    volume={1}
                                >
                                    {blog?.text}
                                </TextToSpeech>
                            </article>
                        </div>
                    </>
                )}

                <div className="mt-8">
                    {recs && recs.length > 0 && (
                        <div>
                            <div className="text-2xl font-bold dark:text-white">
                                You May Also Like
                            </div>
                            <motion.div
                                variants={container}
                                className="w-full grid grid-cols-1 md:grid-cols-2 mt-4 gap-6 justify-between"
                            >
                                {recs &&
                                    recs.length > 0 &&
                                    recs.map((rec) => (
                                        <motion.div
                                            variants={item}
                                            className="shadow-md dark:shadow-sm dark:shadow-blue-200 rounded-md hover:scale-105 ease-in duration-300 cursor-pointer"
                                            key={rec.id}
                                        >
                                            <div
                                                onClick={() =>
                                                    onRecClick(rec.id)
                                                }
                                                className="flex flex-col w-full"
                                            >
                                                <img
                                                    src={`https://source.unsplash.com/random/?${rec?.tags.join(
                                                        ","
                                                    )}`}
                                                    alt="Image"
                                                    className="aspect-video object-cover rounded-md"
                                                />
                                                <div className="flex mt-3">
                                                    {rec.tags.length > 0 && (
                                                        <span
                                                            key={0}
                                                            className="px-3 py-1 mr-2 rounded-full text-blue-500 dark:text-white dark:bg-[#213ABF] bg-blue-100 font-semibold text-xs flex align-center w-max cursor-pointer active:bg-zinc-300 transition duration-300 ease"
                                                        >
                                                            {rec.tags[0]}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-md mt-2 font-semibold dark:text-white">
                                                    {rec.title}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                            </motion.div>
                        </div>
                    )}
                </div>
                <Comments blog={blog} />
            </div>
        </div>
    );
};

export default BlogDetail;
