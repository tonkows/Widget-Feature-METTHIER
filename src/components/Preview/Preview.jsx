import React, { useEffect, useState } from "react";
import { Row, Col, Button, Modal } from "antd";
import styled from "styled-components";
import { BiArrowBack, BiCamera as CameraIcon, BiCameraOff as CameraOffIcon } from "react-icons/bi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import defaultBlockContents from '../defaultdata/block_default_content.json';


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


    const previousPath = localStorage.getItem('previousPath') || '/config-form';
    if (window.location.pathname !== previousPath) {
      localStorage.setItem('previousPath', window.location.pathname);
    }
  }, []);

  const renderChart = (blockId) => {
    const previewData = localStorage.getItem(`preview-${blockId}`);
    const blockConfig = localStorage.getItem(`block-${blockId}`);
    const currentBlockId = searchParams.get('block');
    const configTemp = localStorage.getItem(`config-temp-${blockId}`);
    const defaultData = defaultBlockContents[blockId];
    const mainContentConfig = localStorage.getItem(`block-${blockId}`);
    
    if (blockId === currentBlockId) {
      if (previewData) {
        const config = JSON.parse(previewData);
        const mainConfig = mainContentConfig ? JSON.parse(mainContentConfig) : null;

        if (configTemp) {
          const tempConfig = JSON.parse(configTemp);
          return renderDefaultChart({
            ...defaultData,
            charts: defaultData.charts.map(chart => ({
              ...chart,
              title: tempConfig.subject || mainConfig?.subject || chart.title,
              subtitle: tempConfig.datatype || mainConfig?.datatype || chart.subtitle,
              data: tempConfig.chartData || mainConfig?.chartData || chart.data,
              options: {
                ...chart.options,
                ...tempConfig.chartOptions,
                maintainAspectRatio: false,
                responsive: true
              }
            }))
          });
        }

        if (mainConfig) {
          return renderDefaultChart({
            ...defaultData,
            charts: defaultData.charts.map(chart => ({
              ...chart,
              title: mainConfig.subject || chart.title,
              subtitle: mainConfig.datatype || chart.subtitle,
              data: mainConfig.chartData || chart.data,
              options: {
                ...chart.options,
                ...mainConfig.chartOptions,
                maintainAspectRatio: false,
                responsive: true
              }
            }))
          });
        }
      }
    }

    if (mainContentConfig) {
      const config = JSON.parse(mainContentConfig);
      return renderDefaultChart({
        ...defaultData,
        charts: defaultData.charts.map(chart => ({
          ...chart,
          title: config.subject || chart.title,
          subtitle: config.datatype || chart.subtitle,
          data: config.chartData || chart.data,
          options: {
            ...chart.options,
            ...config.chartOptions,
            maintainAspectRatio: false,
            responsive: true
          }
        }))
      });
    }

    return renderDefaultChart(defaultData);
  };

  const renderDefaultChart = (defaultContent) => {
    if (!defaultContent) return null;

    return (
      <Block>
        <ChartContainer layout={defaultContent.layout}>
          {defaultContent.charts && defaultContent.charts.map((chart, index) => {
            const ChartComponent = {
              'bar chart': Bar,
              'line chart': Line,
              'doughnut chart': Doughnut
            }[chart.type];

            if (!ChartComponent) return null;

            return (
              <ChartWrapper 
                key={index}
                layout={defaultContent.layout}
                style={{
                  width: defaultContent.layout === 'horizontal' ? '100%' : '100%',
                  height: defaultContent.layout === 'horizontal' ? '100%' : '100%'
                }}
              >
                <ChartComponent
                  data={chart.data}
                  options={{
                    ...chart.options,
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
                        text: [chart.title, chart.subtitle],
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
      </Block>
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
              {renderChart(fullBlockId)}
            </Block>
          </Col>
        </SpacedRow>
      );
    });
  };
  const handleBack = () => {
    const savedPreview = localStorage.getItem(`preview-${blockId}`);
    if (savedPreview) {
      const previewData = JSON.parse(savedPreview);
      const previousPath = localStorage.getItem('previousPath');
      
      if (previousPath === '/') {
        navigate('/');
      } else {
        const selectedTab = previewData.selectedButton || "default";
      
        
        if (selectedTab === "default") {
          const config = {
            selectedButton: "default",
            subject: previewData.subject,
            datatype: previewData.datatype
          };
          localStorage.setItem(`block-config-${blockId}`, JSON.stringify(config));
        } else {
          const savedConfig = {
            selectedButton: "custom",
            subject: previewData.chart.title,
            datatype: previewData.chart.subtitle?.split(' - ')[0],
            dataset: previewData.description?.highlights?.[1]?.split(': ')[1],
            ranges: previewData.description?.highlights?.[0]?.split(': ')[1]?.split(', '),
            selectedChart: previewData.chart.type,
            chartData: previewData.chart.data,
            chartOptions: previewData.chart.options
          };
          localStorage.setItem(`block-config-${blockId}`, JSON.stringify(savedConfig));
        }
        
        navigate(`/config-form?block=${blockId}`);
      }
    } else {
      navigate('/');
    }
  };

  const handleGenerate = () => {
    const previewData = localStorage.getItem(`preview-${blockId}`);
    if (previewData) {
      const config = JSON.parse(previewData);
      
      localStorage.setItem(`block-${blockId}`, JSON.stringify(config));

      Modal.success({
        title: 'Success',
        content: 'Widget has been generated successfully',
        onOk: () => {
          window.removeEventListener('beforeunload', () => {});
          navigate('/');
        }
      });
    }
  };

  return (
    <Container className={isCollapsed ? "isCollapsed" : "notCollapsed"}>
      <BackButton 
        onClick={handleBack}
        isCollapsed={isCollapsed}
      >
        <BiArrowBack /> Back
      </BackButton>
      <ButtonContainer>
        
      </ButtonContainer>
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
                  {renderChart("BottomCenter-Left")}
                </Block>
              </Col>
              <Col span={12}>
                <Block>
                  {renderChart("BottomCenter-Right")}
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
  left: ${props => props.isCollapsed ? "60px" : "230px"};
  background: var(--button-color);
  border: none;
  border-radius: 4px;
  padding: 9px 14px;
  font-size: 14px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    font-size: 16px;
  }

  &:hover {
    background: var(--button-hover-color);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--text-color);
  }
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

const InfoDisplayContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.layout === 'horizontal' ? 'row' : 'column'};
  gap: 12px;
  width: 100%;
  height: 100%;
  justify-content: ${props => props.layout === 'horizontal' ? 'space-between' : 'flex-start'};
  align-items: ${props => props.layout === 'horizontal' ? 'center' : 'stretch'};
  padding: 8px;
  overflow: hidden;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--card-bg-color);
  height: 70px;
  min-width: 0;
  flex-shrink: 1;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const InfoIcon = styled.div`
  font-size: 16px;
  margin-right: 8px;
  flex-shrink: 0;
  opacity: ${props => props.status === 'active' ? 1 : 0.8};
  color: ${props => {
    switch(props.status) {
      case 'total': return 'rgba(75, 192, 192, 1)';
      case 'online': return 'rgba(54, 162, 235, 1)';
      case 'offline': return 'rgba(255, 99, 132, 1)';
      default: return 'var(--text-color)';
    }
  }};
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
  overflow: hidden;
`;

const InfoTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--text-color);
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InfoValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: baseline;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InfoUnit = styled.span`
  font-size: 10px;
  font-weight: 400;
  margin-left: 4px;
  opacity: 0.7;
  color: var(--text-color);
`;

const CombinedContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 12px;
  padding: 16px;
`;

const InfoSection = styled.div`
  width: ${props => props.width || '35%'};
  height: 100%;
  background: var(--background-color);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  order: 2;
`;

const ChartSection = styled.div`
  width: ${props => props.width || '65%'};
  height: 100%;
  background: var(--background-color);
  border-radius: 8px;
  padding: 12px;
  order: 1;
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 20px;
  display: flex;
  gap: 10px;
  transition: all 0.3s ease;

  &.isCollapsed {
    right: 20px;
  }

  &.notCollapsed {
    right: 20px;
  }
`;

const GenerateButton = styled.button`
  background: var(--button-color);
  border: none;
  border-radius: 4px;
  padding: 9px 14px;
  font-size: 14px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: var(--button-hover-color);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--text-color);
  }
`;