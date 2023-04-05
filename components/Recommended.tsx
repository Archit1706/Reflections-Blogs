import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Mountain from "../assets/mountain.jpg";
import Forest from "../assets/forest.jpg";
import River from "../assets/river.jpg";
import Cards from "./Cards/Cards";

import { motion } from "framer-motion";
type Props = {
    bid?: string;
};
type Blog = {
    img: string;
    isMemberOnly: boolean;
    title: string;
    desc: string;
    autherImg: string;
    autherName: string;
    dateOfPost: string;
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
const Recommended = (props: Props) => {
    const router = useRouter();
    const [recs, setRecs] = useState<Blog[]>([]);
    const bid = props.bid;
    const fetchRecs = async () => {
        if (bid) {
            // @ts-ignore
            fetch(`/api/blog/recommend?id=${bid}`)
                .then((res) => res.json())
                .then((data) => {
                    data.length = 6;
                    setRecs(data);
                });
        }
    };
    useEffect(() => {
        fetchRecs();
    }, [bid]);

    const onRecClick = (id: string) => {
        router.push(`/blog/${id}`);
    };

    return (
        Array.isArray(recs) && (
            <div className="max-w-[1420px] mx-auto flex flex-col justify-center items-center p-4 dark:bg-zinc-800 bg-white mt-12">
                <h1 className="text-center mt-8 text-3xl lg:text-4xl tracking-tight font-extrabold text-zinc-800 dark:text-white">
                    Recommended Just For You!
                </h1>

                <motion.div
                    variants={container}
                    className="p-4 mt-4 gap-y-12 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 md:gap-x-8 md:gap-y-12"
                >
                    {/* <!--Card 1--> */}

                    {recs?.length > 0 &&
                        Array.isArray(recs) &&
                        recs?.map((rec: any) => {
                            return (
                                <motion.div
                                    variants={item}
                                    className="rounded-md shadow-md hover:scale-105 ease-in duration-300 cursor-pointer dark:shadow-sm dark:shadow-blue-200"
                                    key={rec.id}
                                >
                                    <div
                                        onClick={() => onRecClick(rec.id)}
                                        className="flex flex-col w-full"
                                    >
                                        <img
                                            src={`https://source.unsplash.com/random/?${rec?.tags.join(
                                                ","
                                            )}`}
                                            alt=""
                                            className="aspect-video object-cover rounded shadow-md"
                                        />
                                        <div className="p-4">
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
                                    </div>
                                </motion.div>
                            );
                        })}
                </motion.div>
            </div>
        )
    );
};

export default Recommended;
