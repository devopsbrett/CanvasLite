import React from "react";
import styled from "styled-components";

const Home = () => {
  return (
    <Container>
      <h1>Welcome to CanvasLite</h1>
      <p>Start designing your graphics here!</p>
    </Container>
  );
};

export default Home;

// Styled Components
const Container = styled.div`
  margin-left: 250px;
  padding: 20px;
  width: 100%;
`;
