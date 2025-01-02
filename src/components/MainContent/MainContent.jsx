import React from 'react';
import styled from 'styled-components';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Dashboard = styled.div`
  display: grid;
  grid-template-columns: 4fr 4fr 4fr; /* Left, Center, Right */
  grid-template-rows: auto auto;    /* Two rows */
  gap: 5px;
  height: 100vh;
  padding: 20px;
  background-color: var(--background-color); /* Dark background */
  color: #fff; /* Text color */
`;

const GridItem = styled.button`
  background-color: var(--card-bg-color); /* Slightly lighter background for items */
  border: none;
  border-radius: 5px;
  padding: 15px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1e4d5e; /* Darker background on hover */
  }

  svg {
    font-size: 1rem; /* Icon size */
  }
`;

const MainView = styled.div`
  grid-column: 2 / 3; /* Center column */
  grid-row: 1 / 3;    /* Spans two rows */
  background-color: var(--card-bg-color); /* Same background as GridItem */
  border-radius: 5px;
  padding: 15px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;
  const MainContent = () => {
    const navigate = useNavigate();
  
    const handleNavigate = () => {
      navigate('/config'); 
    };

  return (
    <Dashboard>
      <GridItem onClick={handleNavigate}><FiPlus /></GridItem>
      <GridItem onClick={handleNavigate}><FiPlus /></GridItem>
      <GridItem onClick={handleNavigate}><FiPlus /></GridItem>
      <GridItem onClick={handleNavigate}><FiPlus /></GridItem>
      <MainView>3D Model</MainView>
      <GridItem onClick={handleNavigate}><FiPlus /></GridItem>
      <GridItem onClick={handleNavigate}><FiPlus /></GridItem>
      <GridItem onClick={handleNavigate}><FiPlus /></GridItem>
    </Dashboard>
  );
};

export default MainContent;
