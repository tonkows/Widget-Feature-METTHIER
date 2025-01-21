import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BiEditAlt } from "react-icons/bi";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const MainContent = ({ isCollapsed, isEditing, isSwitching }) => {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [blocks, setBlocks] = useState({
    "Left-TopLeft": { width: 6, id: "Left-TopLeft"  },
    "Right-TopRight": { width: 6, id: "Right-TopRight"},
    "Left-MiddleTopLeft": { width: 6, id: "Left-MiddleTopLeft" },
    "Right-MiddleTopRight": { width: 6, id: "Right-MiddleTopRight" },
    "Left-MiddleBottomLeft": { width: 6, id: "Left-MiddleBottomLeft" },
    "Right-MiddleBottomRight": { width: 6, id: "Right-MiddleBottomRight" },
    "Left-BottomLeft": { width: 6, id: "Left-BottomLeft" },
    "Right-BottomRight": { width: 6, id: "Right-BottomRight" },
    "BottomCenter-Left": { width: 12, id: "BottomCenter-Left" },
    "BottomCenter-Right": { width: 12, id: "BottomCenter-Right" },
  });

  const navigate = useNavigate();

  
  const handleClick = (blockId) => {
    console.log(`clicked on Block ${blockId}`);
    navigate(`/config-form?block=${blockId}`);
  };

  const handleSelectBlock = (blockId) => {
    if (!isSwitching) {
      console.warn("Switching mode is not enabled!");
      return; 
    }
  
    if (selectedBlock === null) {
      setSelectedBlock(blockId);
    } else {
      const selectedBlockWidth = blocks[selectedBlock]?.width;
      const clickedBlockWidth = blocks[blockId]?.width;
  
      if (selectedBlockWidth === clickedBlockWidth) {
        const firstBlockData = localStorage.getItem(`block-${selectedBlock}`);
        const secondBlockData = localStorage.getItem(`block-${blockId}`);
        
        if (firstBlockData) {
          localStorage.setItem(`block-${blockId}`, firstBlockData);
        } else {
          localStorage.removeItem(`block-${blockId}`);
        }
        
        if (secondBlockData) {
          localStorage.setItem(`block-${selectedBlock}`, secondBlockData);
        } else {
          localStorage.removeItem(`block-${selectedBlock}`);
        }

        setBlocks((prevBlocks) => {
          const newBlocks = { ...prevBlocks };
          const tempBlock = newBlocks[selectedBlock];
          newBlocks[selectedBlock] = newBlocks[blockId];
          newBlocks[blockId] = tempBlock;
          return newBlocks;
        });
      }
      setSelectedBlock(null);
    }
  };
  
  useEffect(() => {
    console.log("Blocks after swap: ", blocks);
  }, [blocks]);

  useEffect(() => {
    if (!isSwitching) {
      setSelectedBlock(null);
    }
  }, [isSwitching]);

  const renderChart = (blockId) => {
    const blockConfig = localStorage.getItem(`block-${blockId}`);
    if (!blockConfig) return null;

    const config = JSON.parse(blockConfig);
    const ChartComponent = {
      'bar chart': Bar,
      'line chart': Line,
      'doughnut chart': Doughnut
    }[config.selectedChart];

    if (!ChartComponent) return null;

    const responsiveOptions = {
      ...config.chartOptions,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        ...config.chartOptions.plugins,
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
          text: config.subject,
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
      <ChartContainer>
        <ChartComponent
          data={config.chartData}
          options={responsiveOptions}
        />
      </ChartContainer>
    );
  };

  const renderColumnContent = (columnId) => {
    const blockNames = {
      Left: ["TopLeft", "MiddleTopLeft", "MiddleBottomLeft", "BottomLeft"],
      Right: ["TopRight", "MiddleTopRight", "MiddleBottomRight", "BottomRight"],
    };

    return blockNames[columnId]?.map((blockName) => {
      const blockId = `${columnId}-${blockName}`;
      const isSelected = selectedBlock === blockId && isSwitching;
      return (
        <SpacedRow key={blockId}>
          <Col span={24}>
            <Block
              style={{
                border: isSelected ? "2px solid var(--text-color)" : "none",
              }}
              onClick={() => isSwitching && handleSelectBlock(blockId)}
            >
              {isEditing && (
                <IconButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(blockId);
                  }}
                  aria-label={`Edit Block ${blockId}`}
                >
                  <EditIcon />
                </IconButton>
              )}
              {renderChart(blockId) || <BlockLabel>{blocks[blockId]?.label}</BlockLabel>}
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
          <StyledCol span={6}>{renderColumnContent("Left")}</StyledCol>
          <StyledCol span={12}>
            <SpacedRow style={{ height: "70%" }}>
              <Col span={24}>
                <Block>3D Model</Block>
              </Col>
            </SpacedRow>
            <SpacedRow style={{ height: "30%" }} gutter={[6, 0]}>
              <Col span={12}>
                <Block
                  onClick={() => isSwitching && handleSelectBlock("BottomCenter-Left")}
                  style={{
                    border: selectedBlock === "BottomCenter-Left" && isSwitching ? "2px solid var(--text-color)" : "none",
                  }}
                >
                  {isEditing && (
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick("BottomCenter-Left");
                      }} 
                      aria-label="Edit Bottom Center Left"
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {renderChart("BottomCenter-Left") || <BlockLabel>{blocks["BottomCenter-Left"].label}</BlockLabel>}
                </Block>
              </Col>
              <Col span={12}>
                <Block
                  onClick={() => isSwitching && handleSelectBlock("BottomCenter-Right")}
                  style={{
                    border: selectedBlock === "BottomCenter-Right" && isSwitching ? "2px solid var(--text-color)" : "none",
                  }}
                >
                  {isEditing && (
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick("BottomCenter-Right");
                      }} 
                      aria-label="Edit Bottom Center Right"
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {renderChart("BottomCenter-Right") || <BlockLabel>{blocks["BottomCenter-Right"].label}</BlockLabel>}
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

export default MainContent;


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
const BlockLabel = styled.div`
  font-size: 20px;
  color: white;
  font-weight: bold;
  position: absolute;
  top: 10px;
  left: 10px;
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

const IconButton = styled.button`
  position: absolute; 
  top: 10px;      
  right: 10px;    
  background: var(--button-bg-color);
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  transition: all 0.2s ease;

  &:hover {
    background: var(--button-hover-bg-color);
    transform: scale(1.05);
  }

  svg {
    width: 18px;
    height: 18px;
    color: var(--text-color);
  }
`;

const EditIcon = styled(BiEditAlt)`
  font-size: 18px;
  color: var(--text-color);
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
`;
