import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import './Theme.css';
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState("light"); // กำหนดธีมเริ่มต้นเป็น light

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("theme", newTheme); // เปลี่ยน attribute theme ใน <html>
  };

  return (
    <Router>
      <div className="app-container">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} toggleTheme={toggleTheme} />

        {/* Main Layout */}
        <div className="main-layout">
          {/* Sidebar */}
          <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
       
          {/* Main Content */}
          <div className={`main-content ${isCollapsed ? "collapsed" : ""}`}>
            <div className="grid-container">
              {[...Array(9)].map((_, index) => {
                const isHidden = index === 1 || index === 4;
                return (
                  <div
                    key={index}
                    className={`grid-block ${isHidden ? "hidden" : ""}`}
                  >
                    {index + 1}
                  </div>
                );
              })}
              <div className="central-image">
                <img src="" alt="" className="central-image-img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
