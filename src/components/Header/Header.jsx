import React from "react";
import styled from "styled-components";
import { BiEditAlt } from "react-icons/bi";
import { GoArrowSwitch } from "react-icons/go";

const Header = ({ toggleSidebar, isCollapsed, toggleTheme }) => {
  return (
    <StyledHeader isCollapsed={isCollapsed}>
      <LeftSection>
        <button onClick={toggleTheme}>Theme</button>
      </LeftSection>
      <RightSection>
        <Button><BiEditAlt className="icon-edit"/>Edit</Button>
        <Button><GoArrowSwitch className="icon-switch"/>Switch</Button>
      </RightSection>
    </StyledHeader>
  );
};

export default Header;

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: var(--background-color); 
  color: var(--header-color);
  position: fixed;
  top: 0;
  left: ${(props) => (props.isCollapsed ? "54px" : "220px")}; 
  width: calc(100% - ${(props) => (props.isCollapsed ? "54px" : "220px")}); 
  z-index: 1000;
  transition: left 0.3s ease, width 0.3s ease;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 40px;
`;

const Button = styled.button`
  background-color: var(--button-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  .icon-edit {
    margin-right: 5px;
    font-size: 15px;
  }
  .icon-switch {
    margin-right: 5px;
    font-size: 15px;
  }
`;