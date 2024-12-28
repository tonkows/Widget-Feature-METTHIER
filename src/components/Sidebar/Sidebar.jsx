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
    <StyledSidebar className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>
      
      <ul className="menu">
        <li className="menu-item">
          <Link
            to="/"
            className={activePath === "/" ? "active" : ""}
            onClick={() => handleMenuClick("/")}
          >
            <AiOutlineProduct className="menu-icon" />
            {!isCollapsed && <span className="menu-text">Widget Management</span>}
          </Link>
        </li>
      </ul>
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
  width: 200px;
  box-shadow: var(--box-shadow);

  &.collapsed {
    width: 34px;
  }

  .hamburger {
    position: absolute;
    top: 10px;
    left: calc(100% - 30px); 
    z-index: 1000;
    background: none;
    border: none;
    color: var(--text-color); /* ใช้ตัวแปรธีม */
    font-size: 20px;
    cursor: pointer;
    transition: left 0.3s ease; 
  }

  &.collapsed .hamburger {
    left: 9px; 
  }

  .menu {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    margin-top: 60px;
  }

  .menu-item {
    margin: 10px 0;
    width: 100%;
  }

  .menu-item a {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-decoration: none;
    color: var(--text-color); /* ใช้ตัวแปรธีม */
    padding: 10px 15px;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }

  .menu-item a:hover,
  .menu-item a.active {
    background-color: var(--button-color); /* ใช้ตัวแปรธีม */
  }

  &.collapsed .menu-item a {
    justify-content: center;
    padding: 5px 0;
  }

  &.collapsed .menu-text {
    display: none;
  }

  .menu-text {
    margin-left: 10px;
    font-size: 14px;
  }

  .menu-icon {
    font-size: 20px;
  }
`;

