import NavBar from "../components/NavBar/NavBar";
import EventSection from "../components/EventSection/EventSection";
import MobileHero from "../components/MobileHero/MobileHero";
import TimerSection from "../components/TimerSection/TimerSection";
import FAQSection from "../components/FAQSection/FAQSection";
import GallerySection from "../components/GallerySection/GallerySection";
import Footer from "../components/Footer/Footer";
import { useState, useRef } from "react";
import Spline from "@splinetool/react-spline";
import styled from "styled-components";

//smooth scroll
import Lenis from "@studio-freight/lenis";
const lenis = new Lenis();

// lenis.on("scroll", (e) => {
//   console.log(e);
// });

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
//

const SectionHero = styled.section`
  height: 100vh;
  width: 100vw;
  background-color: #000;

  .ThreeD-scene-hero {
  }
`;

function Home({
  isLoading,
  isMobileNavOpen,
  onMobileNavOpen,
  toggleLoginSignup,
  isLoggedIn,
  setInitialEventIndex,
}) {
  const [visibleSection, setVisibleSection] = useState("");

  //make the loader funcitonal, wait's for a minimum of 4 seconds, or till the scene loads.
  // const delayTimeoutRef = useRef();
  // useEffect(() => {
  //   // Set a minimum 4-second delay
  //   delayTimeoutRef.current = setTimeout(() => setIsLoading(false), 4000);

  //   // Return a cleanup function to clear the timeout when the component unmounts
  //   return () => {
  //     clearTimeout(delayTimeoutRef.current);
  //   };
  // }, []);

  const eventRef = useRef(null);
  const FAQRef = useRef(null);
  const galleryRef = useRef(null);
  const heroRef = useRef(null);

  const scrollToEvent = () => {
    lenis.scrollTo(eventRef.current);
  };

  const scrollToFAQ = () => {
    lenis.scrollTo(FAQRef.current);
  };

  const scrollToGallery = () => {
    lenis.scrollTo(galleryRef.current);
  };

  const scrollToHero = () => {
    lenis.scrollTo(heroRef.current);
  };

  const handleTimerIntersection = () => {
    setVisibleSection("");
  };

  const handleEventIntersection = () => {
    setVisibleSection("EventSection");
  };

  const handleFAQIntersection = () => {
    setVisibleSection("FAQSection");
  };

  const handleGalleryIntersection = () => {
    setVisibleSection("GallerySection");
  };

  return (
    <>
      <NavBar
        scrollToEvent={scrollToEvent}
        scrollToFAQ={scrollToFAQ}
        scrollToGallery={scrollToGallery}
        scrollToHero={scrollToHero}
        visibleSection={visibleSection}
        toggleLoginSignup={toggleLoginSignup}
        isMobileNavOpen={isMobileNavOpen}
        onMobileNavOpen={onMobileNavOpen}
        isLoggedIn={isLoggedIn}
      />

      {!isLoading && (
        <>
          <div className="sticky top-0 h-screen -z-10">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              poster="/bg-preview.jpg"
            >
              <source
                src="https://res.cloudinary.com/drz1xi0a0/video/upload/v1742841458/odyssey_avwg3r.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
          <TimerSection onIntersection={handleTimerIntersection} />
          <EventSection
            ref={eventRef}
            onIntersection={handleEventIntersection}
            setInitialEventIndex={setInitialEventIndex}
          />
          <FAQSection ref={FAQRef} onIntersection={handleFAQIntersection} />
          <GallerySection
            ref={galleryRef}
            onIntersection={handleGalleryIntersection}
          />
          <Footer scrollToHero={scrollToHero} />
        </>
      )}
    </>
  );
}

export default Home;
