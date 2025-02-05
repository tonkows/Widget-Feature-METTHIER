import React, { useEffect, useState } from "react";
import { Row, Col, Button, Modal, message } from "antd";
import styled from "styled-components";
import { BiArrowBack, BiCamera as CameraIcon, BiCameraOff as CameraOffIcon } from "react-icons/bi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import defaultBlockContents from '../defaultdata/block_default_content.json';
import subjectData from '../data/subject_data.json';


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
    
    if (previewData) {
      const config = JSON.parse(previewData);

      if (config.type === "combined-display") {
        return (
          <Block>
            <CombinedContainer>
              <InfoSection width={config.styles?.infoSectionWidth}>
                <InfoDisplayContainer>
                  {config.items.map((item) => (
                    <InfoItem
                      key={item.id}
                      style={{
                        backgroundColor: item.style?.backgroundColor || 'var(--background-color)',
                        borderColor: item.style?.borderColor || 'var(--border-color)',
                        width: '100%'
                      }}
                    >
                    
                      <InfoContent>
                        <InfoTitle>
                          {item.title}
                        </InfoTitle>
                        <InfoValue>
                          {item.value}
                          <InfoUnit>{item.unit}</InfoUnit>
                        </InfoValue>
                      </InfoContent>
                    </InfoItem>
                  ))}
                </InfoDisplayContainer>
              </InfoSection>

              <ChartSection width={config.styles?.chartSectionWidth}>
                {config.charts.map((chart, index) => {
                  const ChartComponent = {
                    'bar chart': Bar,
                    'line chart': Line,
                    'doughnut chart': Doughnut
                  }[chart.type];

                  if (!ChartComponent) return null;

                  return (
                    <ChartWrapper key={index}>
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
                              text: [chart.title || chart.title, chart.subtitle],
                              font: { size: 10, weight: 'bold' },
                              padding: { top: 5, bottom: 5 }
                            }
                          }
                        }}
                      />
                    </ChartWrapper>
                  );
                })}
              </ChartSection>
            </CombinedContainer>
          </Block>
        );
      }

      if (config.type === "info-display") {
        return (
          <Block>
            <InfoDisplayContainer layout={config.layout}>
              {config.items.map((item) => (
                <InfoItem
                  key={item.id}
                  style={{
                    backgroundColor: item.style?.backgroundColor || 'var(--background-color)',
                    borderColor: item.style?.borderColor || 'var(--border-color)',
                    width: item.style?.width || 'calc(33.33% - 8px)'
                  }}
                >
                  <InfoIcon status={item.status}>
                    {item.icon === 'camera' ? <CameraIcon /> : <InfoIcon />}
                  </InfoIcon>
                  <InfoContent>
                    <InfoTitle>
                      {item.title}
                    </InfoTitle>
                    <InfoValue>
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

  
      if (config.type === "chart-with-description") {
        const ChartComponent = {
          'bar chart': Bar,
          'line chart': Line,
          'doughnut chart': Doughnut
        }[config.chart.type];

        if (!ChartComponent) return null;

        const currentSubject = subjectData[config.chart.title]?.[Object.keys(subjectData[config.chart.title])[0]]?.[0];
        const subjectLabel = currentSubject?.subject_label || config.chart.title;

        return (
          <Block>
            <ChartContainer>
              <ChartWrapper style={{ width: '100%', height: '100%' }}>
                <ChartComponent
                  data={config.chart.data}
                  options={{
                    ...config.chart.options,
                    plugins: {
                      ...config.chart.options.plugins,
                      title: {
                        display: true,
                        text: [subjectLabel, config.chart.subtitle],
                        position: 'top',
                        align: 'center',
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
                      width: config.layout === 'horizontal' ? '100%' : '100%',
                      height: config.layout === 'horizontal' ? '100%' : '100%'
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
                                text: [chart.title|| chart.title, chart.subtitle],
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
      }

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
    } else if (blockConfig) {
      const config = JSON.parse(blockConfig);
      
      if (config.selectedChart) {
        const ChartComponent = {
          'bar chart': Bar,
          'line chart': Line,
          'doughnut chart': Doughnut
        }[config.selectedChart];

        if (!ChartComponent) return null;

        return (
          <Block>
            <ChartContainer>
              <ChartWrapper style={{ width: '100%', height: '100%' }}>
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
      } else if (config.charts) {
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
                      width: config.layout === 'horizontal' ? '100%' : '100%',
                      height: config.layout === 'horizontal' ? '100%' : '48%'
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
                            text: [config.subject_label|| chart.title,  config.subtitle],
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
      }
    }

    const defaultConfig = defaultBlockContents[blockId];
    if (!defaultConfig) return null;

 
    


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

              const compareData = chart.data;

          
                console.log('inpreview---')
                console.log(compareData);
              

              return (
                <ChartWrapper 
                  key={index}
                  layout={defaultConfig.layout}
                  style={{
                    width: defaultConfig.layout === 'horizontal' ? '100%' : '100%',
                    height: defaultConfig.layout === 'horizontal' ? '100%' : '48%'
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
    if (!blockId) return;

    const previewData = localStorage.getItem(`preview-${blockId}`);
    if (!previewData) return;

    const data = JSON.parse(previewData);

    if (data.selectedButton === "default") {
      localStorage.setItem(`block-${blockId}`, JSON.stringify({
        selectedButton: "default",
        subject: data.subject,
        datatype: data.datatype,
        type: data.type,
        layout: data.layout,
        charts: data.charts
      }));
      message.success({
        content: 'Chart has been generated successfully',
        duration: 2,
        style: {
          marginTop: '48px'
        }
      });
      navigate('/');
    } else {
      const customData = {
        subject: data.chart.title,
        datatype: data.chart.subtitle,
        dataset: data.description?.highlights?.[0]?.split(': ')[1],
        selectedChart: data.chart.type,
        chartData: data.chart.data,
        chartOptions: data.chart.options,
        subject_label: data.chart.title,
        dataset_label: data.description?.highlights?.[0]?.split(': ')[1],
        subtitle: data.chart.subtitle
      };

      localStorage.setItem(`block-${blockId}`, JSON.stringify(customData));
      
      message.success({
        content: 'Chart has been generated successfully',
        duration: 2,
        style: {
          marginTop: '48px'
        }
      });
      navigate('/');
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
      <WrapperDiv>
        <StyledRow gutter={[8, 8]}>
          <StyledCol span={6}>{renderColumnContent("Left")}</StyledCol>
          <StyledCol span={12}>
            <SpacedRow style={{ height: "70%" }}>
              <Col span={24}>
                <Block>Preview</Block>
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
  width: ${props => props.layout === 'horizontal' ? '100%' : '100%'};
  height: ${props => props.layout === 'horizontal' ? '100%' : '100%'};
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





