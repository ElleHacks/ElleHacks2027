import { useState } from 'react'
import Hero from "./components/Hero/Hero";
import AboutUs from "./components/AboutUs/AboutUs";
import Sponsors from "./components/Sponsors/Sponsors";
import InterestedInSponsoring from "./components/InterestedInSponsoring/InterestedInSponsoring";
import FAQ from "./components/FAQ/FAQ";
import Location from "./components/Location/Location";
import MeetTheTeam from "./components/MeetTheTeam/MeetTheTeam";
import ContactUs from "./components/ContactUs/ContactUs";

// This is where we arrange the different sections of the website

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-container">
      <div id="hero"></div>
      <Hero />
      <div id="aboutus"></div>
      <AboutUs />
      <div id="sponsors"></div>
      <Sponsors />
      <div id="iis"></div>
      <InterestedInSponsoring />
      <div id="faq"></div>
      <FAQ />
      <div id="location"></div>
      <Location />
      <div id="meettheteam"></div>
      <MeetTheTeam />
      <div id="contactus"></div>
      <ContactUs />
    </div>
  );
}

export default App
