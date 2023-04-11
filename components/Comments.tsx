import Blog from "@/types/Blog";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DoughnutChart from "./Charts/Doughnut";
import Comment from "@/types/Comment";
type Props = {
    blog: Blog;
};

const Comments = (props: Props) => {
    let comments = props?.blog?.comments;
    const [comment, setComment] = useState("");
    const good = true;
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const router = useRouter();

    const submitComment = async () => {
        if (comment === "") return;
        const blogId = props?.blog?.id;
        const res = await fetch(`/api/blog/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: blogId,
                comment: comment,
                author: localStorage.getItem("author"),
                authorImage: localStorage.getItem("authorImage"),
            }),
        });
        const data = await res.json();
        setComment("");
        props?.blog?.comments?.push(data.result);
        comments = props?.blog?.comments;
    };

    const [positiveCount, setPositiveCount] = useState(0);
    const [negativeCount, setNegativeCount] = useState(0);

    useEffect(() => {
        const newPositiveCount = comments?.reduce((count, comment) => {
            if (comment?.sentiment === "positive") {
                return count + 1;
            } else {
                return count;
            }
        }, 0);

        setPositiveCount(newPositiveCount);
        setNegativeCount(comments?.length - newPositiveCount);
    }, [comments, positiveCount]);

    // useEffect(() => {
    //     setPositiveComments(
    //         comments?.filter((comment) => {
    //             comment?.sentiment === "positive";
    //         })
    //     );
    //     setNegativeComments(
    //         comments?.filter((comment) => {
    //             comment?.sentiment === "negative";
    //         })
    //     );
    // }, [props?.blog?.comments]);

    const commentData = {
        labels: ["Positive", "Negative"],
        datasets: [
            {
                label: "Sentiment Analysis on Comments",
                data: [positiveCount, negativeCount],
                backgroundColor: ["#2ecc71", "#d63031"],
                hoverOffset: 4,
            },
        ],
    };
    return (
        <div className="max-w-[1420px] mx-0 flex flex-col justify-center items-center p-4 dark:bg-zinc-900 mt-12">
            <section className="w-full bg-white dark:bg-zinc-900 py-8 lg:py-16">
                <div className="flex flex-col justify-center items-center gap-4">
                    <h2 className="font-bold text-lg text-zinc-600 dark:text-zinc-300 tracking-wide">
                        Sentiment Analysis on Comments
                    </h2>
                    <div className="h-80 w-80 md:h-96 md:w-96">
                        <DoughnutChart data={commentData} />
                    </div>
                </div>
                <div className="max-w-2xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg lg:text-2xl font-bold text-zinc-900 dark:text-white">
                            Discussion ({comments?.length})
                        </h2>
                    </div>
                    {isLoggedIn ? (
                        <div className="">
                            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
                                <label htmlFor="comment" className="sr-only">
                                    Your comment
                                </label>
                                <textarea
                                    id="comment"
                                    rows={6}
                                    onChange={(e) => setComment(e.target.value)}
                                    value={comment}
                                    className="px-0 w-full text-sm text-zinc-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-zinc-400 dark:bg-zinc-800"
                                    placeholder="Write a comment..."
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                onClick={submitComment}
                                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                            >
                                Post comment
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center">
                            <button
                                type="submit"
                                onClick={() => router.push("/login")}
                                className="inline-flex items-center mb-8 mx-auto py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                            >
                                Login to add a Comment
                            </button>
                        </div>
                    )}
                    {/* <form className="mb-6"> */}

                    {/* </form> */}
                    {/* {console.log(comments)} */}
                    {comments &&
                        Array.isArray(comments) &&
                        comments.map((comment, id) => {
                            let avatar = comment?.text.split(" ")[0];
                            return (
                                <article
                                    key={id}
                                    className="p-6 text-base bg-white border-t border-zinc-200 dark:border-zinc-700 dark:bg-zinc-900"
                                >
                                    <footer className="flex justify-between items-center mb-2">
                                        <div className="flex items-center">
                                            <p className="inline-flex items-center mr-3 text-sm text-zinc-900 dark:text-white">
                                                <img
                                                    className="mr-2 w-6 h-6 rounded-full"
                                                    src={
                                                        comment?.authorImage ||
                                                        `https://api.dicebear.com/5.x/personas/svg?seed=${avatar}}`
                                                    }
                                                    alt=""
                                                />
                                            </p>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                {comment?.author ||
                                                    "Anonymous User"}
                                            </p>
                                            {/* <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        <time
                          pubdate
                          datetime="2022-06-23"
                          title="June 23rd, 2022"
                        >
                          {comment?.timestamp}
                        </time>
                      </p> */}
                                        </div>
                                        {comment?.sentiment == "positive" ? (
                                            <button
                                                title="Good Comment"
                                                id="dropdownComment4Button"
                                                data-dropdown-toggle="dropdownComment4"
                                                className="inline-flex items-center p-2 text-sm font-medium text-center text-zinc-400 bg-white rounded-lg hover:bg-zinc-100 focus:ring-4 focus:outline-none focus:ring-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-700 dark:focus:ring-zinc-600"
                                                type="button"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="w-8 h-8"
                                                >
                                                    <path
                                                        fill-rule="evenodd"
                                                        fill="green"
                                                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z"
                                                        clip-rule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        ) : (
                                            <button
                                                title="Bad Comment"
                                                id="dropdownComment4Button"
                                                data-dropdown-toggle="dropdownComment4"
                                                className="inline-flex items-center p-2 text-sm font-medium text-center text-zinc-400 bg-white rounded-lg hover:bg-zinc-100 focus:ring-4 focus:outline-none focus:ring-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-700 dark:focus:ring-zinc-600"
                                                type="button"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="w-8 h-8"
                                                >
                                                    <path
                                                        fill="red"
                                                        fill-rule="evenodd"
                                                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm-4.34 7.964a.75.75 0 01-1.061-1.06 5.236 5.236 0 013.73-1.538 5.236 5.236 0 013.695 1.538.75.75 0 11-1.061 1.06 3.736 3.736 0 00-2.639-1.098 3.736 3.736 0 00-2.664 1.098z"
                                                        clip-rule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                    </footer>
                                    <p className="text-zinc-500 dark:text-zinc-400">
                                        {comment?.text}
                                    </p>
                                </article>
                            );
                        })}
                </div>
            </section>
        </div>
    );
};

export default Comments;
