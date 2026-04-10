import { styled } from "styled-components";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { MdArrowOutward } from "react-icons/md";
import { useInView } from "react-intersection-observer";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";

// Styled Components

const Section = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 900px;

  @media (max-width: 900px) { height: 732px; }
  @media (max-width: 600px) { height: 610px; }
`;

const Orbit = styled.div`
  position: absolute;
  left: 50%;
  top: 420px;

  @media (max-width: 900px) { top: 340px; }
  @media (max-width: 600px) { top: 282px; }
`;

const DivEventCard = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 24rem;
  height: 30rem;
  padding: 2rem;

  border-radius: 1rem;

  background: ${({ $alternate }) =>
    $alternate
      ? "linear-gradient(159.14deg, #15B3D6 -6.84%, #212121 118.48%)"
      : "linear-gradient(159.14deg, #010101 -6.84%, #212121 118.48%)"};

  border: 1px solid rgba(170, 170, 170, 0.6);
  backdrop-filter: blur(2px);

  transform-origin: center;
  will-change: transform;

  cursor: pointer;

  &.is-active {
    border-color: white;
    box-shadow: 0 0 40px rgba(21, 179, 214, 0.3);
  }
`;

const EventCardTitle = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: white;
`;

const EventCardBody = styled.div`
  font-size: 1.3rem;
  color: white;
`;

const EventCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EventDate = styled.div`
  color: white;
`;

const ExpandEventButton = styled.button`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: black;
  color: white;
  cursor: pointer;
`;

// Nav

const NavRow = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 850px;
  display: flex;
  gap: 1rem;
`;

const NavDot = styled.button`
  width: ${({ $active }) => ($active ? "2rem" : "0.6rem")};
  height: 0.6rem;
  border-radius: 1rem;
  background: ${({ $active }) =>
    $active ? "white" : "rgba(255,255,255,0.3)"};
  border: none;
`;

const NavArrow = styled.button`
  background: transparent;
  color: white;
  font-size: 2rem;
  cursor: pointer;
`;

// Constants

const RADII = { desktop: 280, tablet: 220, mobile: 180 };
const CARD_SIZES = {
  desktop: { w: 192, h: 240 },
  tablet: { w: 160, h: 208 },
  mobile: { w: 136, h: 176 },
};

const ACTIVE_ANGLE = Math.PI / 2;

// Component

const EventSection = () => {
  const [events, setEvents] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const cardRefs = useRef([]);
  const radiusRef = useRef(RADII.desktop);
  const cardSizeRef = useRef(CARD_SIZES.desktop);

  useEffect(() => {
    fetch("/Events.json").then(res => res.json()).then(setEvents);
  }, []);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const bp = w <= 600 ? "mobile" : w <= 900 ? "tablet" : "desktop";
      radiusRef.current = RADII[bp];
      cardSizeRef.current = CARD_SIZES[bp];
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const positionCards = useCallback((target) => {
    if (!events) return;

    const n = events.length;
    const r = radiusRef.current;
    const { w, h } = cardSizeRef.current;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;

      let offset = ((i - target) % n + n) % n;
      if (offset > n / 2) offset -= n;

      const angle = ACTIVE_ANGLE + (offset / n) * 2 * Math.PI;

      const x = Math.cos(angle) * r - w / 2;
      const y = Math.sin(angle) * r - h / 2;

      const scale = 1 - Math.abs(offset) * 0.15;
      const opacity = 1 - Math.abs(offset) * 0.2;

      gsap.to(card, {
        x,
        y,
        scale,
        opacity,
        duration: 0.5
      });

      card.classList.toggle("is-active", i === target);
    });
  }, [events]);

  useGSAP(() => {
    positionCards(activeIndex);
  }, [activeIndex, events]);

  if (!events) return null;

  const next = () => setActiveIndex((prev) => (prev + 1) % events.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + events.length) % events.length);

  return (
    <Section>
      <CarouselWrapper>
        <Orbit>
          {events.map((event, i) => (
            <DivEventCard
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              $alternate={i % 2 === 0}
              onClick={() => setActiveIndex(i)}
            >
              <EventCardTitle>{event.Name}</EventCardTitle>
              <EventCardBody>{event.ShortDesc}</EventCardBody>

              <EventCardFooter>
                <EventDate>{event.Date}</EventDate>
                <Link to="/events" state={{ eventIndex: i }}>
                  <ExpandEventButton>
                    <MdArrowOutward />
                  </ExpandEventButton>
                </Link>
              </EventCardFooter>
            </DivEventCard>
          ))}
        </Orbit>

        <NavRow>
          <NavArrow onClick={prev}>‹</NavArrow>
          {events.map((_, i) => (
            <NavDot
              key={i}
              $active={i === activeIndex}
              onClick={() => setActiveIndex(i)}
            />
          ))}
          <NavArrow onClick={next}>›</NavArrow>
        </NavRow>
      </CarouselWrapper>
    </Section>
  );
};

export default EventSection;