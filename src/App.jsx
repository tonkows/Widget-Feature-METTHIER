import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useSearchParams } from "react-router-dom";
import "./App.css";
import "./Theme.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import MainContent from "./components/MainContent/MainContent";
import ConfigForm from "./components/ConfigForm/ConfigForm";
import Preview from './components/Preview/Preview';

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");
  const [isEditing, setIsEditing] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("theme", newTheme);
  };

  return (
    <Router>
    <MainLayout
      isCollapsed={isCollapsed}
      toggleSidebar={toggleSidebar}
      toggleTheme={toggleTheme}
      isEditing={isEditing}
      onEditToggle={() => setIsEditing((prev) => !prev)}
      isSwitching={isSwitching}
      onSwitchToggle={() => setIsSwitching((prev) => !prev)} 
    />
  </Router>
  );
};

const MainLayout = ({ isCollapsed, toggleSidebar, toggleTheme, isEditing, onEditToggle ,isSwitching ,onSwitchToggle }) => {
  const location = useLocation();
  const searchParams = useSearchParams()[0];

  return (
    <div className="app-container">
      {/* แสดง Header เฉพาะในหน้าแรก */}
      {location.pathname === "/" && (
        <Header
        toggleSidebar={toggleSidebar}
        isCollapsed={isCollapsed}
        isEditing={isEditing}
        onEditToggle={onEditToggle}
        isSwitching={isSwitching}
        onSwitchToggle={onSwitchToggle} 
      />
      
      )}

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          toggleTheme={toggleTheme}
        />

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <MainContent
                isCollapsed={isCollapsed}
                isEditing={isEditing}
                isSwitching={isSwitching}
              />
            }
          />
          <Route path="/config-form" element={<ConfigForm isCollapsed={isCollapsed} />} />
          <Route path="/preview" element={<Preview isCollapsed={isCollapsed} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
