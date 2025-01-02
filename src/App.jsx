import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./Theme.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import MainContent from "./components/MainContent/MainContent";
import ConfigForm from "./components/ConfigForm/ConfigForm";

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
        <Header
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
          toggleTheme={toggleTheme}
        />

        {/* Main Layout */}
        <div className="main-layout">
          {/* Sidebar */}
          <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
          
          {/* Routes */}
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/config" element={<ConfigForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
