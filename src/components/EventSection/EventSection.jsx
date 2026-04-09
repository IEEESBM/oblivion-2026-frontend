import { styled } from "styled-components";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { MdArrowOutward } from "react-icons/md";
import { useInView } from "react-intersection-observer";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";

//Styled Components 

const Section = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: visible;
`;

const ORBIT_TOP_DESKTOP = 420;
const ORBIT_TOP_TABLET  = 340;
const ORBIT_TOP_MOBILE  = 282;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 900px;
  overflow: visible;

  @media (max-width: 900px) { height: 732px; }
  @media (max-width: 600px) { height: 610px; }
`;

const Orbit = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  left: 50%;
  top: ${ORBIT_TOP_DESKTOP}px;

  @media (max-width: 900px) { top: ${ORBIT_TOP_TABLET}px; }
  @media (max-width: 600px) { top: ${ORBIT_TOP_MOBILE}px; }
`;

const DivEventCard = styled.div`
  position: absolute;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24rem;
  height: 30rem;

  background: ${({ $alternate }) =>
    $alternate
      ? "linear-gradient(159.14deg, #15B3D6 -6.84%, #212121 118.48%)"
      : "linear-gradient(159.14deg, #010101 -6.84%, #212121 118.48%)"};

  border-radius: 1rem;
  border: 1px solid rgba(170, 170, 170, 0.6);
  padding: 2rem 2rem 0 2rem;
  backdrop-filter: blur(2px);
  transform-origin: center center;
  will-change: transform, opacity;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &.is-active {
    border-color: rgba(255, 255, 255, 0.85);
    box-shadow: 0 0 40px rgba(21, 179, 214, 0.2);
  }

  @media (max-width: 900px) {
    width: 20rem;
    height: 26rem;
    padding: 1.6rem 1.6rem 0 1.6rem;
  }

  @media (max-width: 600px) {
    width: 17rem;
    height: 22rem;
    padding: 1.4rem 1.4rem 0 1.4rem;
  }
`;

const EventCardTitle = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;

  @media (max-width: 900px) { font-size: 1.9rem; }
  @media (max-width: 600px) { font-size: 1.6rem; }
`;

const EventCardBody = styled.div`
  font-size: 1.3rem;
  line-height: 1.4;
  font-weight: 400;
  color: white;

  @media (max-width: 600px) { font-size: 1.2rem; }
`;

const DivEventCardBottom = styled.div`
  margin-top: auto;
`;

const EventCardLine = styled.div`
  border-bottom: solid 0.2rem rgba(255, 255, 255, 0.2);
  font-size: 1.6rem;
  padding-bottom: 0.7rem;
  label { color: #9882f8; }
  span  { color: #fff; }

  @media (max-width: 600px) { font-size: 1.3rem; }
`;

const EventDate = styled.div`
  font-size: 1.8rem;
  font-weight: 375;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 900px) { font-size: 1.6rem; }
  @media (max-width: 600px) { font-size: 1.4rem; }
`;

const EventCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
`;

const ExpandEventButton = styled.button`
  width: 5rem;
  height: 3rem;
  border-radius: 2.5rem;
  border: 0.1rem solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(93.71deg, #202020 0%, rgba(32,32,32,0.69) 107.41%);
  color: white;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.15s linear;

  &:hover { border-color: rgba(255, 255, 255, 1); }

  @media (max-width: 600px) {
    font-size: 1.8rem;
    width: 4.4rem;
    height: 2.6rem;
  }
`;

// Navigation

const NavRow = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 890px;
  z-index: 20;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 900px) { top: 700px; }
  @media (max-width: 600px) { top: 600px; gap: 0.7rem; }
`;

const NavDot = styled.button`
  width: ${({ $active }) => ($active ? "2.2rem" : "0.7rem")};
  height: 0.7rem;
  border-radius: 0.4rem;
  background: ${({ $active }) =>
    $active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)"};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  @media (max-width: 600px) {
    width: ${({ $active }) => ($active ? "1.8rem" : "0.6rem")};
    height: 0.6rem;
  }
`;

const NavArrow = styled.button`
  width: 3.2rem;          // ↓ reduced from 4.4rem
  height: 3.2rem;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1.6rem;      // ↓ reduced from 2.2rem
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 600px) {
    width: 2.8rem;        // ↓ tighter for mobile
    height: 2.8rem;
    font-size: 1.4rem;
  }
`;

// Constants (pixel values must mirror CSS at your root font-size)

const CARD_COUNT = 7;

const CARD_SIZES = {
  desktop: { w: 192, h: 240 },
  tablet:  { w: 160, h: 208 },
  mobile:  { w: 136, h: 176 },
};

const RADII = { desktop: 280, tablet: 220, mobile: 180 };

const ACTIVE_ANGLE = Math.PI / 2;

//Main Component

const EventSection = React.forwardRef(({ onIntersection }, forwardedRef) => {
  const [ref, inView] = useInView({
    onChange: (inView) => { if (inView) onIntersection(); },
  });

  const [events, setEvents]       = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs   = useRef([]);
  const orbitRef   = useRef(null);
  const radiusRef  = useRef(RADII.desktop);
  const cardSzRef  = useRef(CARD_SIZES.desktop);

  useEffect(() => {
    fetch("/Events.json").then((r) => r.json()).then(setEvents);
  }, []);

  // Keep radius + card pixel size in sync with viewport
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const bp = vw <= 600 ? "mobile" : vw <= 900 ? "tablet" : "desktop";
      radiusRef.current = RADII[bp];
      cardSzRef.current = CARD_SIZES[bp];
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const positionCards = useCallback((targetIndex, animate = true) => {
    const n = CARD_COUNT;
    const r = radiusRef.current;
    const { w, h } = cardSzRef.current;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;

      let offset = ((i - targetIndex) % n + n) % n;
      if (offset > n / 2) offset -= n;

      const angle = ACTIVE_ANGLE + (offset / n) * 2 * Math.PI;
      const x = Math.cos(angle) * r - w / 2;
      const y = Math.sin(angle) * r - h / 2;

      const normDist = Math.abs(offset) / (n / 2);
      const scale    = 1 - normDist * 0.38;
      const opacity  = 1 - normDist * 0.65;
      const zIndex   = Math.round((1 - normDist) * 10);
      const rotateZ  = offset * -3.5;

      gsap.to(card, {
        x, y, scale, opacity, rotateZ, zIndex,
        duration: animate ? 0.55 : 0,
        ease: "power3.out",
        overwrite: true,
      });

      card.classList.toggle("is-active", i === targetIndex);
    });
  }, []);

  useGSAP(
    () => { positionCards(activeIndex, true); },
    { dependencies: [activeIndex, positionCards] }
  );

  useGSAP(() => { positionCards(0, false); }, []);

  const goTo = (index) => setActiveIndex((index + CARD_COUNT) % CARD_COUNT);
  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  const dragStart = useRef(null);
  const onPointerDown = (e) => { dragStart.current = e.clientX; };
  const onPointerUp = (e) => {
    if (dragStart.current === null) return;
    const delta = dragStart.current - e.clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    dragStart.current = null;
  };

  return (
    <Section id="event">
      <div ref={forwardedRef} style={{ position: "relative", width: "100%" }}>
        <CarouselWrapper
          ref={ref}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <Orbit ref={orbitRef}>
            {Array.from({ length: CARD_COUNT }).map((_, index) => (
              <DivEventCard
                key={index}
                $alternate={index % 2 === 0}
                ref={(el) => (cardRefs.current[index] = el)}
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => goTo(index)}
              >
                <div>
                  <EventCardTitle>{events ? events[index].Name : ""}</EventCardTitle>
                  <EventCardBody>{events ? events[index].ShortDesc : ""}</EventCardBody>
                </div>
                <DivEventCardBottom>
                  <EventCardLine>
                    {events && events[index]["Prize Pool"] && (
                      <div>
                        <label>Prize Pool: </label>
                        <span>&#8377;{events[index]["Prize Pool"]}</span>
                      </div>
                    )}
                  </EventCardLine>
                  <EventCardFooter>
                    <EventDate>{events ? events[index].Date : ""}</EventDate>
                    <Link to={`/events`} state={{ eventIndex: index }}>
                      <ExpandEventButton onClick={(e) => e.stopPropagation()}>
                        <MdArrowOutward />
                      </ExpandEventButton>
                    </Link>
                  </EventCardFooter>
                </DivEventCardBottom>
              </DivEventCard>
            ))}
          </Orbit>

          <NavRow>
            <NavArrow onClick={prev} aria-label="Previous">‹</NavArrow>
            {Array.from({ length: CARD_COUNT }).map((_, i) => (
              <NavDot
                key={i}
                $active={i === activeIndex}
                onClick={() => goTo(i)}
                aria-label={`Go to event ${i + 1}`}
              />
            ))}
            <NavArrow onClick={next} aria-label="Next">›</NavArrow>
          </NavRow>
        </CarouselWrapper>
      </div>
    </Section>
  );
});

EventSection.displayName = "EventSection";
export default EventSection;