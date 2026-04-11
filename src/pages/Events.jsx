import { useEffect, useState, useContext } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Select } from "@chakra-ui/select";
import bg from "../assets/blackhole-bg.png";
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

const GlobalFonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
`;


// ─── FIX: position:relative so absolute children (MobileBackButton) are
//          contained inside this element instead of floating to the viewport top.
const EventContainer = styled.div`
  position: relative;
  font-family: "Rajdhani", sans-serif;
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 1);
  background-image: url(${bg});
  background-size: cover;
  overflow: hidden;
  @media (max-width: 760px) {
    flex-direction: column;
    background-color: #010101;
    min-height: 100vh;
    height: auto;
    overflow: visible;
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
  font-family: "Rajdhani", sans-serif;
  font-size: clamp(1.5rem, 1.15vw, 2rem);
  font-weight: ${(props) => (props.selected ? "600" : "500")};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-align: center;
  transition: background 0.25s ease, text-shadow 0.25s ease;
  cursor: pointer;
  border-radius: 0 2rem 2rem 0;
  white-space: normal;
  opacity: 0.85;
  word-wrap: break-word;
  text-shadow: ${(props) =>
    props.selected
      ? "0 0 10px rgba(80, 200, 255, 0.7), 0 0 20px rgba(80, 200, 255, 0.3)"
      : "none"};

  &:hover {
    background: ${(props) =>
    props.selected
      ? "linear-gradient(135deg, #1492BD, #010101)"
      : "rgba(135, 134, 144, 0.5)"};
    text-shadow: 0 0 8px rgba(80, 200, 255, 0.5);
  }

  @media (max-width: 760px) {
    font-size: 1.65rem;
    min-height: 4.5rem;
    padding: 0.6rem;
    border-radius: 2rem;
    background: linear-gradient(135deg, #101010, #010101);
  }
`;

const MobileContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const MobileSelect = styled(Select)`
  font-family: "Rajdhani", sans-serif;
  height: 4rem;
  border-radius: 0.75rem;
  color: white;
  text-align: center;
  font-size: 2rem;
  /* FIX: reduced from 7rem — the floating logo that needed this space is now hidden */
  margin: 2.5rem auto 0 auto;
  display: block;
  padding-left: 2.2rem;
`;

const MobileBackButton = styled.button`
  position: absolute;
  left: 5%;
  border: 1px solid rgb(7, 74, 71);
  border-radius: 4rem;
  background-color: rgb(122, 185, 227);
  height: 3.5rem;
  width: 3.5rem;
  /* FIX: now positioned relative to EventContainer (position:relative),
     so top:2rem means 2rem from the actual top of the page — correct. */
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
  font-family: "Orbitron", sans-serif;
  font-size: clamp(1.6rem, 1.5vw, 2.4rem);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-shadow: 0 0 10px rgba(22, 194, 209, 0.6), 0 0 22px rgba(22, 194, 209, 0.25);
  text-align: center;
  cursor: pointer;
  transition: text-shadow 0.2s ease;
  .icon-back-arrow {
    transition: transform 0.2s ease-in-out;
    margin-right: -1rem;
    vertical-align: bottom;
  }
  &:hover {
    text-shadow: 0 0 14px rgba(22, 194, 209, 0.9), 0 0 30px rgba(22, 194, 209, 0.4);
    .icon-back-arrow {
      transform: translateX(-1rem);
    }
  }
`;

const EventContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 2.4rem;
  padding: 3.4rem 4.4vw 2.6rem 4.4vw;
  background-color: rgba(0, 0, 0, 0);
  background-size: cover;
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  flex: 1;
  @media (max-width: 760px) {
    width: 100%;
    height: auto;
    overflow-y: visible;
    margin-top: 2rem;
    padding-top: 0;
    justify-content: start;
    gap: 1.6rem;
    padding-bottom: 7rem;
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
  font-family: "Orbitron", sans-serif;
  font-size: clamp(2.2rem, 2.6vw, 3.8rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: linear-gradient(135deg, #ffffff 0%, #a8d4ff 50%, #7eb8f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 12px rgba(100, 180, 255, 0.55)) drop-shadow(0 2px 8px rgba(0,0,0,0.6));
  @media (max-width: 760px) {
    text-align: center;
    font-size: clamp(2rem, 5vw, 3rem);
    letter-spacing: 0.05em;
  }
`;

const EventRegisteredIndicator = styled.div`
  font-family: "Rajdhani", sans-serif;
  font-weight: 600;
  font-size: clamp(1.6rem, 1.5vw, 2.2rem);
  letter-spacing: 0.06em;
  color: rgb(204, 197, 236);
  text-shadow: 0 0 8px rgba(180, 160, 255, 0.45);
  @media (max-width: 760px) {
    font-size: 1.8rem;
    margin-top: 1.4rem;
  }
`;

const EventContentRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3rem;
  align-items: stretch;
  width: 100%;
  min-height: 0;
  flex: 1;

  @media (max-width: 760px) {
    flex-direction: column;
    gap: 1.6rem;
    flex: none;
  }
`;

const EventDescriptionBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  background: linear-gradient(
    180deg,
    rgba(15, 11, 44, 0.9) 0%,
    rgba(11, 10, 35, 0.84) 100%
  );
  color: white;
  padding: clamp(3.2rem, 3.4vw, 5rem);
  border-radius: 2.2rem;
  border: 1px solid rgba(124, 150, 255, 0.16);
  box-shadow:
    0 1.8rem 5rem rgba(6, 7, 26, 0.34),
    inset 0 1px 0 rgba(196, 208, 255, 0.05);
  backdrop-filter: blur(12px);
  margin: 0;
  overflow-y: auto;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 3.2rem;
    right: 3.2rem;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(116, 152, 255, 0.55) 22%,
      rgba(209, 222, 255, 0.72) 50%,
      rgba(116, 152, 255, 0.55) 78%,
      transparent 100%
    );
  }

  &::after {
    content: "";
    position: absolute;
    inset: 1.2rem;
    border: 1px solid rgba(117, 129, 193, 0.08);
    border-radius: 1.5rem;
    pointer-events: none;
  }

  @media (max-width: 760px) {
    width: 100%;
    flex: none;
    border-radius: 1.7rem;
    padding: 2rem 1.8rem;
    overflow-y: visible;

    &::before {
      left: 2rem;
      right: 2rem;
    }

    &::after {
      inset: 0.8rem;
      border-radius: 1.2rem;
    }
  }
`;

const EventDescription = styled.p`
  font-family: "Inter", sans-serif;
  font-size: clamp(1.4rem, 1.15vw, 1.75rem);
  overflow-wrap: break-word;
  margin: 0;
  line-height: 1.85;
  letter-spacing: 0.012em;
  color: rgba(220, 232, 255, 0.92);
  font-weight: 300;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);

  pre {
    margin: 0;
    white-space: pre-wrap;
    font-family: inherit;
    line-height: inherit;
    color: inherit;
  }

  @media (max-width: 760px) {
    font-size: 1.42rem;
    line-height: 1.78;
  }
`;

const EventDetailTopContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  gap: 1.2rem;

  @media (max-width: 760px) {
    font-size: 2rem;
    margin-bottom: 0;
    margin-top: 0;
  }
`;

const EventDetailContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.6rem;
  align-items: flex-start;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(113, 125, 189, 0.12);

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  @media (max-width: 760px) {
    gap: 1rem;
    padding: 0.7rem 0;
  }
`;

const EventDetailKey = styled.div`
  font-family: "Orbitron", sans-serif;
  font-size: clamp(1.05rem, 0.82vw, 1.35rem);
  color: #94aefc;
  white-space: nowrap;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  min-width: 12rem;
  text-shadow: 0 0 8px rgba(100, 140, 255, 0.5), 0 0 16px rgba(100, 140, 255, 0.2);

  @media (max-width: 760px) {
    font-size: 1.05rem;
    min-width: 9rem;
  }
`;

const EventDetailValue = styled.div`
  font-family: "Rajdhani", sans-serif;
  font-size: clamp(1.45rem, 1.12vw, 1.85rem);
  font-weight: 500;
  color: rgba(230, 240, 255, 0.95);
  line-height: 1.6;
  letter-spacing: 0.02em;

  pre {
    margin: 0;
    white-space: pre-wrap;
    font-family: inherit;
    line-height: inherit;
  }

  @media (max-width: 760px) {
    margin-top: 0rem;
    font-size: 1.45rem;
  }
`;

const DivLogoSidebar = styled.div`
  height: 7%;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
`;

const ImgLogo = styled.img`
  height: 4rem;
  scale: 1.7;
  margin-top: 6rem;
  margin-bottom: 2.5rem;
  transition: filter 0.2s linear;
  border-radius: 2px;
  display: block;
  cursor: pointer;
  &:hover {
    filter: saturate(150%) brightness(120%);
  }
`;

// FIX: On mobile this was `position: absolute; top: -1rem` with no positioned
// parent, so it escaped to the viewport top and appeared as a white Oblivion
// bar covering the page. Hide it on mobile — the back button handles navigation.
const MobileImgLogo = styled.img`
  position: absolute;
  top: 0;
  height: 8.2rem;
  scale: 1.6;
  margin-bottom: 2rem;
  transition: filter 0.2s linear;
  display: block;
  @media (max-width: 760px) {
    display: none;
  }
`;

const DivBottomContainer = styled.div`
  position: sticky;
  align-self: flex-end;
  right: 0;
  bottom: 2.4rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: clamp(17rem, 15vw, 22rem);
  gap: 0.8rem;
  user-select: auto;
  @media (max-width: 760px) {
    position: static;
    align-self: center;
    width: 100%;
    min-width: 0;
    margin-top: 0;
  }
`;

const EventRegisterButton = styled.button`
  width: auto;
  min-width: 16rem;
  min-height: 4.45rem;
  padding: 0.95rem 1.8rem;
  background: linear-gradient(
    135deg,
    rgba(16, 15, 46, 0.95) 0%,
    rgba(27, 62, 130, 0.9) 100%
  );
  color: rgba(255, 255, 255, 1);
  font-family: "Orbitron", sans-serif;
  font-size: clamp(1.1rem, 0.85vw, 1.4rem);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-shadow: 0 0 8px rgba(150, 180, 255, 0.4);
  border: 1px solid rgba(133, 160, 255, 0.22);
  opacity: 1;
  border-radius: 999px;
  text-align: center;
  cursor: pointer;
  box-shadow:
    0 1rem 2.2rem rgba(10, 12, 38, 0.24),
    inset 0 1px 0 rgba(222, 232, 255, 0.08);
  transition:
    background 0.24s ease,
    transform 0.18s ease,
    box-shadow 0.24s ease,
    border-color 0.24s ease;
  &:hover {
    background: linear-gradient(
      135deg,
      rgba(20, 19, 56, 0.98) 0%,
      rgba(39, 86, 174, 0.96) 100%
    );
    border-color: rgba(171, 191, 255, 0.42);
    box-shadow:
      0 1.2rem 2.4rem rgba(15, 20, 54, 0.34),
      0 0 1.4rem rgba(88, 123, 255, 0.12);
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
  @media (max-width: 760px) {
    width: 100%;
    min-width: 0;
    min-height: 4.2rem;
    padding: 0.9rem 1.4rem;
    font-size: 1.35rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
  max-width: 28rem;
  padding: 1.15rem;
  border-radius: 1.5rem;
  background: linear-gradient(
    180deg,
    rgba(15, 11, 42, 0.88) 0%,
    rgba(12, 14, 38, 0.78) 100%
  );
  border: 1px solid rgba(129, 148, 239, 0.14);
  box-shadow: 0 1.2rem 3rem rgba(6, 8, 26, 0.22);
  input {
    padding: 0.95rem 1.2rem;
    background-color: rgba(10, 11, 29, 0.9);
    color: rgba(255, 255, 255, 1);
    font-size: clamp(1.3rem, 0.96vw, 1.55rem);
    border: 1px solid rgba(135, 151, 230, 0.16);
    border-radius: 0.95rem;
  }
  button {
    min-height: 4.2rem;
    padding: 0.9rem 1.4rem;
    background: linear-gradient(
      135deg,
      rgba(18, 26, 70, 0.95) 0%,
      rgba(44, 90, 172, 0.95) 100%
    );
    color: rgba(255, 255, 255, 1);
    font-size: clamp(1.3rem, 0.96vw, 1.55rem);
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border: 1px solid rgba(172, 189, 255, 0.2);
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    &:hover {
      box-shadow: 0 1rem 2rem rgba(16, 22, 58, 0.26);
      transform: translateY(-1px);
    }
  }
`;

const DivTeamTitle = styled.div`
  font-family: "Rajdhani", sans-serif;
  font-size: clamp(1.8rem, 1.8vw, 2.6rem);
  font-weight: 600;
  letter-spacing: 0.04em;
  color: rgb(89, 155, 161);
  text-shadow: 0 0 10px rgba(89, 155, 161, 0.5);
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
  font-family: "Inter", sans-serif;
  font-weight: 300;
  color: rgba(220, 232, 255, 0.9);
  font-size: clamp(1.5rem, 1.5vw, 2.2rem);
  letter-spacing: 0.01em;
  line-height: 1.7;
`;

const AlertDialogBox = styled(AlertDialogPrimitive.Content)`
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
  font-family: "Rajdhani", sans-serif;
  font-weight: 500;
  color: #fff;
  font-size: clamp(2.2rem, 2vw, 3rem);
  white-space: normal;
  line-height: 1.4;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 6px rgba(0,0,0,0.4);
  @media (max-width: 760px) {
    font-size: 2rem;
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
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState("");
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
      setMobile(window.innerWidth <= 760);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const handleClick = (index) => {
    setSelectedButton(index);
    setContent(Events[index]);
    setShowCreateTeamForm(false);
    setShowJoinTeamForm(false);
    setTeamName("");
    setTeamId("");
  };

  const handleCreateTeamForm = () => setShowCreateTeamForm((s) => !s);
  const handleJoinTeamFrom = () => setShowJoinTeamForm((s) => !s);

  const handleRegister = async function (content) {
    const payload = { eventId: content.ID, isIndividual: content.isIndividual };
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
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < n; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
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
    const payload = { eventId: content.ID, teamId: teamId };
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
    <>
      <GlobalFonts />
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
          {/* MobileImgLogo intentionally not rendered on mobile — it was
              position:absolute without a positioned parent and floated to the
              viewport top, creating the white Oblivion bar. Hidden via CSS. */}
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
      <EventContent>
        <EventHeader>
          <EventTitle>{content && content.Name}</EventTitle>
          <EventRegisteredIndicator>
            {user?.event?.find(
              (registeredEvent) => registeredEvent.id === content?.ID
            ) && (
                <div style={{ display: "flex" }}>
                  Registered |
                  <a
                    href="https://chat.whatsapp.com/LWgiPYFRHCgEpomIXW2EEO"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "rgb(110, 157, 172)", marginLeft: "1rem" }}
                  >
                    <FaWhatsapp />
                  </a>
                </div>
              )}
          </EventRegisteredIndicator>
        </EventHeader>
        <EventContentRow>
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
                          <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
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
        </EventContentRow>
        <DivBottomContainer>
          {!user?.event?.find((e) => e?.id === content?.ID) ? (
            <>
              {content?.isIndividual && (
                <EventRegisterButton onClick={() => handleRegister(content)}>
                  {isLoading && (
                    <img src={circleSpinner} width="24" alt="" style={{ marginRight: "8px" }} />
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
                          <img src={circleSpinner} width="24" alt="" style={{ marginRight: "8px" }} />
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
                          <img src={circleSpinner} width="24" alt="" style={{ marginRight: "8px" }} />
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
                {joinedTeams?.find((team) => team.eventId === content?.ID)?.name}
                {!content?.isIndividual && " | ID: "}
                {joinedTeams?.find((team) => team.eventId === content?.ID)?.teamId}
                {user?.event?.find((e) => e.id === content?.ID)?.teamIsLeader && (
                  <>
                    {" | "}
                    <MdDeleteForever
                      className="btn-delete-team"
                      onClick={() =>
                        handleDeleteTeam(
                          joinedTeams.find((team) => team.eventId === content?.ID)?.teamId
                        )
                      }
                    />
                  </>
                )}
                {isLoading && (
                  <img src={circleSpinner} width="24" alt="" style={{ marginRight: "8px" }} />
                )}
              </DivTeamTitle>
              <ListTeamMembers>
                {joinedTeams?.find((team) => team.eventId === content?.ID)?.leader_name}
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
              href="https://chat.whatsapp.com/LWgiPYFRHCgEpomIXW2EEO"
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
    </>
  );
};

export default Events;