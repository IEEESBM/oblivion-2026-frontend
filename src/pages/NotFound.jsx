import styled from "styled-components";
import bg from "../assets/website-background.svg";
import dreamscapeLogo from "../assets/dreamscape-logo.png";
import { Link } from "react-router-dom";

const Section = styled.section`
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 1);
  background-image: url(${bg});
  color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DivLogo = styled.div`
  max-width: 28rem;
  margin: 0 auto;
  img {
    width: 100%;
  }
`;

const DivText = styled.div`
  color: #f3ebeb;
  max-width: 50rem;
  margin: 0 auto;
  text-align: center;
  margin-top: 2rem;
  h1 {
    font-size: 24rem;
    @media (max-width: 760px) {
      font-size: 14rem;
    }
    letter-spacing: -1rem;
  }
  p {
    margin-top: 2rem;
    font-size: 4.8rem;
    letter-spacing: 0.2rem;
    @media (max-width: 760px) {
      font-size: 3.2rem;
    }
  }
`;

const Button = styled.button`
  margin-top: 4rem;
  background-color: #6f1df4;
  color: #fff;
  padding: 1.5rem 4rem;
  border-radius: 4rem;
  font-size: 2.4rem;
  font-weight: 600;
  transition: background-color 0.2s linear;
  &:hover {
    background-color:rgb(15, 63, 66);
  }
  @media (max-width: 760px) {
    font-size: 2rem;
    padding: 1.5rem 3rem;
  }
`;

const NotFound = function () {
  return (
    <Section>
      <DivLogo>
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={dreamscapeLogo} alt="Dreamscape Logo" />
        </Link>
      </DivLogo>
      <DivText>
        <h1>404</h1>
        <p>Page Not Found</p>
      </DivText>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Button>Home</Button>
      </Link>
    </Section>
  );
};

export default NotFound;
