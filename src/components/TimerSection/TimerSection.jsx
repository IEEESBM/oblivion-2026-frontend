import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// --- Animations ---
const pulseGlow = keyframes`
  0%, 80% { text-shadow: 0 0 20px rgba(138, 43, 226, 0.4), 0 0 40px rgba(99, 20, 200, 0.2); }
  50%       { text-shadow: 0 0 35px rgba(138, 43, 226, 0.8), 0 0 70px rgba(99, 20, 200, 0.5), 0 0 100px rgba(30, 10, 100, 0.3); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(3rem); }
  to   { opacity: 1; transform: translateY(0); }
`;

const digitFlip = keyframes`
  0%   { opacity: 0.4; transform: scaleY(0.85); }
  10%  { opacity: 1;   transform: scaleY(1); }
  100% { opacity: 1;   transform: scaleY(1); }
`;

// --- Styled Components ---

const Section = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding-top: 10rem;
  overflow-x: hidden;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3.2rem;
  padding: 2rem 2rem 4rem;
  animation: ${fadeUp} 0.9s ease both;
  width: 100%;
  max-width: 100%;
`;

const EventLabel = styled.p`
  font-family: "Poppins", sans-serif;
  font-size: clamp(1.4rem, 2.2vw, 2.2rem);
  font-weight: 600;
  letter-spacing: 0.45em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);

  @media (max-width: 480px) {
    letter-spacing: 0.25em;
  }
`;

const EventTitle = styled.h1`
  font-family: "Poppins", sans-serif;
  font-size: clamp(2.6rem, 5vw, 6rem);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #ffffff;
  text-align: center;
  line-height: 1.1;
  animation: ${pulseGlow} 3.5s ease-in-out infinite;
`;

/* ── Timer row ── */
const TimerRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: clamp(1.2rem, 2.5vw, 3.5rem);

  @media (max-width: 480px) {
    gap: 0.8rem;
  }

  /* Extra tight on very small phones */
  @media (max-width: 400px) {
    gap: 0.4rem;
  }
`;

const TimerUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  min-width: clamp(6rem, 12vw, 16rem);

  @media (max-width: 480px) {
    min-width: clamp(5rem, 13vw, 8rem);
  }

  @media (max-width: 400px) {
    min-width: clamp(4rem, 11vw, 6rem);
    gap: 0.4rem;
  }
`;

const Digit = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: clamp(6.4rem, 14vw, 18rem);
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
  display: block;
  letter-spacing: -0.02em;
  animation: ${digitFlip} 0.35s ease both;
  text-shadow:
    0 0 30px rgba(160, 100, 255, 0.5),
    0 0 60px rgba(100, 40, 200, 0.25);

  @media (max-width: 480px) {
    font-size: clamp(5rem, 18vw, 8rem);
  }

  /* Significantly smaller on tiny phones to prevent overflow */
  @media (max-width: 400px) {
    font-size: clamp(4rem, 13vw, 6rem);
  }
`;

const UnitLabel = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: clamp(1rem, 1.4vw, 1.6rem);
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);

  @media (max-width: 400px) {
    font-size: 0.9rem;
    letter-spacing: 0.15em;
  }
`;

const Separator = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: clamp(4.5rem, 10vw, 13rem);
  font-weight: 900;
  color: rgba(160, 100, 255, 0.75);
  line-height: 1;
  margin-top: 0.1em;
  user-select: none;
  animation: ${pulseGlow} 1.2s ease-in-out infinite;

  @media (max-width: 480px) {
    font-size: clamp(3.5rem, 12vw, 6rem);
  }

  @media (max-width: 400px) {
    font-size: clamp(3rem, 10vw, 5rem);
  }
`;

const Divider = styled.div`
  width: clamp(28rem, 60vw, 90rem);
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(160, 100, 255, 0.5) 30%,
    rgba(100, 40, 220, 0.8) 50%,
    rgba(160, 100, 255, 0.5) 70%,
    transparent
  );

  @media (max-width: 400px) {
    width: 90%;
  }
`;

const RegisterButton = styled(Link)`
  display: inline-block;
  padding: clamp(0.8rem, 1.5vw, 1.2rem) clamp(2rem, 4vw, 4rem);
  background: rgba(25, 10, 80, 0.75);
  border: 2px solid rgba(160, 110, 255, 0.8);
  border-radius: 50rem;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: clamp(1rem, 1.5vw, 1.7rem);
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease, transform 0.15s ease, box-shadow 0.25s ease;
  box-shadow: 0 0 18px rgba(130, 60, 255, 0.25), inset 0 0 20px rgba(130, 60, 255, 0.05);

  &:hover {
    background: rgba(60, 20, 160, 0.85);
    border-color: rgba(200, 160, 255, 0.95);
    box-shadow: 0 0 32px rgba(160, 90, 255, 0.55), inset 0 0 30px rgba(130, 60, 255, 0.12);
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(0px);
  }
`;

// --- Helpers ---
const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

// ⏰ SET YOUR EVENT DATE HERE
const EVENT_DATE = new Date("2026-04-11T17:30:00").getTime();

function getTimeLeft() {
  const distance = EVENT_DATE - Date.now();
  if (distance <= 0) return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  return {
    days:    pad(Math.floor(distance / (1000 * 60 * 60 * 24))),
    hours:   pad(Math.floor((distance / (1000 * 60 * 60)) % 24)),
    minutes: pad(Math.floor((distance / (1000 * 60)) % 60)),
    seconds: pad(Math.floor((distance / 1000) % 60)),
  };
}

// --- Component ---
function TimerSection({ onIntersection }) {
  const [time, setTime] = useState(getTimeLeft);

  const [ref] = useInView({
    onChange: (inView) => { if (inView) onIntersection(); },
  });

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { value: time.days,    label: "Days" },
    { value: time.hours,   label: "Hours" },
    { value: time.minutes, label: "Minutes" },
    { value: time.seconds, label: "Seconds" },
  ];

  return (
    <Section ref={ref}>
      <Content>
        <EventLabel>Oblivion 2026</EventLabel>

        <EventTitle>Event Starts In</EventTitle>

        <TimerRow>
          {units.map((unit, i) => (
            <React.Fragment key={unit.label}>
              <TimerUnit>
                <Digit key={unit.value}>{unit.value}</Digit>
                <UnitLabel>{unit.label}</UnitLabel>
              </TimerUnit>
              {i < units.length - 1 && <Separator>:</Separator>}
            </React.Fragment>
          ))}
        </TimerRow>

        <Divider />

        <RegisterButton to="/events">Register Now</RegisterButton>
      </Content>
    </Section>
  );
}

TimerSection.propTypes = {
  onIntersection: PropTypes.func,
};

export default TimerSection;