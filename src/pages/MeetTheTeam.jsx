import { useEffect, useState } from "react";
import styled from "styled-components";
import bg from "../assets/video/bg.jpg";
import github from "../assets/MeetTheTeam-icons/github.png";
import linkedin from "../assets/MeetTheTeam-icons/linkedin.png";
import instagram from "../assets/MeetTheTeam-icons/instagram.png";
import BackArrow from "../assets/MeetTheTeam-icons/back.png";
import { Link, useNavigate } from "react-router-dom";

const oblivionLogo = "/favicon-oblivion.png";

const TeamContainer = styled.div`
  padding: 40px;
  text-align: center;
  width: 100%;
  min-height: 100vh;
  background-color: rgba(0, 0, 0, 1);
  background-image: url(${bg});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  @media screen and (max-width: 540px) {
    padding: 40px 10px;
  }
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EventBackButton = styled.button`
  margin-bottom: 2rem;
  font-size: 6.5rem;
  text-align: center;
  cursor: pointer;
  .icon-back-arrow {
    transition: transform 0.2s ease-in-out;
    margin-right: -1rem;
    vertical-align: bottom;
  }
  &:hover {
    .icon-back-arrow {
      transform: translateX(-1rem);
    }
  }
  @media (max-width: 760px) {
    font-size: 4rem;
  }
  @media (max-width: 420px) {
    font-size: 4rem;
  }
`;

const Heading = styled.h1`
  font-size: 4.5rem;
  font-weight: 600;
  color: white;
  /* text-shadow: 0 0 7px rgba(87, 194, 220, 0.8); */
  margin: 0 auto;
  margin-bottom: 20px;

  @media (max-width: 760px) {
    font-size: 3.6rem;
  }
  @media (max-width: 420px) {
    font-size: 3rem;
  }
`;

const TeamGrid = styled.div`
  margin: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 2rem;
  row-gap: 3rem;
  margin-top: 50px;
  max-width: 1100px;
  padding: 0 20px;

  @media screen and (max-width: 1085px) {
    grid-template-columns: repeat(3, 1fr);
    max-width: 800px;
  }

  @media screen and (max-width: 820px) {
    grid-template-columns: repeat(2, 1fr);
    max-width: 500px;
  }

  @media screen and (max-width: 540px) {
    grid-template-columns: repeat(1, 1fr);
    max-width: 280px;
  }
`;

const BorderDiv = styled.div`
  width: 240px;
  height: 300px;

  transition: transform 0.8s;

  img {
    transition: transform 0.8s;
  }
  &:hover {
    transform: scale(1.06);
    img {
      transform: scale(1.1);
    }
  }

  @media screen and (max-width: 540px) {
    &:hover {
      transform: none;
      img {
        transform: scale(1.08);
        transform: none;
      }
    }
  }
`;

const Overlay = styled.div`
  position: relative;
  background-color: #010101;
  top: 1.5%;
  opacity: 1;
  left: 1.5%;
  width: 97%;
  height: 97%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 6%;
  background-image: linear-gradient(to bottom, #212121);
`;

const Name = styled.div`
  color: #ffffff;
  font-size: 2.5rem;
  margin-top: 20px;
`;

const Designation = styled.div`
  color: #ffffff;
  font-size: 1.8rem;
  margin-top: 10px;
  opacity: 70%;
`;

const ImageContainer = styled.div`
  margin-top: 20px;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  height: 135px;
  width: 135px;
  border-radius: 50%;
  background-color: #ccc;
  object-fit: cover;
`;

const Icons = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: space-around;
  width: 70%;
`;

const Icon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: transform 0.5s;

  &:hover {
    transform: scale(1.2);
  }
`;

const DSLogo = styled.img`
  margin: auto;
  margin-top: 30px;
  height: 5.5rem;
  scale: 2;
  transition: filter 0.2s linear;
  border-radius: 2px;
  display: block;
  &:hover {
    filter: saturate(150%) brightness(120%);
  }
`;

const MeetTheTeam = ({ isLoading }) => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    // Fetch data from team.json
    fetch("/team.json")
      .then((response) => response.json())
      .then((data) => setTeamMembers(data.members))
      .catch((error) => console.error("Error fetching team data:", error));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

  return (
    !isLoading && (
      <TeamContainer>
        <TopContainer>
          <EventBackButton onClick={handleGoBack}>
            <img className="icon-back-arrow" src={BackArrow} alt=""></img>
          </EventBackButton>
          <Heading>Meet The Team</Heading>
        </TopContainer>
        <TeamGrid>
          {teamMembers.map((member, index) => (
            <BorderDiv key={index}>
              <Overlay>
                <Name>{member.name}</Name>
                <Designation>{member.designation}</Designation>
                <ImageContainer>
                  <Image src={`teamImages/${member.image}`} alt={member.name} />
                </ImageContainer>
                <Icons>
                  {member.instagram && (
                    <Icon>
                      <a
                        href={member.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={instagram} alt="Instagram" />
                      </a>
                    </Icon>
                  )}
                  {member.github && (
                    <Icon>
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={github} alt="Github" />
                      </a>
                    </Icon>
                  )}
                  {member.linkedin && (
                    <Icon>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={linkedin} alt="LinkedIn" />
                      </a>
                    </Icon>
                  )}
                </Icons>
              </Overlay>
            </BorderDiv>
          ))}
        </TeamGrid>
        <div>
          <Link to="/" style={{ textDecoration: "none" }}>
            <DSLogo src={oblivionLogo} alt="Oblivion logo" />
          </Link>
        </div>
      </TeamContainer>
    )
  );
};

export default MeetTheTeam;
