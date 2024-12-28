import React from "react";
import styled from "styled-components";
import { BiEditAlt } from "react-icons/bi";
import { GoArrowSwitch } from "react-icons/go";

const Header = ({ toggleSidebar, isCollapsed }) => {
  return (
    <StyledHeader isCollapsed={isCollapsed}>
      <LeftSection>
        {/* เว้นที่สำหรับโลโก้ หรือปุ่ม */}
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
  background-color: rgb(108, 101, 101);
  position: fixed;
  top: 0;
  left: ${(props) => (props.isCollapsed ? "54px" : "220px")}; /* ปรับตำแหน่งตาม Sidebar */
  width: calc(100% - ${(props) => (props.isCollapsed ? "54px" : "220px")}); /* ปรับความกว้าง */
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
  background-color: #fd6e2b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e65a12;
  }

  .icon-edit{
    margin-right: 5px;
    Font-size: 15px;
  }
  .icon-switch{
    margin-right: 5px;
    Font-size: 15px;
  }
`;
