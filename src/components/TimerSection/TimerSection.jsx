import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "./TimerSection.css";
import { useInView } from "react-intersection-observer";
// import backgroundImage from "../../assets/timer-background.svg";

// const Section = styled.section`
//   background-color: #000;
//   padding: 40rem 0 10rem 0;

//   @media (max-width: 760px) {
//     padding: 20rem 0;
//   }

//   background-image: url("../../assets/timer-background.svg");
// `;
const Section = styled.section`
  padding: 10rem 0 0 0;
  transform: translateY(-70vh);
  /* background-color: #000; */

  @media (max-width: 760px) {
    padding: 10rem 0;
  }
`;

function TimerSection({ onIntersection }) {
  const [time, setTime] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const [ref, inView] = useInView({
    onChange: (inView) => {
      if (inView) {
        onIntersection();
      }
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const eventTime = new Date("2025-03-29T23:59:59").getTime(); // Change this to your target event time
      const distance = eventTime - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTime({
        days: formatTime(days),
        hours: formatTime(hours),
        minutes: formatTime(minutes),
        seconds: formatTime(seconds),
      });

      if (distance < 0) {
        clearInterval(interval);
        setTime({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  return (
    <Section ref={ref}>
      <div className="timer_container">
        <div className="timer">
          <div className="timer_element">
            <div className="timer_number" id="days">
              {time.days}
            </div>
            <div className="timer_label">days</div>
          </div>
          <div className="timer_dots">:</div>
          <div className="timer_element">
            <div className="timer_number" id="hours">
              {time.hours}
            </div>
            <div className="timer_label">hours</div>
          </div>
          <div className="timer_dots">:</div>
          <div className="timer_element">
            <div className="timer_number" id="minutes">
              {time.minutes}
            </div>
            <div className="timer_label">minutes</div>
          </div>
          <div className="timer_dots">:</div>
          <div className="timer_element">
            <div className="timer_number" id="seconds">
              {time.seconds}
            </div>
            <div className="timer_label">seconds</div>
          </div>
        </div>
        <div className="timer_text">
          Get ready to delve into the world of ODYSSEY and explore possibilities beyond your imagination!
          <br/>
          <br/>
          Total Prize Pool: &#8377;28,000
        </div>
      </div>
    </Section>
  );
}

export default TimerSection;
