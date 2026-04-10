import styled from "styled-components";
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

const FAQContainer = styled.div`
  border: 1.5px solid rgba(180, 160, 255, 0.3);
  border-radius: 20px;
  padding: 40px;
  background: linear-gradient(
    135deg,
    rgba(102, 73, 184, 0.15) 0%,
    rgba(80, 60, 150, 0.1) 50%,
    rgba(102, 73, 184, 0.08) 100%
  );
  width: 100%;
  max-width: 700px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  box-shadow:
    0 0 30px rgba(102, 73, 184, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(102, 73, 184, 0.1);

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

  text-shadow:
    0 0 20px rgba(120, 170, 255, 0.5),
    0 0 40px rgba(80, 130, 255, 0.2);

  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(120, 170, 255, 0.7),
      transparent
    );
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
        <ChevronDownIcon className="AccordionChevron" />
      </Accordion.Trigger>
    </Accordion.Header>
  )
);

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

const FAQSection = React.forwardRef(({ onIntersection }, forwardedRef) => {
  const [ref] = useInView({
    onChange: (inView) => {
      if (inView) onIntersection();
    },
  });

  return (
    <Section ref={ref}>
      <Div ref={forwardedRef}>
        <FAQContainer>
          <FAQTitle>Frequently Asked Questions</FAQTitle>

          <Accordion.Root type="single" collapsible>
            <Accordion.Item value="item-1">
              <AccordionTrigger>
                When is TechWeek 2026?
              </AccordionTrigger>
              <AccordionContent>
                Scheduled for the 11th April to 15th April 2026, TechWeek promises
                a week filled with tech challenges and networking opportunities.
              </AccordionContent>
            </Accordion.Item>

            <Accordion.Item value="item-2">
              <AccordionTrigger>
                How to Register?
              </AccordionTrigger>
              <AccordionContent>
                Registrations are open on our website. Click on event cards to register.
              </AccordionContent>
            </Accordion.Item>

            <Accordion.Item value="item-3">
              <AccordionTrigger>
                What Events to Expect?
              </AccordionTrigger>
              <AccordionContent>
                Coding, electronics, web dev, and informal events.
              </AccordionContent>
            </Accordion.Item>

            <Accordion.Item value="item-4">
              <AccordionTrigger>
                What's the prize?
              </AccordionTrigger>
              <AccordionContent>
                Prize pool totals ₹32,000 across events.
              </AccordionContent>
            </Accordion.Item>

            <Accordion.Item value="item-5">
              <AccordionTrigger>
                Online or Offline?
              </AccordionTrigger>
              <AccordionContent>
                Both options available depending on event.
              </AccordionContent>
            </Accordion.Item>

            <Accordion.Item value="item-6">
              <AccordionTrigger>
                Where to get updates?
              </AccordionTrigger>
              <AccordionContent>
                Join our WhatsApp group for updates.
              </AccordionContent>
            </Accordion.Item>
          </Accordion.Root>

        </FAQContainer>
      </Div>
    </Section>
  );
});

export default FAQSection;