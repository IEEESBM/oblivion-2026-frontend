import { styled, createGlobalStyle } from "styled-components";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { MdArrowOutward } from "react-icons/md";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";

// Google Font import
const GlobalFont = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Raleway:wght@400;500;600;700&display=swap');
`;

// ─── Layout ────────────────────────────────────────────────────────────────────

const Section = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  padding: 4rem 0 3rem;
`;

/*
  OrbitStage is a fixed-size box that exactly contains the circular orbit.
  Height = 2 * radius + card_height  (the full vertical diameter of the orbit)
  We leave a little breathing room on top/bottom.

  Desktop:  radius=360, card_h=288  → orbit diameter = 360*2 + 288 = 1008px  → ~1040px stage
  Tablet:   radius=270, card_h=216  → 756 + 216 = 972px  → ~780px (cards scale down via rem)
  Mobile:   radius=210, card_h=184  → 604px  → ~620px
*/
const OrbitStage = styled.div`
  position: relative;
  width: 100%;
  /* orbit centre sits at top: RADIUS px inside the stage */
  height: 1040px;

  @media (max-width: 900px) { height: 780px; }
  @media (max-width: 600px) { height: 640px; }
`;

/* The orbit pivot sits at vertical centre of the stage */
const Orbit = styled.div`
  position: absolute;
  left: 50%;
  /* centre = half of stage height */
  top: 520px;

  @media (max-width: 900px) { top: 390px; }
  @media (max-width: 600px) { top: 320px; }
`;

// ─── Card ──────────────────────────────────────────────────────────────────────

const DivEventCard = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 30rem;
  height: 36rem;
  padding: 2.5rem;

  border-radius: 1.25rem;

  background: ${({ $alternate }) =>
    $alternate
      ? "linear-gradient(159.14deg, #1e2f72 -6.84%, #0d1b3e 118.48%)"
      : "linear-gradient(159.14deg, #0c1130 -6.84%, #0f1520 118.48%)"};

  border: 1px solid rgba(139, 92, 246, 0.25);
  backdrop-filter: blur(6px);
  transform-origin: center;
  will-change: transform;
  cursor: pointer;

  /* inner top-edge shimmer line */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg,
      transparent,
      rgba(180, 140, 255, 0.6) 40%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(180, 140, 255, 0.6) 60%,
      transparent
    );
    border-radius: 1rem;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &.is-active {
    border-color: rgba(139, 92, 246, 0.85);
    box-shadow:
      0 0 30px rgba(99, 60, 220, 0.45),
      0 0 70px rgba(80, 40, 200, 0.2),
      inset 0 0 30px rgba(99, 60, 220, 0.07);

    &::before { opacity: 1; }
  }
`;

const EventCardTitle = styled.div`
  font-family: 'Cinzel', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.04em;
  line-height: 1.2;
  margin-top: 1rem;
  text-align: center;

  /* layered glow: tight white core + wide purple halo */
  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.95),
    0 0 20px rgba(180, 140, 255, 0.85),
    0 0 45px rgba(130, 80, 255, 0.6),
    0 0 90px rgba(99, 60, 220, 0.35);
`;

const EventCardBody = styled.div`
  font-family: 'Verdana', sans-serif;
  font-size: 1.7rem;
  font-weight: 500;
  line-height: 1.55;
  color: rgba(220, 215, 255, 0.88);
`;

const EventCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
`;

const EventDate = styled.div`
  font-family: 'Raleway', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: rgba(180, 160, 255, 0.95);

  /* subtle glow on the date too */
  text-shadow:
    0 0 10px rgba(160, 120, 255, 0.7),
    0 0 28px rgba(120, 80, 220, 0.4);
`;

const ExpandEventButton = styled.button`
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  background: rgba(10, 10, 30, 0.9);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  border: 1px solid rgba(139, 92, 246, 0.5);
  flex-shrink: 0;
  transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 0 10px rgba(99, 60, 220, 0.25);

  &:hover {
    background: rgba(99, 60, 220, 0.75);
    border-color: rgba(180, 140, 255, 0.95);
    box-shadow:
      0 0 14px rgba(139, 92, 246, 0.7),
      0 0 30px rgba(99, 60, 220, 0.45);
  }
`;

// ─── Nav — sits BELOW OrbitStage, normal flow ──────────────────────────────────

const NavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 2.5rem;
  margin-top: 5rem;
  /* no absolute positioning — it's a flex child of Section */
`;

const NavDot = styled.button`
  width: ${({ $active }) => ($active ? "2rem" : "0.65rem")};
  height: 0.65rem;
  border-radius: 1rem;
  background: ${({ $active }) => ($active ? "white" : "rgba(255,255,255,0.28)")};
  border: none;
  padding: 0;
  flex-shrink: 0;
  cursor: pointer;
  transition: width 0.22s ease, background 0.22s ease;
`;

const NavArrow = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 2.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  line-height: 1;
  padding: 0;
  user-select: none;
  transition: color 0.2s ease;

  &:hover { color: rgba(139, 92, 246, 1); }
`;

// ─── Constants ─────────────────────────────────────────────────────────────────

// radius is the orbit radius in px (distance from pivot to card centre)
const RADII = { desktop: 360, tablet: 270, mobile: 210 };

// card half-sizes in px — must stay in sync with the rem values above
// (30rem @ 16px = 480px wide, 36rem = 576px tall → half = 240 x 288)
const CARD_SIZES = {
  desktop: { w: 240, h: 288 },
  tablet:  { w: 168, h: 216 },
  mobile:  { w: 144, h: 184 },
};

const ACTIVE_ANGLE = Math.PI / 2; // front card sits at bottom of orbit

// ─── Component ─────────────────────────────────────────────────────────────────

const EventSection = () => {
  const [events, setEvents] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const cardRefs    = useRef([]);
  const radiusRef   = useRef(RADII.desktop);
  const cardSizeRef = useRef(CARD_SIZES.desktop);

  useEffect(() => {
    fetch("/Events.json").then(r => r.json()).then(setEvents);
  }, []);

  useEffect(() => {
    const update = () => {
      const w  = window.innerWidth;
      const bp = w <= 600 ? "mobile" : w <= 900 ? "tablet" : "desktop";
      radiusRef.current   = RADII[bp];
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
      const x     = Math.cos(angle) * r - w / 2;
      const y     = Math.sin(angle) * r - h / 2;

      const scale   = 1 - Math.abs(offset) * 0.08;
      const opacity = 1 - Math.abs(offset) * 0.15;

      gsap.to(card, { x, y, scale, opacity, duration: 0.5, ease: "power2.out" });
      card.classList.toggle("is-active", i === target);
    });
  }, [events]);

  useGSAP(() => { positionCards(activeIndex); }, [activeIndex, events]);

  if (!events) return null;

  const next = () => setActiveIndex(p => (p + 1) % events.length);
  const prev = () => setActiveIndex(p => (p - 1 + events.length) % events.length);

  return (
    <>
      <GlobalFont />
      <Section>
        {/* ── Orbit ── */}
        <OrbitStage>
          <Orbit>
            {events.map((event, i) => (
              <DivEventCard
                key={i}
                ref={el => (cardRefs.current[i] = el)}
                $alternate={i % 2 === 0}
                onClick={() => setActiveIndex(i)}
              >
                <EventCardTitle>{event.Name}</EventCardTitle>
                <EventCardBody>{event.ShortDesc}</EventCardBody>
                <EventCardFooter>
                  <EventDate>{event.Date}</EventDate>
                  <Link
                    to="/events"
                    state={{ eventIndex: i }}
                    onClick={e => e.stopPropagation()}
                  >
                    <ExpandEventButton><MdArrowOutward /></ExpandEventButton>
                  </Link>
                </EventCardFooter>
              </DivEventCard>
            ))}
          </Orbit>
        </OrbitStage>

        {/* ── Nav — below orbit, in normal flex flow ── */}
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
      </Section>
    </>
  );
};

export default EventSection;