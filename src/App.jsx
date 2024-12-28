import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Router>
      <div className="app-container">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />

        {/* Main Layout */}
        <div className="main-layout">
          {/* Sidebar */}
          <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <p>2</p>
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
