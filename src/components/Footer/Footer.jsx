import React from "react";
import styled from "styled-components";
import IEEElogo from "../../assets/IEEE_footer_logo.jpg";
import dreamscapeLogo from "../../assets/dreamscape-logo.png";
import facebook from "../../assets/footer-icons/facebook.png";
import twitter from "../../assets/footer-icons/twitter.png";
import instagram from "../../assets/footer-icons/instagram.png";
import youtube from "../../assets/footer-icons/youtube.png";
import { useNavigate } from "react-router-dom";

const FooterContainer = styled.footer`
  margin-top: 30rem;
  background-color: #00000050;
  padding: 50px;
  border-radius:15px;
  padding-top: 40px;
  @media (max-width: 760px) {
    padding: 20px;
    padding-left: 15px;
    margin-top: 0;
  }
`;

const UpperFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 1rem;
  padding-bottom: 30px;
  font-size: 3.2rem;
  @media (max-width: 760px) {
    font-size: 2rem;
  }
  @media (max-width: 480px) {
    padding-bottom: 20px;
    justify-content: center;
    font-size: 2.5rem;
  }
`;

const DSLogo = styled.img`
  height: 7rem;
  scale: 2.2;
  border-radius: 2px;
  display: flex;
  cursor: pointer;
  transition: filter 0.2s linear;
  &:hover {
    filter: saturate(150%) brightness(120%);
  }
  margin-left: 14rem;
  @media (max-width: 760px) {
    height: 4.8rem;
    margin-left: 27px;
  }
  @media (max-width: 480px) {
    display: none;
  }
`;

const Logo = styled.img`
  margin-left: 20px;
  height: 3.8rem;
  scale: 1.8;
  border-radius: 2px;
  @media (max-width: 760px) {
    margin-left: 15px;
    height: 3rem;
  }
  @media (max-width: 480px) {
    display: none;
  }
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: #fff;
  background-color: none;
  transition: color 0.2s linear;
  cursor: pointer;
  &:hover {
    color: #dfd7fe;
  }
`;

const LowerFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  @media (max-width: 480px) {
    flex-direction: column;
    padding-top: 10px;
  }
`;

const CopyrightText = styled.span`
  font-size: 2rem;
  color: #fff;
  order: 1;
  font-weight: lighter;
  @media (max-width: 760px) {
    font-size: 1.4rem;
  }
  @media (max-width: 480px) {
    order: 2;
    font-size: 1.2rem;
    letter-spacing: 2.2px;
    padding-bottom: 10px;
  }
`;

const SocialMediaIcons = styled.div`
  margin-right: 30px;
  display: flex;
  gap: 40px;
  order: 2;
  @media (max-width: 760px) {
    margin-right: 40px;
    gap: 12px;
  }
  @media (max-width: 480px) {
    gap: 50px;
    order: 1;
    margin-right: 0px;
    margin-bottom: 15px;
  }
`;

const Footer = ({ scrollToHero }) => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/meet-the-team");
  };
  return (
    <FooterContainer>
      <UpperFooter>
        <div>
          <Logo src={IEEElogo} alt="IEEE logo" />
        </div>
        <div>
          <a onClick={scrollToHero}>
            <h1 className="text-white font-mioge m-1.5 hover:text-[#16C2D1] max-[760px]:hidden" style={{ paddingLeft: '55%'}}>ODYSSEY</h1>
          </a>
        </div>
        <div>
          <StyledLink onClick={() => handleButtonClick()}>
            Meet The Team
          </StyledLink>
        </div>
      </UpperFooter>
      <LowerFooter>
        <CopyrightText>
          &copy; {currentYear} Techweek. All Rights Reserved.
        </CopyrightText>
        <SocialMediaIcons>
          <StyledLink
            href="https://www.facebook.com/ieeesbmanipal/"
            target="_blank"
          >
            <img src={facebook} alt="facebook" />
          </StyledLink>
          <StyledLink href="https://twitter.com/ieeeorg" target="_blank">
            <img src={twitter} alt="twitter" />
          </StyledLink>
          <StyledLink href="https://www.instagram.com/ieeesbm/" target="_blank">
            <img src={instagram} alt="instagram" />
          </StyledLink>
          <StyledLink
            href="https://www.youtube.com/@ieeesbm3175"
            target="_blank"
          >
            <img src={youtube} alt="youtube" />
          </StyledLink>
        </SocialMediaIcons>
      </LowerFooter>
    </FooterContainer>
  );
};

export default Footer;
