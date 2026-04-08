import styled from "styled-components";

import GallerySlider from "./GallerySlider";
import React from "react";
import { useInView } from "react-intersection-observer";

const Section = styled.section`
  @media (max-width: 760px) {
    padding: 20rem 0;
  }
`;

const Div = styled.div`
  height: 100vh;
  width: 100vw;
  /* background-color: #000; */

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const H3 = styled.p`
  font-size: clamp(6rem, 6vw, 10rem);
  font-family: "Poppins";

  color: #fff;

  display: none;
  @media (max-width: 760px) {
    display: block;
    margin-bottom: -12rem;
  }
`;

const GallerySection = React.forwardRef(({ onIntersection }, forwardedRef) => {
  const [ref, inView] = useInView({
    // threshold: 0.5,
    onChange: (inView) => {
      if (inView) {
        onIntersection();
      }
    },
  });
  return (
    <Section>
      <div ref={ref}>
        <Div ref={forwardedRef}>
          <H3>Gallery</H3>
          <GallerySlider />
        </Div>
      </div>
    </Section>
  );
});

GallerySection.displayName = "GallerySection";

export default GallerySection;
