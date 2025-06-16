import React from "react";
import smartCollaboration from "../../assets/Smart Collaboration.png";
import taskAutomation from "../../assets/Customizable Workflows.png";
import multiPlatform from "../../assets/MultiplatformAccess.png";
import realTimeMessaging from "../../assets/Real-TimeMessaging.png";
import integratedCalendar from "../../assets/Integrated Calendar.png";
import seamlessFileSharing from "../../assets/SeamlessFileSharing.png";

const features = [
    {
        title: "Smart Collaboration",
        description: "Boost team productivity with seamless communication and task management.",
        image: smartCollaboration
    },
    {
        title: "Task Automation",
        description: "Automate repetitive tasks and workflows to save time and increase efficiency.",
        image: taskAutomation
    },
    {
        title: "Multi-Platform Access",
        description: "Stay connected anywhere with our mobile and web applications.",
        image: multiPlatform
    },
    {
        title: "Real-Time Messaging",
        description: "Chat instantly with teammates, share files, and collaborate on projects.",
        image: realTimeMessaging
    },
    {
        title: "Integrated Calendar",
        description: "Plan, schedule, and track meetings with built-in calendar integration.",
        image: integratedCalendar
    },
    {
        title: "Seamless File Sharing",
        description: "Upload, share, and collaborate on documents securely in the cloud.",
        image: seamlessFileSharing
    }
]; const Features = () => {
    return (
        <section id="featuresSection" className="hero bg-cover relative bg-gradient-to-b from-gray-100 to-gray-100 flex flex-col items-center justify-center pt-20 md:pt-40">

            {/* Heading remains fixed */}
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 hover:text-indigo-600 transition duration-500 ease-in-out mb-8 text-center">
                Why to use TeamSync
            </h1>

            {/* Scrollable container for cards only on small screens */}
            <div className="w-full sm:w-auto overflow-x-auto pb-4">
                <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <div key={index} className="flex-none w-[280px] sm:w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center transition-all hover:scale-105 hover:shadow-xl">
                            <img src={feature.image} alt={feature.title} className="w-full h-64 object-contain rounded-xl" />
                            <h3 className="text-lg font-semibold text-gray-900 mt-2">{feature.title}</h3>
                            <p className="text-gray-700 mt-1 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
