import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineProduct } from "react-icons/ai";
import styled from "styled-components";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  const handleMenuClick = (path) => {
    setActivePath(path);
  };

  return (
    <StyledSidebar isCollapsed={isCollapsed}>
      <Hamburger onClick={toggleSidebar} isCollapsed={isCollapsed}>
        ☰
      </Hamburger>

      <Menu>
        <MenuItem>
          <MenuLink
            to="/"
            isActive={activePath === "/"}
            isCollapsed={isCollapsed}
            onClick={() => handleMenuClick("/")}
          >
            <MenuIcon />
            {!isCollapsed && <MenuText>Widget Management</MenuText>}
          </MenuLink>
        </MenuItem>
      </Menu>
    </StyledSidebar>
  );
};

export default Sidebar;

const StyledSidebar = styled.div`
  background-color: var(--background-color);
  color: var(--text-color);
  height: 100vh;
  overflow: hidden;
  transition: width 0.3s ease, padding 0.3s ease;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  width: ${(props) => (props.isCollapsed ? "34px" : "200px")};
  box-shadow: var(--box-shadow);
  z-index: 1100;
`;

const Hamburger = styled.button`
  position: absolute;
  top: 10px;
  left: ${(props) => (props.isCollapsed ? "11px" : "calc(100% - 30px)")};
  z-index: 1100;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 20px;
  cursor: pointer;
  transition: left 0.3s ease;
`;

const Menu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  margin-top: 60px;
`;

const MenuItem = styled.li`
  margin: 10px 0;
  width: 100%;
`;

const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isCollapsed ? "center" : "flex-start")};
  text-decoration: none;
  color: var(--text-color);
  padding: ${(props) => (props.isCollapsed ? "5px 0" : "10px 15px")};
  border-radius: 4px;
  transition: background-color 0.3s ease;
  background-color: ${(props) => (props.isActive ? "var(--button-color)" : "transparent")};

  &:hover {
    background-color: var(--button-color);
  }
`;

const MenuText = styled.span`
  margin-left: 10px;
  font-size: 14px;
`;

const MenuIcon = styled(AiOutlineProduct)`
  font-size: 20px;
  color: var(--text-color);
`;
