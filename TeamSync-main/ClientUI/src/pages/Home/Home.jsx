import React from "react";
import Navbar from "../../components/Navbar";
import Hero from "./Hero";
import Feartures from "./Feartures";
import Blog from "./Blog";
import HelpCenter from "./HelpCentre";
import Footer from "../../components/Footer";
function Home() {
    return (
        <div>
            <Navbar />
            <Hero />
            <Feartures />
            <Blog />
            <HelpCenter />
            <Footer />
        </div>
    );
}

export default Home;
