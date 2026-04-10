import styled, { css } from "styled-components";
import Hamburger from "hamburger-react";
import logo from "/ODYSSEY.png";
import { useContext, useLayoutEffect, useState } from "react";
import { UserContext } from "../../App";
import axios from "axios";
import { toast } from "react-hot-toast";
import circleSpinner from "../../assets/circles.svg";

const Header = styled.header`
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(46, 49, 92, 0.59);
  border-radius: 3.5rem;
  transition: width 0.2s linear;
  font-family: "Mioge", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 888;
  padding-bottom: 10px;

  @media (max-width: 1040px) {
    left: 0;
    width: 93%;
    transform: none;
    justify-content: space-between;
    padding: 10px;
    margin: 15px;
  }
`;

const Ul = styled(({ mobileNavOpen, ...rest }) => <ul {...rest} />)`
  max-width: 100%;
  height: 100%;
  display: flex;
  gap: 3rem;
  list-style: none;
  align-items: center;
  justify-content: space-between;
  transition: margin 0.2s linear;

  @media (max-width: 1040px) {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;

    li:not(:first-child) {
      visibility: hidden;
      opacity: 0;
      font-size: 2.6rem;
    }
    /* collapses all items except the first (logo-li) */
    margin-bottom: -26.8rem;

    ${(props) =>
      props.mobileNavOpen &&
      css`
        li {
          visibility: visible !important;
          opacity: 1 !important;
        }
        margin-bottom: 1rem;
      `}
  }
`;

const Li = styled(({ isActive, ...rest }) => <li {...rest} />)`
  display: flex;
  align-items: center;
  font-family: "Mioge", sans-serif;
  transition: all 0.2s linear;
  text-transform: uppercase;
  padding-top: 15px;
  text-shadow: 0 0 2px #ffffff, 0 0 3px #d4d4ff, 0 0 4px #a3a3ff,
    0 0 6px #7b7bfd;

  font-size: 25px;
  margin-right: 2.5rem;
  font-weight: 400;
  color: hsla(0, 0%, 100%, 0.5);
  cursor: pointer;

  &:hover {
    color: #a878e6;
    text-shadow: 0 0 5px #331ea8, 0 0 10px #5c1294, 0 0 15px #1d0761,
      0 0 20px #1a1a83;
  }

  color: ${(props) => (props.isActive ? "#fff" : "")};

  /* ── Mobile overrides ── */
  @media (max-width: 1040px) {
    padding-top: 0;
    margin-right: 0;

    /* Non-logo items: indent slightly from left */
    margin-left: 3rem;

    /* Logo-li: span full width so OBLIVION + hamburger can sit at opposite ends */
    &.logo-li {
      width: 100%;
      margin-left: 0;
      justify-content: space-between;
      padding: 0 0.5rem 0 1rem;
    }
  }
`;

const ImgLogo = styled.img`
  height: 5.2rem;
  scale: 10;
  transition: filter 0.2s linear;
  border-radius: 2px;
  display: block;
  &:hover {
    filter: saturate(150%) brightness(120%);
  }
  @media (max-width: 1040px) {
    pointer-events: none;
  }
`;

const DivHamburger = styled.div`
  transition: all 0.2s linear;
  visibility: hidden;
  display: none;
  opacity: 0;

  @media (max-width: 1040px) {
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: visible;
    opacity: 1;
    /* FIX: removed the 18% left margin that was pushing it off-screen */
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 0;
    color: #fff;
    flex-shrink: 0;
  }
`;

export default function NavBar({
  scrollToEvent,
  scrollToFAQ,
  scrollToGallery,
  scrollToHero,
  visibleSection,
  toggleLoginSignup,
  isMobileNavOpen,
  onMobileNavOpen,
  isLoggedIn,
}) {
  const { setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async function () {
    setIsLoading(true);
    try {
      await axios.post("/auth/logout");
      setUser(null);
    } catch (ex) {
      if (ex.response.data.error) {
        toast.error(ex.response.data.error);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [isLargeScreen, setIsLargeScreen] = useState(false);
  useLayoutEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1040);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Header isMobileNavOpen={isMobileNavOpen}>
      <Ul mobileNavOpen={isMobileNavOpen}>
        {/* ── Logo / mobile top bar ── */}
        <Li className="logo-li">
          <a onClick={scrollToHero}>
            <h1 className="hover:text-[#16C2D1] lg:hidden max-[1040px]:text-[40px]">
              OBLIVION
            </h1>
          </a>
          <DivHamburger>
            <Hamburger
              size={22}
              toggled={isMobileNavOpen}
              toggle={onMobileNavOpen}
            />
          </DivHamburger>
        </Li>

        <Li onClick={scrollToEvent} isActive={visibleSection === "EventSection"}>
          Events
        </Li>
        <Li onClick={scrollToFAQ} isActive={visibleSection === "FAQSection"}>
          FAQ
        </Li>

        {isLargeScreen && (
          <Li onClick={scrollToHero}>
            <h1 className="hover:text-[#16C2D1]">OBLIVION</h1>
          </Li>
        )}

        <Li onClick={scrollToGallery} isActive={visibleSection === "GallerySection"}>
          Gallery
        </Li>

        <Li>
          {!isLoggedIn && (
            <div
              onClick={() => {
                toggleLoginSignup();
                onMobileNavOpen();
              }}
            >
              Login
            </div>
          )}
          {isLoggedIn && <div onClick={handleLogout}>Logout</div>}
          {isLoading && (
            <img
              src={circleSpinner}
              width="24"
              alt=""
              style={{ marginRight: "8px" }}
            />
          )}
        </Li>
      </Ul>
    </Header>
  );
}