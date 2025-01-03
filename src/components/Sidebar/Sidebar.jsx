import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineProduct } from "react-icons/ai"
import { CgDarkMode } from "react-icons/cg";
import { Switch } from "antd";
import styled from "styled-components";

const Sidebar = ({ isCollapsed, toggleSidebar, toggleTheme }) => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  const handleMenuClick = (path) => {
    setActivePath(path);
  };

  const onThemeChange = (checked) => {
    console.log(`Switch to ${checked}`);
    toggleTheme(); // เรียกใช้ฟังก์ชัน toggleTheme ที่ส่งมาจาก props
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
          className={`${isCollapsed ? "collapsed" : "expanded"} ${
            activePath === "/" ? "active" : ""
          }`}
          onClick={() => handleMenuClick("/")}
        >
          <MenuIcon />
          {!isCollapsed && <MenuText>Widget Management</MenuText>}
        </MenuLink>
        </MenuItem>
      </Menu>

      <SwitchWrapper className={isCollapsed ? "collapsed" : "expanded"}>
        <Switch defaultChecked onChange={onThemeChange} />
        {!isCollapsed && <SwitchLabel><CgDarkMode style={{ fontSize: '18px' }}/>Dark Mode</SwitchLabel>}
      </SwitchWrapper>
    </StyledSidebar>
  );
};

export default Sidebar;

// Styled components

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
  text-decoration: none;
  color: var(--text-color);
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &.collapsed {
    justify-content: center;
    padding: 5px 0;
  }

  &.expanded {
    justify-content: flex-start;
    padding: 10px 15px;
  }

  &.active {
    background-color: var(--button-color);
  }

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

const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 10px;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &.collapsed {
    justify-content: center;
    width: 34px;
    padding: 0;
    border-radius: 50%;
  }

  &.expanded {
    justify-content: flex-start;
    width: calc(100% - 20px);
    padding: 5px 10px;
    border-radius: 8px;
  }
`;


const SwitchLabel = styled.span`
  display: flex;
  align-items: center;
  margin-left: 10px;
  font-size: 14px;
  color: var(--text-color);
  transition: opacity 0.3s ease;

  svg {
    margin-right: 5px;
    font-size: 18px;
    color: var(--text-color);
  }

  ${(props) => (props.isCollapsed ? "opacity: 0; pointer-events: none;" : "opacity: 1;")}
`;
