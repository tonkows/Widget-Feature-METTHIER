import React, { useState } from "react";
import styled from "styled-components";
import { BiEditAlt } from "react-icons/bi";
import { GoArrowSwitch } from "react-icons/go";
import { RiResetLeftFill } from "react-icons/ri";
import { MdPublic } from "react-icons/md";
import { Button as AntButton, Modal } from "antd";

const Header = ({ toggleSidebar, isCollapsed, hasData, onEditToggle, isEditing, isSwitching, onSwitchToggle }) => {
  const handleResetDefault = () => {
    Modal.confirm({
      title: 'Reset All Blocks',
      content: 'Are you sure you want to reset all blocks to default? This action cannot be undone.',
      okText: 'Reset',
      okButtonProps: {
        danger: true,
      },
      onOk: () => {
        const blockIds = [
          "Left-TopLeft",
          "Right-TopRight",
          "Left-MiddleTopLeft",
          "Right-MiddleTopRight",
          "Left-MiddleBottomLeft",
          "Right-MiddleBottomRight",
          "Left-BottomLeft",
          "Right-BottomRight",
          "BottomCenter-Left",
          "BottomCenter-Right"
        ];

        blockIds.forEach(blockId => {
          localStorage.removeItem(`block-${blockId}`);
        });

        localStorage.removeItem('configFormData');
        window.location.reload();
      }
    });
  };

  return (
    <StyledHeader isCollapsed={isCollapsed}>
      <LeftSection></LeftSection>
      <RightSection>
        <StyledButton onClick={onEditToggle}>
          <BiEditAlt className="icon-edit" />
          {isEditing ? "Cancel Edit" : "Edit"}
        </StyledButton>
        <StyledButton onClick={onSwitchToggle}>
          <GoArrowSwitch className="icon-switch" />
          {isSwitching ? "Cancel Switch" : "Switch"}
        </StyledButton>
        <StyledButton>
          <MdPublic className="icon-public" />
          Publish
        </StyledButton>
        <StyledButton onClick={handleResetDefault}>
          <RiResetLeftFill className="icon-reset" />
          Reset Default
        </StyledButton>
      </RightSection>
    </StyledHeader>
  );
};

export default Header;

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 0 16px;
  background-color: var(--card-bg-color);
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

const StyledButton = styled.button`
  background-color: var(--button-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 14px;
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

  &:disabled {
    background-color: gray;
    cursor: not-allowed;
  }

  .icon-public{
    margin-right: 5px;
    font-size: 15px;
  }
  .icon-Reset{
    margin-right: 5px;
    font-size: 15px;
  }
`;
