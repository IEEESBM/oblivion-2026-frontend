import styled from "styled-components";
import { useEffect } from "react";
import loaderVideo from "../../assets/loader.mp4";

const Section = styled.section`
  background-color: rgb(0, 0, 0);
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Div = styled.div`
  width: 100%;
`;

export default function FullScreenLoader({ isLoading, setIsLoading }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide the loader after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timeout
  }, [setIsLoading]);

  return (
    isLoading && (
      <Section>
        <Div>
          <video autoPlay loop muted>
            <source src={loaderVideo} type="video/mp4" />
          </video>
        </Div>
      </Section>
    )
  );
}
