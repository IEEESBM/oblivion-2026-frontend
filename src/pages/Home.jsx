import NavBar from "../components/NavBar/NavBar";
import EventSection from "../components/EventSection/EventSection";
import TimerSection from "../components/TimerSection/TimerSection";
import FAQSection from "../components/FAQSection/FAQSection";
import GallerySection from "../components/GallerySection/GallerySection";
import Footer from "../components/Footer/Footer";
import { useState, useRef } from "react";
import styled from "styled-components";
import blackholeBg from "../assets/blackhole-bg.png";

// Smooth scroll
import Lenis from "@studio-freight/lenis";
const lenis = new Lenis();
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 🌌 Fixed background — stays visible across the ENTIRE page scroll.
//    To swap the image:  change the import above to point to your new file.
const FixedBackground = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image: url(${blackholeBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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

      {/* Fixed blackhole background — visible during all scroll */}
      <FixedBackground />

      <div ref={heroRef}>
        <TimerSection onIntersection={handleTimerIntersection} />
      </div>
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
  );
}

export default Home;
