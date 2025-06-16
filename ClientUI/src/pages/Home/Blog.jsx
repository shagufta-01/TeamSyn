import React, { useState } from "react";
import blog from "../../assets/blog.png";


const Blog = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const truncatedContent = `In today’s fast-paced work environment, seamless collaboration is the key to success. Whether you are managing a remote team or working in an office, using the right collaboration tools can enhance communication, improve efficiency, and streamline workflows.`;

    const fullContent = (
        <>
            {truncatedContent}
            <br /><br />
            Features of Smart Collaboration Tools:
            <ul className="list-disc  pl-5 mt-2">
                <li>✅ Instant Communication – Chat and video call features help teams stay connected.</li>
                <li>✅ Task Management – Assign, track, and manage tasks within a shared workspace.</li>
                <li>✅ File Sharing & Storage – Easily upload, share, and access important documents.</li>
                <li>✅ Integration with Other Tools – Sync with calendars, email, and project management apps.</li>
            </ul>
        </>
    );

    return (
        <section
            id="blog"
            className="hero bg-cover min-h-screen relative bg-gradient-to-b from-gray-100 to-blue-100 flex items-center justify-center pt-20 md:pt-40"
        >
            <div className="max-w-screen-lg mx-auto p-5 sm:p-10 md:p-16">
                <div className="mb-10 rounded overflow-hidden flex flex-col mx-auto">
                    <h1 className="text-6xl sm:text-6xl font-bold    text-gray-900 hover:text-indigo-600 transition duration-500 ease-in-out mb-4">
                        Boost Productivity with Smarter Collaboration Tools
                    </h1>

                    <div className="relative">
                        <img className="w-full rounded-2xl"  src={blog} alt="Sunset in the mountains" />

                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="absolute bottom-0 right-0 bg-indigo-600 px-6 m-2 py-2 text-white hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out flex items-center"
                        >
                            <span className="text-lg">|</span>&nbsp;&nbsp;<span>{isExpanded ? "Read less" : "Read more"}</span>
                        </button>
                    </div>

                    <span className="text-black py-5 text-lg leading-8">
                        {isExpanded ? fullContent : truncatedContent}
                    </span>

                    <div className="py-5 text-md font-regular text-gray-900 flex">
                        <span className="mr-3 flex flex-row items-center">
                            <svg
                                className="text-indigo-600"
                                fill="currentColor"
                                height="13px"
                                width="13px"
                                viewBox="0 0 512 512"
                            >
                                <path
                                    d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M277.333,256
                                    c0,11.797-9.536,21.333-21.333,21.333h-85.333c-11.797,0-21.333-9.536-21.333-21.333s9.536-21.333,21.333-21.333h64v-128
                                    c0-11.797,9.536-21.333,21.333-21.333s21.333,9.536,21.333,21.333V256z"
                                />
                            </svg>
                            <span className="ml-1">15 min ago</span>
                        </span>

                        <a  className="flex flex-row items-center hover:text-indigo-600">
                            <svg
                                className="text-indigo-600"
                                fill="currentColor"
                                height="16px"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                                />
                            </svg>
                            <span className="ml-1">Owaiseeeee</span>
                        </a>
                    </div>

                    <hr />
                </div>
            </div>
        </section>
    );
};

export default Blog;