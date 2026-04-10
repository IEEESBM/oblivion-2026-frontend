import styled from "styled-components";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";
import { useState, useEffect, createContext } from "react";

import LoginSignup from "./components/LoginSignup/LoginSignup";
import axios from "axios";
import { Toaster } from "react-hot-toast";

// Use import.meta.env for Vite or REACT_APP_ prefix for Create React App
axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
axios.defaults.withCredentials = true;

// Styled components for Login/Signup container
const DivLoginSignupContainer = styled(
  ({ isOpen, isMobileNavOpen, ...rest }) => <div {...rest} />
)`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 887;
  transform: translateX(${(props) => (props.isOpen ? "0%" : "100%")});
  transition: transform 0.2s ease-in-out;
  padding: 0 4rem;

  @media (max-width: 560px) {
    z-index: ${(props) => (props.isMobileNavOpen ? 887 : 889)};
    padding: 0;
    justify-content: center;
    top: 10.6rem;
  }
`;

const DivOverlay = styled(({ isOpen, ...rest }) => <div {...rest} />)`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 854;
  width: 100vw;
  height: 100vh;
  transform: translateX(${(props) => (props.isOpen ? "0%" : "100%")});
  transition: transform 0.4s ease-in-out;
  backdrop-filter: blur(8px);
`;

const LoginSignupContainer = function ({
  isOpen,
  children,
  onOverlayClick,
  isMobileNavOpen,
}) {
  return (
    <>
      <DivOverlay isOpen={isOpen} onClick={onOverlayClick}></DivOverlay>
      <DivLoginSignupContainer
        isOpen={isOpen}
        isMobileNavOpen={isMobileNavOpen}
      >
        {children}
      </DivLoginSignupContainer>
    </>
  );
};

// Context for user management
export const UserContext = createContext();

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);


  const isLoggedIn = user ? true : false;

  // Toggle Login/Signup modal visibility
  const toggleLoginSignup = () => {
    setShowLogin((s) => !s);
  };

  // Handle mobile navigation toggle
  const handleMobileNavOpen = function () {
    setIsMobileNavOpen((s) => !s);
  };

  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => setUser(data)).catch(() => {});
    }
  }, [user]);


  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <LoginSignupContainer
        isOpen={showLogin}
        onOverlayClick={toggleLoginSignup}
        isMobileNavOpen={isMobileNavOpen}
      >
        <LoginSignup toggleLoginSignup={toggleLoginSignup} />
      </LoginSignupContainer>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                isMobileNavOpen={isMobileNavOpen}
                onMobileNavOpen={handleMobileNavOpen}
                toggleLoginSignup={toggleLoginSignup}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/events"
            element={<Events toggleLoginSignup={toggleLoginSignup} />}
          />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
