import styled from "styled-components";
import { useState, useEffect } from "react";

import { galleryImages } from "./GalleryImageData";

const Div = styled.div`
   width: 100%;
   height: 100vh;

   display: flex;
   justify-content: center;
   align-items: center;

   overflow: hidden;
   position: relative;
`;

const GalleryImage = styled(({ isActive, isNext, isPrev, isNextofNext, isPrevofPrev, ...rest }) => <img {...rest} />)`
   --next-prev-translate: clamp(5.5rem, 15vw, 17.5rem);
   --nextOfNext-prevOfPrev-translate: clamp(9rem, 25vw, 30rem);

   position: absolute;

   width: ${(props) =>
      props.isActive
         ? "50vw"
         : props.isNext || props.isPrev
         ? "45vw"
         : props.isNextofNext || props.isPrevofPrev
         ? "40vw"
         : "0vw"};
   max-width: 55rem;
   height: ${(props) =>
      props.isActive
         ? "40vh"
         : props.isNext || props.isPrev
         ? "35vh"
         : props.isNextofNext || props.isPrevofPrev
         ? "30vh"
         : "0vh"};
   object-fit: cover;
   border-radius: 1rem;

   z-index: ${(props) =>
      props.isActive ? 3 : props.isNext || props.isPrev ? 2 : 1};
   opacity: ${(props) =>
      props.isActive ||
      props.isPrev ||
      props.isNext ||
      props.isNextofNext ||
      props.isPrevofPrev
         ? 1
         : 0};

   filter: ${(props) =>
      props.isActive
         ? "brightness(1)"
         : props.isNext || props.isPrev
         ? "brightness(0.25)"
         : "brightness(0.1)"};

   transform: ${(props) => (props.isActive ? "scale(1.2)" : "scale(1)")}
      ${(props) =>
         props.isNext
            ? "translateX(var(--next-prev-translate)) scale(0.9)"
            : ""}
      ${(props) =>
         props.isPrev
            ? "translateX(calc(-1 * var(--next-prev-translate))) scale(0.9)"
            : ""}
      ${(props) =>
         props.isNextofNext
            ? "translateX(var(--nextOfNext-prevOfPrev-translate)) scale(0.7)"
            : ""}
      ${(props) =>
         props.isPrevofPrev
            ? "translateX(calc(-1 * var(--nextOfNext-prevOfPrev-translate))) scale(0.7)"
            : ""};

   transition: opacity 1s ease-in-out, transform 1s ease-in-out,
      z-index 1s ease-in-out, filter 1s ease-in-out, width 1s ease-in-out,
      height 1s ease-in-out;

   @media (max-width: 760px) {
      height: 35vh;
      min-height: 30rem;
   }
`;

const calcIndices = (currIndex, arrayLength) => {
   const prevIndex = (currIndex - 1 + arrayLength) % arrayLength;
   const nextIndex = (currIndex + 1) % arrayLength;
   const prevOfPrevIndex = (currIndex - 2 + arrayLength) % arrayLength;
   const nextOfNextIndex = (currIndex + 2) % arrayLength;

   return { prevIndex, nextIndex, prevOfPrevIndex, nextOfNextIndex };
};

const interval = 4000;

export default function GallerySlider() {
   const [currImage, setCurrImage] = useState(0);

   const { prevIndex, nextIndex, prevOfPrevIndex, nextOfNextIndex } =
      calcIndices(currImage, galleryImages.length);

   useEffect(() => {
      const timer = setInterval(() => {
         setCurrImage((prevIndex) => (prevIndex + 1) % galleryImages.length);
      }, interval);
      return () => clearInterval(timer);
   }, []);

   return (
      <Div>
         {galleryImages.map((imageItem, index) => {
            return (
               <GalleryImage
                  loading="lazy"
                  key={index}
                  src={imageItem.url}
                  alt={imageItem.altText}
                  isActive={index === currImage}
                  isPrev={index === prevIndex}
                  isNext={index === nextIndex}
                  isPrevofPrev={index === prevOfPrevIndex}
                  isNextofNext={index === nextOfNextIndex}
               />
            );
         })}
      </Div>
   );
}
