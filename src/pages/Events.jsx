import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { Select } from "@chakra-ui/select";
import bg from "../assets/video/bg.jpg";
import { MdArrowBack } from "react-icons/md";
import logo from "../assets/ODYSSEY.png";
import { UserContext } from "../App";
import axios from "axios";
import { toast } from "react-hot-toast";
import circleSpinner from "../assets/circles.svg";
import { MdDeleteForever } from "react-icons/md";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { FaWhatsapp } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Link, useLocation, useNavigate } from "react-router-dom";

const EventContainer = styled.div`
  font-family: "Montserrat";
  background-color: #ff0000;
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 1);
  background-image: url(${bg});
  background-size: cover;
  overflow:hidden;
  font-family: "Montserrat";
  @media (max-width: 760px) {
    flex-direction: column;
    background-color: #010101;
    min-height: 100vh;
    height: fit-content;
    overflow:hidden;
  }
`;

const EventSidebar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: clamp(22rem, 18vw, 28rem);
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  max-height: 100vh;
  padding: 1rem 0;
  gap: 0.5rem;

  @media (max-width: 760px) {
    width: 100%;
    height: auto;
    max-height: 80vh;
  }
`;

const EventSidebarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  min-height: clamp(4.5rem, 7vh, 6rem);
  padding: 0.8rem;
  background: ${(props) =>
    props.selected
      ? "linear-gradient(135deg, #16A2D1, #010101)"
      : "linear-gradient(135deg, #010101, #101010)"};
  color: #fff;
  font-size: clamp(1.5rem, 1.2vw, 2.1rem);
  letter-spacing: -0.03vw;
  text-align: center;
  transition: background 0.25s ease;
  cursor: pointer;
  border-radius: 0 2rem 2rem 0;
  white-space: normal;
  opacity: 0.8;
  word-wrap: break-word;
  text-overflow: ellipsis;

  &:hover {
    background: ${(props) =>
      props.selected
        ? "linear-gradient(135deg, #1492BD, #010101)"
        : "rgba(135, 134, 144, 0.5)"};
  }

  @media (max-width: 760px) {
    font-size: 1.6rem;
    min-height: 4.5rem;
    padding: 0.6rem;
    border-radius: 2rem;
    background: linear-gradient(135deg, #101010, #010101);
  }
`;

const MobileContainer = styled.div`
  /* position: absolute; */
  /* top: 1rem; */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MobileSelect = styled(Select)`
  font-family: "Montserrat";
  /* margin: 0 auto; */
  /* width: 80%; */
  height: 4rem;
  border-radius: 0.75rem;
  color: white;
  text-align: center;
  font-size: 2rem;
  margin: 7rem auto 0 auto;
  display: block;
  padding-left: 2.2rem;
`;

const MobileBackButton = styled.button`
  position: absolute;
  /* top: 32%; */
  left: 5%;
  border: 1px solid rgb(7, 74, 71);
  border-radius: 4rem;
  background-color: rgb(122, 185, 227);
  height: 3.5rem;
  width: 3.5rem;
  top: 2rem;

  box-shadow: 0 0 0.5rem 0.5rem rgba(0, 0, 0, 0.5);
`;

const EventBackButton = styled.button`
  display: flex;
  gap: 1rem;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 10%;
  margin-top: auto;
  margin-bottom: 2rem;
  background-color: rgba(0, 0, 0, 0);
  color: #16c2d1;
  /* font-size: 5rem; */
  font-size: clamp(2.5rem, 2.4vw, 4.4rem);
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
`;

const EventContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  /* padding: 8rem 10rem 0 10rem; */
  padding: 2rem 4vw 1rem 4vw;
  background-color: rgba(0, 0, 0, 0);
  background-size: cover;
  height: 100%;
  @media (max-width: 760px) {
    width: 100%;
    /* margin: 0 0 0 0; */
    margin-top: 2rem;
    /* padding: 7rem 3rem 0 3rem; */
    padding-top: 0;
    /* justify-content: center; Add this line */
    justify-content: start;
    gap: 2rem;
    /*background: linear-gradient(
      159.14deg,
      rgba(1, 1, 1, 0.648) -6.84%,
      rgba(33, 33, 33, 0.443) 118.48%
    );*/
    padding-bottom: 20rem;
  }
`;

const EventHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 760px) {
    font-size: 0.5rem;
    justify-content: center;
    flex-direction: column;
    margin-top: 4rem;
  }
`;

const EventTitle = styled.div`
  color: white;
  font-size: clamp(3.2rem, 3.2vw, 5rem);
  font-weight: bold;
  text-transform: uppercase;
  @media (max-width: 760px) {
    text-align: center;
  }
`;

const EventRegisteredIndicator = styled.div`
  color: rgb(204, 197, 236);
  font-size: clamp(3rem, 2.5vw, 3.8rem);
  @media (max-width: 760px) {
    font-size: 3.5rem;
    margin-top: 1.4rem;
  }
`;
const EventDescriptionBox = styled.div`
  background: rgba(2, 15, 40, 0.8);
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const EventDescription = styled.p`
  color: white;
  font-size: clamp(1.8rem, 1.8vw, 3.2rem);
  overflow-wrap: break-word;
  margin-top: 3rem;
  margin-bottom: 4rem;
  line-height: clamp(3rem, 2.8vw, 4rem);

  @media (max-width: 760px) {
    font-size: 2rem;
  }
`;

const EventDetailTopContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  gap: 1.5rem;

  @media (max-width: 760px) {
    font-size: 2rem;
    margin-bottom: 3rem;
    margin-top: 6rem;
  }
`;

const EventDetailContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: center;
`;

const EventDetailKey = styled.div`
  font-size: clamp(1.8rem, 1.4vw, 2.6rem);
  color: #4ec1ff;
  white-space: nowrap;
  font-weight: bold;

  @media (max-width: 760px) {
    font-size: 2.2rem;
  }
`;

const EventDetailValue = styled.div`
  font-size: clamp(1.8rem, 1.4vw, 2.6rem);
  color: rgba(255, 255, 255, 1);

  @media (max-width: 760px) {
    margin-top: 0rem;
    font-size: 1.8rem;
  }
`;

const DivLogoSidebar = styled.div`
  height: 7%;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
`;

const ImgLogo = styled.img`
  height: 10.2rem;
  scale: 1.7;
  margin-bottom: 2.5rem;
  transition: filter 0.2s linear;
  border-radius: 2px;
  display: block;
  cursor: pointer;
  &:hover {
    filter: saturate(150%) brightness(120%);
  }
`;

const MobileImgLogo = styled.img`
  position: absolute;
  top: 0;
  height: 8.2rem;
  scale: 1.6;
  margin-bottom: 2rem;
  transition: filter 0.2s linear;
  display: block;
  @media (max-width: 760px) {
    top: -1rem;
  }
`;

const DivBottomContainer = styled.div`
  position: absolute;
  right: 4vw;
  bottom: 5vw; /* Changed from 2vw to 5vw to move buttons up */
  display: flex;
  flex-direction: column;
  gap: 1rem;
  user-select: auto;
  @media (max-width: 760px) {
    position: static;
    align-self: center;
    margin-top: -2rem; /* Added negative margin to move up on mobile */
  }
`;
const EventRegisterButton = styled.button`
  padding: 0.8rem 3rem;
  background: linear-gradient(135deg, #010101, #0f8aaf);
  color: rgba(255, 255, 255, 1);
  font-size: clamp(1.6rem, 1.4vw, 2.4rem);
  border: none;
  opacity: 0.85;
  border-radius: 1rem;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
  &:hover {
    background: linear-gradient(135deg, #010101, #0d7798);
    transform: translateY(-2px);
  }
  @media (max-width: 760px) {
    padding: 1.5rem 2.8rem;
    font-size: clamp(2.2rem, 1.5vw, 2.2rem);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  input {
    padding: 1rem 2rem;
    background-color: rgba(0, 0, 0, 1);
    color: rgba(255, 255, 255, 1);
    font-size: clamp(2rem, 1.6vw, 3rem);
    border: 1px solid rgba(255, 255, 255, 1);
    border-radius: 1rem;
  }
  button {
    padding: 1rem 2rem;
    background-color: rgba(47, 116, 116, 0.68);
    color: rgba(255, 255, 255, 1);
    font-size: clamp(2rem, 1.6vw, 3rem);
    border: 1px solid rgba(255, 255, 255, 1);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
    &:hover {
      background-color: rgba(109, 168, 171, 0.91);
    }
  }
`;

const DivTeamTitle = styled.div`
  font-size: clamp(2rem, 2vw, 3rem);
  color: rgb(89, 155, 161);
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .btn-delete-team {
    transition: color 2s ease;
    cursor: pointer;
  }
  .btn-delete-team:hover {
    color: rgb(182, 107, 107);
  }
`;

const ListTeamMembers = styled.ul`
  list-style: none;
  color: rgba(255, 255, 255, 1);
  font-size: clamp(2rem, 2vw, 3rem);
`;

const AlertDialogBox = styled(AlertDialogPrimitive.Content)`
  /* width: 60%;
  height: 35%; */
  background: rgba(141, 115, 255, 0.5);
  border-radius: 2rem;
  padding: 6rem 4rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 760px) {
    width: 80%;
    height: 40%;
    padding: 1rem;
    flex-direction: column;
  }
`;

const AlertDialogText = styled.div`
  color: #fff;
  font-size: clamp(3rem, 2.5vw, 3.8rem);
  /* text-align: center; */
  white-space: normal;
  line-height: 1.2;
  @media (max-width: 760px) {
    font-size: 2.5rem;
  }
`;

const AlertDialogOverlay = styled(AlertDialogPrimitive.Overlay)`
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
`;

const AlertCloseButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  font-size: clamp(3rem, 2.5vw, 3.8rem);
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  cursor: pointer;
  @media (max-width: 760px) {
    font-size: 2.2rem;
  }
`;

const Events = ({ toggleLoginSignup }) => {
  const location = useLocation();
  const linkState = location.state;
  const linkIndex = linkState ? linkState.eventIndex : 0;

  const EventDetails = ["Date", "Time", "Venue", "Team Size", "Prize Pool"];

  const [selectedButton, setSelectedButton] = useState(linkIndex);
  const [Events, setEvents] = useState([]);
  const [content, setContent] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateTeamForm, setShowCreateTeamForm] = useState(false);
  const [showJoinTeamForm, setShowJoinTeamForm] = useState(false);
  const [teamName, setTeamName] = useState(""); //for form input
  const [teamId, setTeamId] = useState(""); //for form input
  const [joinedTeams, setJoinedTeams] = useState(null);
  const [open, setOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    fetch("/Events.json")
      .then((response) => response.json())
      .then((Events) => {
        setEvents(Events);
        setContent(Events[linkIndex]);
        window.scrollTo(0, 0);
      });

    const handleResize = () => {
      if (window.innerWidth <= 760) {
        setMobile(true);
      } else {
        setMobile(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [linkIndex]);

  useEffect(() => {
    fetchEvents();
    window.scrollTo(0, 0);
  }, [user]);

  const fetchEvents = async function () {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/getTeams");
      setJoinedTeams(data);
    } catch (ex) {
      if (ex.response.data.error) {
        if (ex.response.data.error != "No token found")
          toast.error(ex.response.data.error);
      } else {
        toast.error("Error fetching teams details");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const handleClick = (index) => {
    setSelectedButton(index);
    setContent(Events[index]);
    setShowCreateTeamForm(false);
    setShowJoinTeamForm(false);
    setTeamName("");
    setTeamId("");
  };

  const handleCreateTeamForm = () => {
    setShowCreateTeamForm((s) => !s);
  };

  const handleJoinTeamFrom = () => {
    setShowJoinTeamForm((s) => !s);
  };

  const handleRegister = async function (content) {
    const payload = {
      eventId: content.ID,
      isIndividual: content.isIndividual,
    };
    setIsLoading(true);
    try {
      const { data } = await axios.post("/register", payload);
      setUser(data);
      toast.success("Registered Successfully");
      setOpen(true);
    } catch (ex) {
      if (ex.response.data.error) {
        if (ex.response.data.error == "No token found") {
          toast.error("Please login to continue");
          toggleLoginSignup();
        } else {
          toast.error(ex.response.data.error);
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateTeamId = (n) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < n; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const handleCreateTeam = async function (e, content) {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      eventId: content.ID,
      isIndividual: content.isIndividual,
      teamName: teamName,
      teamId: generateTeamId(6),
      maxTeamSize: Number(content["Team Size"].slice(-1)),
    };
    try {
      const { data } = await axios.post("/register", payload);
      setUser(data);
      toast.success("Team created successfully");
      setOpen(true);
    } catch (ex) {
      if (ex.response.data.error) {
        if (ex.response.data.error == "No token found") {
          toast.error("Please login to continue");
          toggleLoginSignup();
        } else {
          toast.error(ex.response.data.error);
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinTeam = async function (e, content) {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      eventId: content.ID,
      teamId: teamId,
    };
    try {
      const { data } = await axios.post("/joinTeam", payload);
      setUser(data);
      toast.success("Team joined successfully");
      setOpen(true);
    } catch (ex) {
      if (ex.response.data.error) {
        if (ex.response.data.error == "No token found") {
          toast.error("Please login to continue");
          toggleLoginSignup();
        } else {
          toast.error(ex.response.data.error);
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTeam = async function (teamId) {
    setIsLoading(true);
    try {
      const { data } = await axios.delete(`/deleteTeam/${teamId}`);
      setUser(data);
      toast.success("Team Deleted Successfully");
    } catch (ex) {
      if (ex.response.data.error) {
        if (ex.response.data.error == "No token found") {
          toast.error("Please login to continue");
          toggleLoginSignup();
        } else {
          toast.error(ex.response.data.error);
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

  return (
    <EventContainer>
      {!mobile ? (
        <EventSidebar>
          <DivLogoSidebar>
            <ImgLogo src={logo} alt="dreamscape logo" onClick={handleGoBack} />
          </DivLogoSidebar>
          {Events?.map((event, index) => (
            <EventSidebarButton
              selected={selectedButton === index}
              key={index}
              onClick={() => handleClick(index)}
            >
              {event.Name}
            </EventSidebarButton>
          ))}
          <EventBackButton onClick={handleGoBack}>
            <MdArrowBack className="icon-back-arrow" /> BACK
          </EventBackButton>
        </EventSidebar>
      ) : (
        <MobileContainer>
          <MobileSelect
            bg="rgba(1,1,1,0.4)"
            icon={<div></div>}
            // onChange={(e) => setContent(Events[e.target.value])}
            onChange={(e) => handleClick(e.target.value)}
            value={selectedButton}
          >
            {Events?.map((event, index) => (
              <option
                key={index}
                value={index}
                style={{ backgroundColor: "transparent", color: "white" }}
              >
                {event.Name}
              </option>
            ))}
          </MobileSelect>
          <MobileImgLogo
            src={logo}
            alt="dreamscape logo"
            onClick={handleGoBack}
          />
          <MobileBackButton onClick={handleGoBack}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM231 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L376 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-182.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L119 273c-9.4-9.4-9.4-24.6 0-33.9L231 127z" />
            </svg>
          </MobileBackButton>
        </MobileContainer>
      )}
      <EventContent className="overflow-y-auto">
        <EventHeader>
          <EventTitle>{content && content.Name}</EventTitle>
          <EventRegisteredIndicator>
            {user?.event?.find(
              (registeredEvent) => registeredEvent.id === content?.ID
            ) && (
              <div style={{ display: "flex" }}>
                Registered |
                <a
                  href="https://chat.whatsapp.com/BbCbwvsKCLZ2qO5iDk6eaZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "rgb(110, 157, 172)",
                    marginLeft: "1rem",
                  }}
                >
                  <FaWhatsapp />
                </a>
              </div>
            )}
          </EventRegisteredIndicator>
        </EventHeader>
        <EventDescriptionBox>
          <EventDescription>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {content && content.Desc}
            </pre>
          </EventDescription>
        </EventDescriptionBox>
        <EventDescriptionBox>
          <EventDetailTopContainer>
            {content && (
              <>
                {EventDetails?.map((detail, index) =>
                  detail !== "Prize Pool" ||
                  (detail === "Prize Pool" && content[detail]) ? (
                    <EventDetailContainer key={index}>
                      <EventDetailKey>{detail + " - "}</EventDetailKey>{" "}
                      <EventDetailValue>
                        <pre
                          style={{
                            whiteSpace: "pre-wrap",
                            fontFamily: "inherit",
                          }}
                        >
                          {detail === "Prize Pool" && "\u20B9"}
                          {content[detail]}
                        </pre>
                      </EventDetailValue>
                    </EventDetailContainer>
                  ) : (
                    <>&nbsp;</>
                  )
                )}
              </>
            )}
          </EventDetailTopContainer>
        </EventDescriptionBox>
        <DivBottomContainer>
          {!user?.event?.find((e) => e?.id === content?.ID) ? (
            <>
              {content?.isIndividual && (
                <EventRegisterButton onClick={() => handleRegister(content)}>
                  {isLoading && (
                    <img
                      src={circleSpinner}
                      width="24"
                      alt=""
                      style={{ marginRight: "8px" }}
                    />
                  )}
                  Register
                </EventRegisterButton>
              )}
              {!content?.isIndividual && (
                <>
                  {showCreateTeamForm && !showJoinTeamForm && (
                    <Form onSubmit={(e) => handleCreateTeam(e, content)}>
                      <input
                        type="text"
                        placeholder="Enter team name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        value={user ? `Leader: ${user.name}` : "Please Login"}
                        disabled={true}
                      />
                      <button type="submit">
                        {isLoading && (
                          <img
                            src={circleSpinner}
                            width="24"
                            alt=""
                            style={{ marginRight: "8px" }}
                          />
                        )}
                        Create
                      </button>
                    </Form>
                  )}
                  {showJoinTeamForm && !showCreateTeamForm && (
                    <Form onSubmit={(e) => handleJoinTeam(e, content)}>
                      <input
                        type="text"
                        placeholder="Enter team ID"
                        value={teamId}
                        onChange={(e) => setTeamId(e.target.value)}
                        required
                      />
                      <button type="submit">
                        {isLoading && (
                          <img
                            src={circleSpinner}
                            width="24"
                            alt=""
                            style={{ marginRight: "8px" }}
                          />
                        )}
                        Join
                      </button>
                    </Form>
                  )}
                  {!showCreateTeamForm && !showJoinTeamForm && (
                    <>
                      <EventRegisterButton onClick={handleCreateTeamForm}>
                        Create Team
                      </EventRegisterButton>
                      <EventRegisterButton onClick={handleJoinTeamFrom}>
                        Join Team
                      </EventRegisterButton>
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <DivTeamTitle>
                {!content?.isIndividual && "Team: "}
                {
                  joinedTeams?.find((team) => team.eventId === content?.ID)
                    ?.name
                }
                {!content?.isIndividual && " | ID: "}
                {
                  joinedTeams?.find((team) => team.eventId === content?.ID)
                    ?.teamId
                }
                {user?.event?.find((e) => e.id === content?.ID)
                  ?.teamIsLeader && (
                  <>
                    {" | "}
                    <MdDeleteForever
                      className="btn-delete-team"
                      onClick={() =>
                        handleDeleteTeam(
                          joinedTeams.find(
                            (team) => team.eventId === content?.ID
                          )?.teamId
                        )
                      }
                    />
                  </>
                )}
                {isLoading && (
                  <img
                    src={circleSpinner}
                    width="24"
                    alt=""
                    style={{ marginRight: "8px" }}
                  />
                )}
              </DivTeamTitle>
              <ListTeamMembers>
                {
                  joinedTeams?.find((team) => team.eventId === content?.ID)
                    ?.leader_name
                }
                {!isLoading && !content?.isIndividual && " (Leader)"}
                {joinedTeams
                  ?.find((team) => team.eventId === content?.ID)
                  ?.members.map((mem) => (
                    <li key={mem.id}>{mem.name}</li>
                  ))}
              </ListTeamMembers>
            </>
          )}
        </DivBottomContainer>
      </EventContent>
      <AlertDialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <AlertDialogBox>
          <AlertDialogPrimitive.Action>
            <AlertCloseButton>
              <RxCross2 onClick={() => setOpen(false)} />
            </AlertCloseButton>
          </AlertDialogPrimitive.Action>
          <AlertDialogText>
            To complete registration, please join our whatsapp group{" "}
            <a
              href="https://chat.whatsapp.com/BbCbwvsKCLZ2qO5iDk6eaZ"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "white" }}
            >
              here.
            </a>
            <br />
            <br />
            Join the group at any time by clicking the icon next to Registered.
          </AlertDialogText>
        </AlertDialogBox>
        <AlertDialogOverlay onClick={() => setOpen(false)} />
      </AlertDialogPrimitive.Root>
    </EventContainer>
  );
};

export default Events;
