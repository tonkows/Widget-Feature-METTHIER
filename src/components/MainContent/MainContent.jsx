import React from "react";
import { Row, Col } from "antd";
import styled from "styled-components";

const MainContent = () => {
  return (
    <Container>
      <StyledRow gutter={[8, 8]}>
        {/* Column 1 */}
        <StyledCol span={5}>
          <SpacedRow>
            <Col span={24}>
              <Block>1</Block>
            </Col>
          </SpacedRow>
          <SpacedRow>
            <Col span={24}>
              <Block>2</Block>
            </Col>
          </SpacedRow>
          <SpacedRow>
            <Col span={24}>
              <Block>3</Block>
            </Col>
          </SpacedRow>
          <SpacedRow>
            <Col span={24}>
              <Block>4</Block>
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
              <Block>5</Block>
            </Col>
          </SpacedRow>
        </StyledCol>

        {/* Column 3 */}
        <StyledCol span={5}>
          <SpacedRow>
            <Col span={24}>
              <Block>6</Block>
            </Col>
          </SpacedRow>
          <SpacedRow>
            <Col span={24}>
              <Block>7</Block>
            </Col>
          </SpacedRow>
          <SpacedRow>
            <Col span={24}>
              <Block>8</Block>
            </Col>
          </SpacedRow>
          <SpacedRow>
            <Col span={24}>
              <Block>9</Block>
            </Col>
          </SpacedRow>
        </StyledCol>
      </StyledRow>
    </Container>
  );
};

export default MainContent;

// Styled Components
const Container = styled.div`
  height: 100vh; 
  width: 100vw; 
  display: flex;
  justify-content: center; 
  align-items: center; 
  background: var(--content-bg-color);
  overflow: hidden; 
  padding-top: 20px;
`;

const StyledRow = styled(Row)`
  height: calc(100% - 70px); 
  width: 100%;
  display: flex;
  overflow: hidden;
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

  &:last-child {
    margin-bottom: 0;
  }
`;
