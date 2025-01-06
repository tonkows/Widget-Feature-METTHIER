import React from "react";
import { Row, Col } from "antd";
import styled from "styled-components";
import { BiEditAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const MainContent = ({ isCollapsed }) => {
  const navigate = useNavigate();

  const handleClick = (blockId) => {
    console.log(`clicked on Block ${blockId}`);
    navigate(`/config-form?block=${blockId}`); 
  };

  const renderColumnContent = (columnId) => {

    const blockNames = {
      Left: ["TopLeft", "MiddleTopLeft", "MiddleBottomLeft", "BottomLeft"],
      right: ["TopRight", "MiddleTopRight", "MiddleBottomRight", "BottomRight"],
    };
  
    return blockNames[columnId]?.map((blockName) => {
      const blockId = `${columnId}-${blockName}`;
      return (
        <SpacedRow key={blockId}>
          <Col span={24}>
            <Block>
              <IconButton onClick={() => handleClick(blockId)}>
                <LargeBiEditAlt />
              </IconButton>
            </Block>
          </Col>
        </SpacedRow>
      );
    });
  };
  

  return (
    <Container className={isCollapsed ? "isCollapsed" : "notCollapsed"}>
      <WrapperDiv>
        <StyledRow gutter={[8, 8]}>
          {/* Column 1 */}
          <StyledCol span={6}>{renderColumnContent("Left")}</StyledCol>

          {/* Column 2 */}
          <StyledCol span={12}>
            <SpacedRow style={{ height: "70%" }}>
              <Col span={24}>
                <Block>3D Model</Block>
              </Col>
            </SpacedRow>
            <SpacedRow style={{ height: "30%" }} gutter={[6, 0]}>
            <Col span={12}>
              <Block gutter={[8, 8]}>
                <IconButton onClick={() => handleClick("BottomCenter-Left")}>
                  <LargeBiEditAlt />
                </IconButton>
              </Block>
            </Col>
            <Col span={12}>
              <Block>
                <IconButton onClick={() => handleClick("BottomCenter-Right")}>
                  <LargeBiEditAlt />
                </IconButton>
              </Block>
            </Col>
          </SpacedRow>
          </StyledCol>

          {/* Column 3 */}
          <StyledCol span={6}>{renderColumnContent("right")}</StyledCol>
        </StyledRow>
      </WrapperDiv>
    </Container>
  );
};

export default MainContent;

// Styled components
const Container = styled.div`
  height: calc(100vh - 20px);
  width: calc(100% - 220px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--content-bg-color);
  padding-top: 20px;
  margin-left: 220px;
  transition: margin-left 0.3s ease, width 0.3s ease;

  &.isCollapsed {
    width: calc(100% - 62px);
    margin-left: 55px;
  }

  &.notCollapsed {
    width: calc(100% - 229px);
    margin-left: 222px;
  }
`;

const StyledRow = styled(Row)`
  height: calc(100% - 50px);
  width: 100%;
  margin: 34px 10px 0 3px !important;
  row-gap: 8px;
  display: flex;
  transition: all 0.3s ease;
`;

const StyledCol = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Block = styled.div`
  height: 100%;
  color: var(--text-color);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--card-bg-color);
`;

const SpacedRow = styled(Row)`
  height: 25%;
  margin-bottom: 5px;
  transition: height 0.3s ease;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WrapperDiv = styled.div`
  width: 100%;
  height: 100%;
  transition: width 0.3s ease;
`;

const IconButton = styled.button`
  background: var(--button-bg-color);
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: var(--button-hover-bg-color);
  }
`;
const LargeBiEditAlt = styled(BiEditAlt)`
  font-size: 18px; 
  color: var(--text-color);
   position: absolute; 
  top: 10px;
  right: 10px; 
`;