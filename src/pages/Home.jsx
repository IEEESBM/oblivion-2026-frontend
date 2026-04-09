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

// 🌌 Fixed background + overlay baked into one element.
//    The dark vignette is a CSS gradient layer stacked ON TOP of the image.
//    Because it's a single element there is no boundary where darkness changes
//    — every section on the page sees exactly the same tint → no seams.
//    To swap the image: change the import above.
const FixedBackground = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    /* vignette layer — sits on top of the image */
    radial-gradient(
      ellipse 120% 100% at 50% 20%,
      rgba(0, 0, 0, 0.15) 0%,
      rgba(0, 0, 0, 0.55) 65%,
      rgba(0, 0, 0, 0.78) 100%
    ),
    /* the blackhole image behind */
    url(${blackholeBg}) center / cover no-repeat;
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
