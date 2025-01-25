import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
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

    // เก็บข้อมูลว่ามาจากหน้าไหน
    const previousPath = localStorage.getItem('previousPath') || '/config-form';
    if (window.location.pathname !== previousPath) {
      localStorage.setItem('previousPath', window.location.pathname);
    }
  }, []);

  const renderChart = (blockId) => {
    // ดึงข้อมูล preview จาก localStorage
    const previewData = localStorage.getItem(`preview-${blockId}`);
    
    // ถ้ามีข้อมูล preview ให้ใช้ข้อมูลนั้น
    if (previewData) {
      const config = JSON.parse(previewData);
      
      // กรณี info-display
      if (config.type === "info-display") {
        return (
          <Block>
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
          </Block>
        );
      }

      // กรณี custom chart
      if (config.type === "chart-with-description") {
        const ChartComponent = {
          'bar chart': Bar,
          'line chart': Line,
          'doughnut chart': Doughnut
        }[config.chart.type];

        if (!ChartComponent) return null;

        return (
          <Block>
            <ChartContainer>
              <ChartWrapper style={{ width: '100%', height: '100%' }}>
                <ChartComponent
                  data={config.chart.data}
                  options={{
                    ...config.chart.options,
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      ...config.chart.options?.plugins,
                      title: {
                        display: true,
                        text: [config.chart.title, config.chart.subtitle],
                        position: 'top',
                        align: 'start',
                        font: { size: 12, weight: 'bold' }
                      }
                    }
                  }}
                />
              </ChartWrapper>
            </ChartContainer>
          </Block>
        );
      }

      // กรณี multi-chart
      if (config.type === "multi-chart") {
        return (
          <Block>
            <ChartContainer layout={config.layout}>
              {config.charts.map((chart, index) => {
                const ChartComponent = {
                  'bar chart': Bar,
                  'line chart': Line,
                  'doughnut chart': Doughnut
                }[chart.type];

                if (!ChartComponent) return null;

                return (
                  <ChartWrapper 
                    key={index}
                    layout={config.layout}
                    style={{
                      width: config.layout === 'horizontal' ? '48%' : '100%',
                      height: config.layout === 'horizontal' ? '100%' : '48%'
                    }}
                  >
                    <ChartComponent
                      data={chart.data}
                      options={{
                        ...chart.options,
                        maintainAspectRatio: false,
                        responsive: true
                      }}
                    />
                  </ChartWrapper>
                );
              })}
            </ChartContainer>
          </Block>
        );
      }

      // กรณี single chart
      const ChartComponent = {
        'bar chart': Bar,
        'line chart': Line,
        'doughnut chart': Doughnut
      }[config.type];

      if (!ChartComponent) return null;

      return (
        <Block>
          <ChartComponent
            data={config.data}
            options={{
              ...config.options,
              maintainAspectRatio: false,
              responsive: true
            }}
          />
        </Block>
      );
    }

    // ถ้าไม่มีข้อมูล preview ให้ใช้ข้อมูล default
    const defaultConfig = defaultBlockContents[blockId];
    if (!defaultConfig) return null;

    // กรณีเป็น info-display
    if (defaultConfig.type === "info-display") {
      return (
        <Block>
          <InfoDisplayContainer layout={defaultConfig.layout}>
            {defaultConfig.items.map((item) => (
              <InfoItem
                key={item.id}
                style={{
                  backgroundColor: item.style.backgroundColor,
                  borderColor: item.style.borderColor,
                  width: defaultConfig.styles.itemWidth
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
        </Block>
      );
    }

    // กรณีเป็น chart แบบปกติ
    if (defaultConfig.charts && Array.isArray(defaultConfig.charts)) {
      return (
        <Block>
          <ChartContainer layout={defaultConfig.layout}>
            {defaultConfig.charts.map((chart, index) => {
              const ChartComponent = {
                'bar chart': Bar,
                'line chart': Line,
                'doughnut chart': Doughnut
              }[chart.type];

              if (!ChartComponent) return null;

              return (
                <ChartWrapper 
                  key={index}
                  layout={defaultConfig.layout}
                  style={{
                    width: defaultConfig.layout === 'horizontal' ? '48%' : '100%',
                    height: defaultConfig.layout === 'horizontal' ? '100%' : '48%'
                  }}
                >
                  <ChartComponent
                    data={chart.data}
                    options={{
                      ...chart.options,
                      maintainAspectRatio: false,
                      responsive: true
                    }}
                  />
                </ChartWrapper>
              );
            })}
          </ChartContainer>
        </Block>
      );
    }
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
        // ใช้ selectedButton จาก preview data
        const selectedTab = previewData.selectedButton || "default";
        localStorage.setItem(`selected-tab-${blockId}`, selectedTab);
        
        if (selectedTab === "default") {
          const defaultConfig = defaultBlockContents[blockId];
          const savedConfig = {
            selectedButton: "default",
            chartData: defaultConfig.chartData,
            chartOptions: defaultConfig.chartOptions,
            chartType: defaultConfig.chartType,
            subject_label: defaultConfig.subject_label,
            subtitle: defaultConfig.subtitle,
            dataset_label: defaultConfig.dataset_label,
            ranges: [],
            subject: null,
            datatype: null,
            dataset: null,
            selectedChart: defaultConfig.chartType
          };
          localStorage.setItem(`block-config-${blockId}`, JSON.stringify(savedConfig));
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

// เพิ่ม styled components สำหรับ info-display
const InfoDisplayContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.layout === 'vertical' ? 'column' : 'row'};
  gap: 15px;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 20px;
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