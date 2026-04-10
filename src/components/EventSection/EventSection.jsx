import { styled, keyframes } from "styled-components";
import React, { useRef, useState, useEffect } from "react";
import { MdArrowOutward } from "react-icons/md";
import { useInView } from "react-intersection-observer";

//gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  margin-top: -40vh;
  padding-bottom: 10rem;   /* ✅ ADD THIS */

  @media (max-width: 760px) {
    padding: 0 0 10rem 0;
    margin-top: -50vh;
  }
`;

const DivScrolling = styled.div`
  overflow-x: hidden;
  padding-bottom: 4rem;  /* ✅ add this */
`;

const Div = styled.div`
  /* margin-top: 16rem; */
  margin-top: max(30rem, calc((100vh - 44rem) / 2));
  margin-left: 50vw;
  margin-bottom: 6rem; 
  width: fit-content;
  display: flex;
  justify-content: center;
  gap: 7.5rem;

  @media (max-width: 760px) {
    margin-left: 0;
    width: 100%;
    padding: 0 1.8rem;
    flex-direction: column;
    justify-content: center;
    gap: 10rem;
    height: fit-content;
    overflow: hidden;
  }
`;
/*
const DivEventCard = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 42rem;
  height: 44rem;

  background: ${({ alternate }) =>
    alternate
      ? "linear-gradient(159.14deg, #7179ecb9 -6.84%, #212121 118.48%)"
      : "linear-gradient(159.14deg, #010101 -6.84%, #212121 118.48%)"};

  border-radius: 1rem;
  border: 1px solid rgba(170, 170, 170, 0.6);
  @media (max-width: 760px) {
    width: 100%;
    height: 48rem;
    padding: 2rem 2rem 0 2rem;
  }
    opacity:0.85;
  padding: 3rem 3rem 0 3rem;
  backdrop-filter: blur(2px);
`;
*/

const DivEventCard = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 42rem;
  height: 44rem;

  padding: 3rem;

  border-radius: 4.5rem;

  background: ${({ alternate }) =>
    alternate
      ? "linear-gradient(160deg, rgba(138,43,226,0.25), rgba(0,0,0,0.9))"
      : "linear-gradient(160deg, rgba(0,0,0,0.9), rgba(30,30,30,0.9))"};

  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);

  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 0 15px rgba(129, 29, 223, 0.3);
    border: 1px solid rgba(138, 43, 226, 0.6);
  }

  @media (max-width: 760px) {
    width: 100%;
    height: 48rem;
  }
`;


const EventCardTitle = styled.div`
  font-size: 3rem;
  margin-bottom:2.5rem;
  font-weight: 300;
  
  color: #e6caff;
  text-shadow: 0 0 8px rgba(230, 202, 255, 0.5), 0 0 16px rgba(138, 43, 226, 0.15);
  @media (max-width: 760px) {
    font-size: 4rem;
    margin-bottom:1rem;
  }
`;

const EventCardBody = styled.div`
  font-size: 2rem;
  line-height: 1.4;
  font-weight: 500;
  word-wrap: wrap;
  color: white;
  @media (max-width: 760px) {
    font-size: 2.0rem;
    line-height: 1.4;
  }
  margin-top: 1.4rem;
`;

const DivEventCardBottom = styled.div`
  margin-top: auto;
`;

const EventCardLine = styled.div`
  border-bottom: solid 0.2rem rgba(255, 255, 255, 0.2);
  font-size: 2rem;
  padding-bottom: 1.4rem;
  label {
    color: #9882f8;
  }
  span {
    color: #fff;
  }
`;

const EventDate = styled.div`
  font-size: 2rem;
  font-weight: 375;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 760px) {
    font-size: 2.6rem;
  }
`;

const EventCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 6.2rem;
`;

const HighlightButton = keyframes`
  to {
    border: 0.1rem solid rgba(255, 255, 255, 1);
  }
`;

const ExpandEventButton = styled.button`
  width: 7rem;
  height: 4rem;
  /* margin-right: 4rem; */
  border-radius: 2.5rem;
  border: 0.1rem solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(
    93.71deg,
    #202020 0%,
    rgba(32, 32, 32, 0.69) 107.41%
  );
  color: white;
  font-size: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    animation: ${HighlightButton} 0.15s linear 1 forwards;
  }
  @media (max-width: 760px) {
    font-size: 2.6rem;
    width: 6rem;
  }
`;

const EventSection = React.forwardRef(({ onIntersection }, forwardedRef) => {
  const [ref, inView] = useInView({
    onChange: (inView) => {
      if (inView) {
        onIntersection();
      }
    },
  });

  const horizontalScrollingSection = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(min-width: 760px)", () => {
      let eventCards = gsap.utils.toArray(".eventCard");
      gsap.to(eventCards, {
        xPercent: -110 * eventCards.length,
        ease: "none",
        scrollTrigger: {
          trigger: horizontalScrollingSection.current,
          pin: true,
          scrub: 1,
          // snap: 1 / (eventCards.length - 1),

          end: () => "+=" + horizontalScrollingSection.current.offsetWidth,
        },
      });
    });
  });

  const [events, setEvents] = useState(null);

  useEffect(() => {
    fetch("/Events.json")
      .then((response) => response.json())
      .then((Events) => {
        setEvents(Events);
      });
  }, []);

  return (
    <Section id="event">
      <div ref={forwardedRef}>
        <DivScrolling ref={horizontalScrollingSection}>
          <Div ref={ref}>
            {Array.from({ length: 7 }).map((_, index) => (
              <DivEventCard key={index} className="eventCard" alternate={index % 2 === 0}>
                <EventCardTitle>{events && events[index].Name}</EventCardTitle>
                <EventCardBody>
                  {events && events[index].ShortDesc}
                </EventCardBody>
                <DivEventCardBottom>
                  <EventCardLine>
                    {events && events[index]["Prize Pool"] && (
                      <div>
                        <label>Prize Pool: </label>
                        <span>
                          &#8377;{events && events[index]["Prize Pool"]}
                        </span>
                      </div>
                    )}
                  </EventCardLine>
                  <EventCardFooter>
                    <EventDate>{events && events[index].Date}</EventDate>
                    <Link to={`/events`} state={{ eventIndex: index }}>
                      <ExpandEventButton>
                        <MdArrowOutward />
                      </ExpandEventButton>
                    </Link>
                  </EventCardFooter>
                </DivEventCardBottom>
              </DivEventCard>
            ))}
          </Div>
        </DivScrolling>
      </div>z
    </Section>
  );
});

EventSection.displayName = "EventSection";

export default EventSection;
