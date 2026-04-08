import styled from "styled-components";
import mobileHeroBackground from "../../assets/mobile-hero-background.mp4";

const DivVideo = styled.div`
  position: absolute;
  z-index: 666;
`;

const DivHeroText = styled.div`
  position: relative;
  z-index: 777;
  color: #ccc;
  font-size: 3.8rem;
  width: 100%;
  height: 100%;
`;

const H1 = styled.h1`
  text-transform: uppercase;
  position: absolute;
  top: 20vh;
  left: 50%;
  transform: translateX(-50%);
`;
const H2 = styled.h2`
  position: absolute;
  left: 50%;
  bottom: 28vh;
  transform: translateX(-50%);
`;

export default function MobileHero() {
  return (
    <>
      <DivVideo>
        <video autoPlay className="video-loader" muted={true} loop={true}>
          <source src={mobileHeroBackground} type="video/mp4" />
        </video>
      </DivVideo>
      <DivHeroText>
        <H1>Techweek</H1>
        <H2>Dreamscape</H2>
      </DivHeroText>
    </>
  );
}
