import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import styled from "styled-components";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Bar, Line, Doughnut } from "react-chartjs-2";

const Preview = ({ isCollapsed }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const blockId = searchParams.get('block');
  const [previewConfig, setPreviewConfig] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('previewData');
    if (data) {
      setPreviewConfig(JSON.parse(data));
    }
  }, []);

  const renderChart = () => {
    if (!previewConfig) return null;

    const ChartComponent = {
      'bar chart': Bar,
      'line chart': Line,
      'doughnut chart': Doughnut
    }[previewConfig.selectedChart];

    if (!ChartComponent) return null;

    const chartOptions = {
      ...previewConfig.chartOptions,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        ...previewConfig.chartOptions.plugins,
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 10,
            padding: 5,
            font: {
              size: 8
            }
          }
        },
        title: {
          display: true,
          text: previewConfig.subject,
          position: 'top',
          align: 'start',
          font: {
            size: 10,
            weight: 'bold'
          },
          padding: {
            top: 5,
            bottom: 5
          }
        }
      }
    };

    return (
      <ChartWrapper>
        <ChartComponent
          data={previewConfig.chartData}
          options={chartOptions}
        />
      </ChartWrapper>
    );
  };

  const renderColumnContent = (columnId) => {
    const blockNames = {
      Left: ["TopLeft", "MiddleTopLeft", "MiddleBottomLeft", "BottomLeft"],
      Right: ["TopRight", "MiddleTopRight", "MiddleBottomRight", "BottomRight"],
    };

    return blockNames[columnId]?.map((blockName) => {
      const fullBlockId = `${columnId}-${blockName}`;
      return (
        <SpacedRow key={fullBlockId}>
          <Col span={24}>
            <Block>
              {fullBlockId === blockId && renderChart()}
            </Block>
          </Col>
        </SpacedRow>
      );
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container className={isCollapsed ? "isCollapsed" : "notCollapsed"}>
      <BackButton 
        onClick={handleBack} 
        className={isCollapsed ? "isCollapsed" : "notCollapsed"}
      >
        <BiArrowBack /> Back
      </BackButton>
      <WrapperDiv>
        <StyledRow gutter={[8, 8]}>
          <StyledCol span={6}>{renderColumnContent("Left")}</StyledCol>
          <StyledCol span={12}>
            <SpacedRow style={{ height: "70%" }}>
              <Col span={24}>
                <Block>3D Model</Block>
              </Col>
            </SpacedRow>
            <SpacedRow style={{ height: "30%" }} gutter={[6, 0]}>
              <Col span={12}>
                <Block>
                  {"BottomCenter-Left" === blockId && renderChart()}
                </Block>
              </Col>
              <Col span={12}>
                <Block>
                  {"BottomCenter-Right" === blockId && renderChart()}
                </Block>
              </Col>
            </SpacedRow>
          </StyledCol>
          <StyledCol span={6}>{renderColumnContent("Right")}</StyledCol>
        </StyledRow>
      </WrapperDiv>
    </Container>
  );
};

export default Preview;

const Container = styled.div`
  height: calc(100vh - 20px);
  width: calc(100% - 220px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--content-bg-color);
  padding-top: 20px;
  margin-left: 220px;
  transition: all 0.3s ease;

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
  position: relative;
  overflow: hidden;
  cursor: ${props => props.onClick ? 'pointer' : 'default'};

  & > div {
    width: 100%;
    height: 100%;
    max-height: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }

  canvas {
    max-width: 100% !important;
    max-height: 100% !important;
  }
`;

const SpacedRow = styled(Row)`
  height: 25%;
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WrapperDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const BackButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--button-color);
  border: none;
  border-radius: 4px;
  padding: 9px 14px;
  font-size: 14px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &.isCollapsed {
    left: 60px;
  }

  &.notCollapsed {
    left: 230px;
  }

  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    font-size: 16px;
  }


  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--text-color);
  }
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;

  canvas {
    max-width: 100% !important;
    max-height: 100% !important;
  }
`;




