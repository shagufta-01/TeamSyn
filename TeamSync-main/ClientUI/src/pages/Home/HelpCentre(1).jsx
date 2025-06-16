import React from "react";
import Customerservicepng from "../../assets/CustomerService.png"

const HelpCenter = () => {
    return (
        <section
            id="help"
            className="hero min-h-screen relative bg-gradient-to-b from-blue-100 to-gray-100 pt-20 md:pt-32"
        >
            <div className="max-w-6xl mx-auto px-4 mb-12 flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 text-left mb-8 md:mb-0">
                    <h1 className="text-6xl font-bold text-blue-700 mb-4">Help Center</h1>
                    <p className="text-gray-700 text-lg mb-6 max-w-md">
                        Find answers to common questions or reach out for personalized support.
                    </p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <img
                        src="https://imgs.search.brave.com/yL6uaOAMqbNXRhwADajrbEXQCW2TjxqG7TQPVPlZxzQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aHVic3BvdC5jb20v/aHViZnMvY3VzdG9t/ZXItc2VydmljZS10/ZWNoLXN1cHBvcnQu/d2VicA"
                        alt="Customer support team"
                        className="rounded-lg shadow-lg"
                    />
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-5xl mx-auto px-4 mb-16">
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <div className="flex items-center mb-6">
                        <img
                            src="https://imgs.search.brave.com/4MGECuQwZtYkZ-e3aPbf8X-aUvENG72dVu_UdujTTcs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAwLzMzLzA1LzIy/LzM2MF9GXzMzMDUy/Mjg4X1YzeUVZaWpp/Ylg1bEVIVU5uQjVm/UFdSTlVPWTJzQ2dF/LmpwZw"
                            alt="FAQ icon"
                            className="w-10 h-10 mr-4"
                        />
                        <h2 className="text-2xl font-semibold text-blue-800">Frequently Asked Questions</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-5 rounded-lg hover:shadow-md transition">
                            <h3 className="font-medium text-blue-600 mb-2">How do I reset my password?</h3>
                            <p className="text-black">Click the "Forgot Password" link on the login page and follow the instructions sent to your email.</p>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-lg hover:shadow-md transition">
                            <h3 className="font-medium text-blue-600 mb-2">What payment methods do you accept?</h3>
                            <p className="text-black-600">We accept all major credit cards, PayPal, and bank transfers for business accounts.</p>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-lg hover:shadow-md transition">
                            <h3 className="font-medium text-blue-600 mb-2">How do I cancel my subscription?</h3>
                            <p className="text-black-600">You can cancel anytime from your account settings under "Subscriptions".</p>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-lg hover:shadow-md transition">
                            <h3 className="font-medium text-blue-600 mb-2">Do you offer refunds?</h3>
                            <p className="text-black-600">Yes, we offer a 30-day money-back guarantee on all our plans.</p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="max-w-5xl mx-auto px-4 mb-16">
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-2/5 mb-6 md:mb-0 flex justify-center items-start">
                            <img
                                src={Customerservicepng}

                                alt="Contact us illustration"
                                className="rounded-lg h-fit"
                            />
                        </div>
                        <div className="md:w-3/5 md:pl-8">
                            <div className="flex items-center mb-6">
                                <img
                                    src="https://imgs.search.brave.com/GwU-H305ZkxX3hCzPf0W0w-3yjC_q8NJVbDRBIVnibQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTExMzY2Ny9waG90/by9nb3QtYS1wcm9i/bGVtLWNvbnRhY3Qt/dXMuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPVhZNkNkVFM0/UGxraVMycndfRVdt/SmRnN19mRzVvNHQy/OHh4TDVHVTlkMEU9"
                                    alt="Contact icon"
                                    className="w-8 h-8 mr-3"
                                />
                                <h2 className="text-2xl font-semibold text-blue-800">Contact Us</h2>
                            </div>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-1">Topic</label>
                                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option>Select a topic</option>
                                        <option>Technical Support</option>
                                        <option>Billing Question</option>
                                        <option>Account Issue</option>
                                        <option>Feature Request</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="mb-5">
                                    <label className="block text-gray-700 font-medium mb-1">Message</label>
                                    <textarea
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="How can we help you today?"
                                        rows="4"
                                    ></textarea>
                                </div>
                                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                    Submit Request
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Support Options */}
            <div className="max-w-5xl mx-auto px-4 mb-16">
                <h2 className="text-2xl font-semibold text-center text-blue-800 mb-8">Additional Support Options</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
                        <div className="flex justify-center mb-4">
                            <img
                                src="https://imgs.search.brave.com/KAJBLHdrD40kz1lwJ8ve-JRj3lCWRs0nXsJ_DfvJrlE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Y3JlYXRlLnZpc3Rh/LmNvbS9hcGkvbWVk/aWEvc21hbGwvMTMx/ODUyNjIvc3RvY2st/cGhvdG8tbGl2ZS1j/aGF0LWJ1dHRvbi1v/bi1tb2Rlcm4tY29t/cHV0ZXIta2V5Ym9h/cmQ"
                                alt="Live chat icon"
                                className="w-16 h-16 rounded-full"
                            />
                        </div>
                        <h3 className="text-xl font-medium text-blue-700 mb-2">Live Chat</h3>
                        <p className="text-gray-600 mb-4">Chat with our support team in real-time during business hours.</p>
                        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">Start Chat</button>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
                        <div className="flex justify-center mb-4">
                            <img
                                src="https://imgs.search.brave.com/MVE9KdRyQvsvKnFrGsHhNOnKVZ0tMe05iknot-UCLwQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWMt/Y2RuLmF0bGFzc2lh/bi5jb20vZGFtL2pj/cjo0Yzg1MTc3NS0y/MDRiLTQ2ODEtYTY2/OS0zM2UxYTZkZjhm/ZmYvS25vd2xlZGdl/JTIwbWFuYWdlbWVu/dC1rbm93bGVkZ2Ul/MjBiYXNlLnBuZz9j/ZG5WZXJzaW9uPTI1/Njc"
                                alt="Knowledge base icon"
                                className="w-16 h-16 rounded-full"
                            />
                        </div>
                        <h3 className="text-xl font-medium text-blue-700 mb-2">Knowledge Base</h3>
                        <p className="text-gray-600 mb-4">Browse our extensive library of tutorials and guides.</p>
                        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">Browse Articles</button>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
                        <div className="flex justify-center mb-4">
                            <img
                                src="https://imgs.search.brave.com/X160ih1H3NcpaWLYDJoRmVCpxW_GJx0imxrUQPb7--Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA1LzA0LzUzLzE1/LzM2MF9GXzUwNDUz/MTU0M19QWlU2MmhQ/cDlMMXhPbE4xZmFx/SVFTSVVPQnNtTlJh/Yy5qcGc"
                                alt="Community forum icon"
                                className="w-16 h-16 rounded-full"
                            />
                        </div>
                        <h3 className="text-xl font-medium text-blue-700 mb-2">Community Forum</h3>
                        <p className="text-gray-600 mb-4">Connect with other users and share solutions.</p>
                        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">Join Discussion</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HelpCenter;