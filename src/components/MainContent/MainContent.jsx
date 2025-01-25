import React, { useState, useEffect } from "react";
import { Row, Col, message } from "antd";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BiEditAlt, BiCamera as CameraIcon, BiCameraOff as CameraOffIcon } from "react-icons/bi";
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
import defaultBlockContents from '../defaultdata/block_default_content.json';
import { Modal } from "antd";

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

  const [originalPositions, setOriginalPositions] = useState({});
  const [blockContents, setBlockContents] = useState({});
  const [modifiedPositions, setModifiedPositions] = useState({});

  const navigate = useNavigate();

  
  const handleClick = (blockId) => {
    console.log(`clicked on Block ${blockId}`);
    const blockConfig = localStorage.getItem(`block-${blockId}`);
    let config;
    
    if (!blockConfig) {
      config = defaultBlockContents[blockId];
    } else {
      config = JSON.parse(blockConfig);
    }

    const searchParams = new URLSearchParams({
      block: blockId,
      data: JSON.stringify(config)
    });
    
    navigate(`/config-form?${searchParams.toString()}`);
  };

  const handleBlockSwitch = (blockId) => {
    if (selectedBlock && selectedBlock !== blockId) {
      const selectedBlockWidth = blocks[selectedBlock].width;
      const clickedBlockWidth = blocks[blockId].width;

      if (selectedBlockWidth === clickedBlockWidth) {
       
        const firstBlockConfig = localStorage.getItem(`block-${selectedBlock}`);
        const secondBlockConfig = localStorage.getItem(`block-${blockId}`);
        
        let firstContent = firstBlockConfig ? JSON.parse(firstBlockConfig) : defaultBlockContents[selectedBlock];
        let secondContent = secondBlockConfig ? JSON.parse(secondBlockConfig) : defaultBlockContents[blockId];

      
        const firstLastDefault = localStorage.getItem(`block-${selectedBlock}-last-default`);
        const secondLastDefault = localStorage.getItem(`block-${blockId}-last-default`);

       
        if (firstLastDefault) {
          localStorage.setItem(`block-${blockId}-last-default`, firstLastDefault);
        } else {
          localStorage.setItem(`block-${blockId}-last-default`, JSON.stringify(defaultBlockContents[selectedBlock]));
        }

        if (secondLastDefault) {
          localStorage.setItem(`block-${selectedBlock}-last-default`, secondLastDefault);
        } else {
          localStorage.setItem(`block-${selectedBlock}-last-default`, JSON.stringify(defaultBlockContents[blockId]));
        }

        
        const tempDefault = defaultBlockContents[selectedBlock];
        defaultBlockContents[selectedBlock] = defaultBlockContents[blockId];
        defaultBlockContents[blockId] = tempDefault;

    
        setBlockContents(prev => ({
          ...prev,
          [selectedBlock]: {
            ...secondContent,
            originalPosition: selectedBlock
          },
          [blockId]: {
            ...firstContent,
            originalPosition: blockId
          }
        }));

    
        setModifiedPositions(prev => ({
          ...prev,
          [selectedBlock]: blockId,
          [blockId]: selectedBlock
        }));

        
        localStorage.setItem(`block-${blockId}`, JSON.stringify({
          ...firstContent,
          originalPosition: blockId
        }));
        localStorage.setItem(`block-${selectedBlock}`, JSON.stringify({
          ...secondContent,
          originalPosition: selectedBlock
        }));

        
        setBlocks((prevBlocks) => {
          const newBlocks = { ...prevBlocks };
          [newBlocks[selectedBlock], newBlocks[blockId]] = [
            newBlocks[blockId],
            newBlocks[selectedBlock],
          ];
          return newBlocks;
        });

        setSelectedBlock(null);
      } else {
        message.error({
          content: "Can only switch blocks of the same size",
          duration: 1,
          style: {
            marginTop: '50px'
          }
        });
      }
    } else {
      setSelectedBlock(blockId);
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

  useEffect(() => {
    const positions = {};
    const contents = {};
    const modified = {};
    
    Object.keys(blocks).forEach(blockId => {
      positions[blockId] = blockId;
      
      const blockConfig = localStorage.getItem(`block-${blockId}`);
      if (blockConfig) {
        contents[blockId] = JSON.parse(blockConfig);
        modified[blockId] = blockId;
      } else {
        contents[blockId] = defaultBlockContents[blockId];
      }
    });
    
    setOriginalPositions(positions);
    setBlockContents(contents);
    setModifiedPositions(modified);
  }, []);

  useEffect(() => {
    localStorage.setItem('previousPath', '/');
  }, []);

  const renderChart = (blockId) => {
    const blockConfig = localStorage.getItem(`block-${blockId}`);
    let config;

    if (!blockConfig) {
      config = defaultBlockContents[blockId];
    } else {
      config = JSON.parse(blockConfig);
    }

    if (!config) return null;

    // เพิ่มการรองรับ info-display
    if (config.type === "info-display") {
      return (
        <InfoDisplayContainer layout={config.layout}>
          {config.items.map((item) => (
            <InfoItem
              key={item.id}
              style={{
                backgroundColor: item.style.backgroundColor,
                borderColor: item.style.borderColor,
                width: config.styles.itemWidth
              }}
            >
              <InfoIcon status={item.status}>
                {item.icon === 'camera' ? <CameraIcon /> : <CameraOffIcon />}
              </InfoIcon>
              <InfoContent>
                <InfoTitle style={{ color: item.style.textColor }}>
                  {item.title}
                </InfoTitle>
                <InfoValue style={{ color: item.style.textColor }}>
                  {item.value}
                  <InfoUnit>{item.unit}</InfoUnit>
                </InfoValue>
              </InfoContent>
            </InfoItem>
          ))}
        </InfoDisplayContainer>
      );
    }

    // กรณีมีหลาย charts
    if (config.charts && Array.isArray(config.charts)) {
      return (
        <ChartContainer layout={config.layout || 'horizontal'}>
          {config.charts.map((chart, index) => {
            const ChartComponent = {
              'bar chart': Bar,
              'line chart': Line,
              'doughnut chart': Doughnut
            }[chart.type || chart.selectedChart];

            if (!ChartComponent) return null;

            return (
              <ChartWrapper 
                key={index}
                layout={config.layout || 'horizontal'}
                style={{
                  width: config.layout === 'horizontal' ? '48%' : '100%',
                  height: config.layout === 'horizontal' ? '100%' : '48%'
                }}
              >
                <ChartComponent
                  data={chart.chartData || chart.data}
                  options={{
                    ...chart.chartOptions || chart.options,
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                        labels: {
                          boxWidth: 10,
                          padding: 5,
                          font: { size: 8 }
                        }
                      },
                      title: {
                        display: true,
                        text: [chart.subject_label || chart.title, chart.subtitle],
                        font: { size: 10, weight: 'bold' },
                        padding: { top: 5, bottom: 5 }
                      }
                    }
                  }}
                />
              </ChartWrapper>
            );
          })}
        </ChartContainer>
      );
    }

    // กรณีมี chart เดียว
    const chartType = config.chartType || config.selectedChart;
    const ChartComponent = {
      'bar chart': Bar,
      'line chart': Line,
      'doughnut chart': Doughnut
    }[chartType];

    if (!ChartComponent) return null;

    return (
      <ChartWrapper>
        <ChartComponent
          data={config.chartData}
          options={{
            ...config.chartOptions,
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  boxWidth: 10,
                  padding: 5,
                  font: { size: 8 }
                }
              },
              title: {
                display: true,
                text: [config.subject_label, config.subtitle],
                font: { size: 10, weight: 'bold' },
                padding: { top: 5, bottom: 5 }
              }
            }
          }}
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
      const blockId = `${columnId}-${blockName}`;
      const isSelected = selectedBlock === blockId && isSwitching;
      return (
        <SpacedRow key={blockId}>
          <Col span={24}>
            <Block
              style={{
                border: isSelected ? "2px solid var(--text-color)" : "none",
              }}
              onClick={() => isSwitching && handleBlockSwitch(blockId)}
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

  const resetBlocks = () => {
    Modal.confirm({
      title: 'Reset to Default',
      content: 'Are you sure you want to reset all blocks to their default content?',
      onOk: () => {
      
        localStorage.clear();
  
      
        const defaultContents = require('../defaultdata/block_default_content.json');
  
   
        Object.keys(defaultBlockContents).forEach(key => {
          defaultBlockContents[key] = defaultContents[key];
        });
  
        Object.keys(defaultContents).forEach(blockId => {
          localStorage.setItem(`block-${blockId}`, JSON.stringify(defaultContents[blockId]));
        });
  
    
        setBlockContents(defaultContents);
        setModifiedPositions({});
        setSelectedBlock(null);
 
        window.location.reload();
      }
    });
  };
  

  return (
    <Container className={isCollapsed ? "isCollapsed" : "notCollapsed"}>
      {isSwitching && (
        <ResetButton onClick={resetBlocks}>
          Reset Default
        </ResetButton>
      )}
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
                  onClick={() => isSwitching && handleBlockSwitch("BottomCenter-Left")}
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
                  onClick={() => isSwitching && handleBlockSwitch("BottomCenter-Right")}
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
  flex-direction: ${props => props.layout === 'vertical' ? 'column' : 'row'};
  gap: 15px;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const ChartWrapper = styled.div`
  width: ${props => props.layout === 'horizontal' ? '48%' : '100%'};
  height: ${props => props.layout === 'horizontal' ? '100%' : '48%'};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;

  canvas {
    max-width: 100% !important;
    max-height: 100% !important;
  }
`;

const ResetButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px 16px;
  background: var(--button-bg-color);
  color: var(--text-color);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--button-hover-bg-color);
    transform: scale(1.05);
  }
`;

const InfoDisplayContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.layout === 'vertical' ? 'column' : 'row'};
  gap: 15px;
  width: 100%;
  height: 100%;
  padding: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const InfoIcon = styled.div`
  font-size: 24px;
  margin-right: 15px;
  opacity: ${props => props.status === 'active' ? 1 : 0.7};
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  display: flex;
  align-items: baseline;
`;

const InfoUnit = styled.span`
  font-size: 14px;
  font-weight: 400;
  margin-left: 5px;
  opacity: 0.8;
`;
