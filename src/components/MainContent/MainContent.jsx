import React from "react";
import { Row, Col } from "antd";
import styled from "styled-components";
import { FiPlus } from "react-icons/fi";

const MainContent = ({ isCollapsed }) => {
  return (
    <Container className={isCollapsed ? "isCollapsed" : "notCollapsed"}>
      <WrapperDiv>
        <StyledRow gutter={[8, 8]}>
          {/* Column 1 */}
          <StyledCol span={6}>
            <SpacedRow>
              <Col span={24}>
                <Block><LargeFiPlus /></Block>
              </Col>
            </SpacedRow>
            <SpacedRow>
              <Col span={24}>
                <Block><LargeFiPlus /></Block>
              </Col>
            </SpacedRow>
            <SpacedRow>
              <Col span={24}>
                <Block><LargeFiPlus /></Block>
              </Col>
            </SpacedRow>
            <SpacedRow>
              <Col span={24}>
                <Block><LargeFiPlus /></Block>
              </Col>
            </SpacedRow>
          </StyledCol>

          {/* Column 2 */}
          <StyledCol span={12}>
            <SpacedRow style={{ height: "70%" }}>
              <Col span={24}>
                <Block>3D Model</Block>
              </Col>
            </SpacedRow>
            <SpacedRow style={{ height: "30%" }}>
              <Col span={24}>
                <Block><LargeFiPlus /></Block>
              </Col>
            </SpacedRow>
          </StyledCol>

          {/* Column 3 */}
          <StyledCol span={6}>
            <SpacedRow>
              <Col span={24}>
                <Block><LargeFiPlus /></Block>
              </Col>
            </SpacedRow>
            <SpacedRow>
              <Col span={24}>
                <Block><LargeFiPlus /></Block>
              </Col>
            </SpacedRow>
            <SpacedRow>
              <Col span={24}>
                <Block><LargeFiPlus /></Block>
              </Col>
            </SpacedRow>
            <SpacedRow>
              <Col span={24}>
                <Block><LargeFiPlus /></Block>
              </Col>
            </SpacedRow>
          </StyledCol>
        </StyledRow>
      </WrapperDiv>
    </Container>
  );
};

export default MainContent;

const Container = styled.div`
  height: calc(100vh - 10px);
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
  display: flex;
  margin-top: 34px;
  margin-left: 3px !important;
  margin-right: 10px;
  row-gap: 8px;
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

const LargeFiPlus = styled(FiPlus)`
  font-size: 24px;
`;
