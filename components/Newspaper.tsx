import Link from "next/link";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

type Props = {};

const Newspaper = (props: Props) => {
    const forms = useRef();
    const to_name = "User";
    const [user_email, setEmail] = useState("");
    const from_name = "Reflections";
    const message =
        "Dear User, \nThank you for subscribing to our newsletter! We're thrilled to have you as part of our community and look forward to sharing our latest updates and insights with you. \nAs a subscriber, you can expect to receive regular updates on our products, services, and industry news. We'll also share helpful tips and resources to help you make the most of your experience with us.\n If you have any questions or feedback, please don't hesitate to reach out to our team. We're always here to help and value your input. \n Thank you again for subscribing, and we hope you enjoy our newsletter! \nBest regards, \n Reflections Blogs";

    const sendEmail = (e: any) => {
        e.preventDefault();
        // toast("Sending Email...");

        const templateId = "template_v6r31lq";
        const serviceId = "service_lnoxb6a";

        console.log(templateId, serviceId, email, forms.current);

        console.log("Run");
        emailjs
            .sendForm(serviceId, templateId, forms.current, "ofA0AhGQztY1881q-")

            .then(
                (result) => {
                    toast.success("Newsletter Subscribed!");
                },
                (error) => {
                    console.log(forms.current, error);
                }
            );

        console.log("message sent");
    };

    return (
        <div className="max-w-[1420px] mx-auto flex flex-col justify-center items-center mt-12">
            <section className="bg-white dark:bg-zinc-800 w-full">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div className="mx-auto max-w-screen-md sm:text-center">
                        <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-zinc-800 sm:text-4xl dark:text-white">
                            Sign up for our newsletter
                        </h2>
                        <p className="mx-auto mb-8 max-w-2xl font-light text-zinc-500 md:mb-12 sm:text-xl dark:text-zinc-400">
                            Stay up to date with the roadmap progress,
                            announcements and exclusive blogs feel free to sign
                            up with your email.
                        </p>
                        <form ref={forms} onSubmit={sendEmail}>
                            <input
                                type="hidden"
                                name="to_name"
                                value={to_name}
                            />
                            <input
                                type="hidden"
                                name="from_name"
                                value={from_name}
                            />

                            <input
                                type="hidden"
                                name="message"
                                value={message}
                            />
                            <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
                                <div className="relative w-full">
                                    <label
                                        htmlFor="email"
                                        className="hidden mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-300"
                                    >
                                        Email address
                                    </label>
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <svg
                                            className="w-5 h-5 text-zinc-500 dark:text-zinc-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                        </svg>
                                    </div>
                                    <input
                                        className="block p-3 pl-10 w-full text-sm text-zinc-800 bg-zinc-50 rounded-lg border border-zinc-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Enter your email"
                                        type="email"
                                        id="email"
                                        name="user_email"
                                        value={user_email}
                                        onChange={(e: any) => {
                                            setEmail(e.target.value);
                                        }}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="submit"
                                        className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-pointer bg-primary-700 border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                        value={"Subscribe"}
                                    />
                                </div>
                            </div>
                            <div className="mx-auto max-w-screen-sm text-sm text-left text-zinc-500 newsletter-form-footer dark:text-zinc-300">
                                We care about the protection of your data.{" "}
                                <Link
                                    href="/private-policy"
                                    className="font-medium text-primary-600 dark:text-primary-500 hover:underline"
                                >
                                    Read our Privacy Policy
                                </Link>
                                .
                            </div>
                        </form>

                        {/* <form ref={forms} onSubmit={sendEmail}>
                            <label>Name</label>
                            <input type="text" name="user_name" />
                            <label>Email</label>
                            <input type="email" name="user_email" />
                            <label>Message</label>
                            <textarea name="message" />
                            <input type="submit" value="Send" />
                        </form> */}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Newspaper;
