import React, { useState } from "react";
import teamsynclogo from "../assets/teamsyncLogo.png";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { FcHome } from "react-icons/fc";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { MdOutlinePriceChange } from "react-icons/md";
import { LiaHandsHelpingSolid } from "react-icons/lia";
import { FaBlog } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeNavbar = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-blue-50 px-6 py-3 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-md">
      <div className="w-15">
        <a href="/">
          <img src={teamsynclogo} alt="TeamSync Logo" className="w-full" />
        </a>

      </div>


      <div className="md:hidden w-full text-center mb-4">
        <h3 className="text-2xl font-bold text-blue-800">
          Teamsync
        </h3>
        <p>Uniting Your Team on sync</p>
      </div>




      <ul className="hidden md:flex gap-10 text-gray-700 font-medium">
        <li>
          <a href="/" className="flex items-center gap-1 hover:text-blue-600 hover:border-b-2 cursor-pointer transition-all">
            <FcHome /> Home
          </a>
        </li>
        <li>
          <a href="/#featuresSection" className="flex items-center gap-1 hover:text-blue-600 hover:border-b-2 cursor-pointer transition-all">
            <MdOutlineFeaturedPlayList /> Features
          </a>
        </li>
        <li>
          <a href="/#pricing" className="flex items-center gap-1 hover:text-blue-600 hover:border-b-2 cursor-pointer transition-all">
            <MdOutlinePriceChange /> Pricing
          </a>
        </li>
        <li>
          <a href="/#blog" className="flex items-center gap-1 hover:text-blue-600 hover:border-b-2 cursor-pointer transition-all">
            <FaBlog /> Blog
          </a>
        </li>
        <li>
          <a href="/#help" className="flex items-center gap-1 hover:text-blue-600 hover:border-b-2 cursor-pointer transition-all">
            <LiaHandsHelpingSolid /> Help Center
          </a>
        </li>
      </ul>

      <div className="hidden md:flex gap-4 bg-gradient-to-r from-blue-500 to-teal-400 rounded-xl p-1">
        <Link to="/UserAuth/login">
          <button className="px-2 py-1 text-white rounded-lg hover:bg-blue-700 transition">
            Login
          </button>
        </Link>

        <Link to="/UserAuth/signup">
          <button className="px-2 py-1 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition">
            SignUP
          </button>
        </Link>
      </div>

      <button className="md:hidden text-gray-700" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md p-5 md:hidden flex flex-col items-center gap-4">

          <ul className="flex flex-col gap-4 text-gray-700 text-lg">
            <li>
              <a href="/" className="flex items-center gap-1 hover:text-blue-600 hover:border-b-2 cursor-pointer transition-all" onClick={closeNavbar}>
                <FcHome /> Home
              </a>
            </li>
            <li>
              <a href="/#featuresSection" className="flex items-center gap-1 hover:text-blue-600 hover:border-b-2 cursor-pointer transition-all" onClick={closeNavbar}>
                <MdOutlineFeaturedPlayList /> Features
              </a>
            </li>
            <li>
              <a href="/#pricing" className="flex items-center gap-1 hover:text-blue-600 hover:border-b-2 cursor-pointer transition-all" onClick={closeNavbar}>
                <MdOutlinePriceChange /> Pricing
              </a>
            </li>
            <li>
              <a href="/#blog" className="flex items-center gap-1 hover:text-blue-600 hover:border-b-2 cursor-pointer transition-all" onClick={closeNavbar}>
                <FaBlog /> Blog
              </a>
            </li>
            <li>
              <a href="/#help" className="flex items-center gap-1 hover:text-blue-600 hover:border-b-2 cursor-pointer transition-all" onClick={closeNavbar}>
                <LiaHandsHelpingSolid /> Help Center
              </a>
            </li>
          </ul>


          <Link to="/UserAuth/signup">
            <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Get Started
            </button>
          </Link>



        </div>
      )}
    </nav>
  );
};

export default Navbar;