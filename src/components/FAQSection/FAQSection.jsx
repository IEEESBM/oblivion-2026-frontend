import styled, { keyframes } from "styled-components";
import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import classNames from "classnames";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import "./styles.css";
import { useInView } from "react-intersection-observer";

const Section = styled.section`
  margin: 40rem 0 30rem 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 760px) {
    margin: 20rem 0;
  }
`;

const Div = styled.div`
  min-height: 100vh;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 40px 20px;
`;

const borderPulse = keyframes`
  0%, 100% {
    box-shadow:
      0 0 0 1px rgba(80, 120, 255, 0.08),
      0 0 40px rgba(80, 100, 220, 0.18),
      0 0 80px rgba(60, 80, 200, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }
  50% {
    box-shadow:
      0 0 0 1px rgba(100, 140, 255, 0.15),
      0 0 55px rgba(90, 120, 240, 0.28),
      0 0 100px rgba(70, 90, 210, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }
`;

const FAQContainer = styled.div`
  border: 1px solid rgba(120, 160, 255, 0.3);
  border-radius: 4px;
  padding: 52px 48px;
  background: linear-gradient(
    160deg,
    rgba(10, 10, 30, 0.85) 0%,
    rgba(18, 12, 45, 0.75) 50%,
    rgba(8, 8, 25, 0.9) 100%
  );
  width: 100%;
  max-width: 740px;
  backdrop-filter: blur(20px);
  animation: ${borderPulse} 4s ease-in-out infinite;
  position: relative;
  overflow: hidden;

  /* Corner accents */
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-color: rgba(120, 180, 255, 0.6);
    border-style: solid;
    filter: drop-shadow(0 0 4px rgba(120, 180, 255, 0.5));
  }
  &::before {
    top: -1px;
    left: -1px;
    border-width: 2px 0 0 2px;
  }
  &::after {
    bottom: -1px;
    right: -1px;
    border-width: 0 2px 2px 0;
  }

  @media (max-width: 760px) {
    padding: 32px 24px;
    border-radius: 4px;
  }
`;

const FAQTitle = styled.h3`
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: rgba(160, 195, 255, 0.85);
  text-align: center;
  margin-bottom: 40px;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(120, 170, 255, 0.5), 0 0 40px rgba(80, 130, 255, 0.2);
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(120, 170, 255, 0.7), transparent);
    box-shadow: 0 0 8px rgba(120, 170, 255, 0.5);
    margin: 14px auto 0;
  }

  @media (max-width: 760px) {
    font-size: 11px;
    margin-bottom: 28px;
  }
`;

const AccordionTrigger = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header className="AccordionHeader">
      <Accordion.Trigger
        className={classNames("AccordionTrigger", className)}
        {...props}
        ref={forwardedRef}
      >
        <span className="TriggerText">{children}</span>
        <ChevronDownIcon className="AccordionChevron" aria-hidden />
      </Accordion.Trigger>
    </Accordion.Header>
  )
);

AccordionTrigger.displayName = "AccordianTrigger";

const AccordionContent = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
      className={classNames("AccordionContent", className)}
      {...props}
      ref={forwardedRef}
    >
      <div className="AccordionContentText">{children}</div>
    </Accordion.Content>
  )
);

AccordionContent.displayName = "AccordianContent";

const FAQSection = React.forwardRef(({ onIntersection }, forwardedRef) => {
  const [ref, inView] = useInView({
    onChange: (inView) => {
      if (inView) {
        onIntersection();
      }
    },
  });

  return (
    <Section className="FAQSection" ref={ref}>
      <Div className="FAQDiv" ref={forwardedRef}>
        <FAQContainer>
          <FAQTitle>Frequently Asked Questions</FAQTitle>
          <Accordion.Root
            className="AccordionRoot"
            type="single"
            defaultValue={null}
            collapsible
          >
            <Accordion.Item className="AccordionItem" value="item-1">
              <AccordionTrigger>When is TechWeek 2025?</AccordionTrigger>
              <AccordionContent>
                Scheduled for the 11th April to 16th April 2026, TechWeek 2025 promises a
                week filled with tech challenges and networking opportunities.
              </AccordionContent>
            </Accordion.Item>

            <Accordion.Item className="AccordionItem" value="item-2">
              <AccordionTrigger>How to Register?</AccordionTrigger>
              <AccordionContent>
                Registrations are now open on our website. To register, simply
                click on the event cards. All college students are welcome!
              </AccordionContent>
            </Accordion.Item>

            <Accordion.Item className="AccordionItem" value="item-3">
              <AccordionTrigger>What Events to Expect?</AccordionTrigger>
              <AccordionContent>
                TechWeek brings coding, electronics, development, informals and
                more. A detailed event list can be seen by clicking on event
                cards.
              </AccordionContent>
            </Accordion.Item>

            <Accordion.Item className="AccordionItem" value="item-4">
              <AccordionTrigger>
                What's in it for us? What's the prize?
              </AccordionTrigger>
              <Accordion.Content className="AccordionContent">
                <div className="AccordionContentText">
                  The prize pool for our event series totals &#8377;32,000, which
                  is distributed across five events.
                </div>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item className="AccordionItem" value="item-5">
              <AccordionTrigger>
                Online or Offline — Your Choice!
              </AccordionTrigger>
              <Accordion.Content className="AccordionContent">
                <div className="AccordionContentText">
                  TechWeek offers a mix of both, allowing participants to choose
                  events based on their preferences.
                </div>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item className="AccordionItem" value="item-6">
              <AccordionTrigger>
                Where can I get recent updates about the events?
              </AccordionTrigger>
              <Accordion.Content className="AccordionContent">
                <div className="AccordionContentText">
                  Stay up to date by joining our WhatsApp group! Get the latest announcements, updates, and important information directly.
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </FAQContainer>
      </Div>
    </Section>
  );
});

FAQSection.displayName = "FAQSection";

export default FAQSection;