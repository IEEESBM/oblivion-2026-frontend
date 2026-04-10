
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
    padding: 30px;
    border-radius: 15px;
  }
`;

const FAQTitle = styled.h3`
  font-size: 32px;
  font-style: italic;
  color: #ffffff;
  text-align: center;
  margin-bottom: 30px;
  letter-spacing: 2px;
  font-weight: 600;

  @media (max-width: 760px) {
    font-size: 24px;
    margin-bottom: 25px;
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
          <FAQTitle>FREQUENTLY ASKED QUESTIONS</FAQTitle>
          <Accordion.Root
            className="AccordionRoot"
            type="single"
            defaultValue={null}
            collapsible
          >
          <Accordion.Item className="AccordionItem" value="item-1">
            <AccordionTrigger>When is TechWeek 2025?</AccordionTrigger>
            <AccordionContent>
              Scheduled for the 29th March to 1st April 2025, TechWeek 2025 promises a
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
                The prize pool for our event series totals &#8377;28,000, which
                is distributed across five events.
              </div>
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-5">
            <AccordionTrigger>
              Online or Offline - Your Choice!
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