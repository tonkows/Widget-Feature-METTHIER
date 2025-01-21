import React, { useState, useEffect } from "react";
import { Select, Button, Radio, DatePicker, Modal, Breadcrumb } from "antd";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
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
import subjectData from "../data/subject_data.json";

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

const { Option } = Select;
const { RangePicker } = DatePicker;

const ConfigForm = ({ isCollapsed }) => {
  const [subject1, setSubject1] = useState(null);
  const [datatype1, setDatatype1] = useState(null);
  const [dataset1, setDataset1] = useState(null);
  const [selectedRanges, setSelectedRanges] = useState([]);
  const [selectedButton, setSelectedButton] = useState("default");
  const [isDateVisible, setDateVisible] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [datasetData, setDatasetData] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const blockId = searchParams.get('block');
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    console.log("Set selected chart " + selectedChart);
  }, [selectedChart]);

  useEffect(() => {
    const loadInitialData = async () => {
      if (blockId) {
        const savedConfig = localStorage.getItem(`block-config-${blockId}`);
        if (savedConfig) {
          const config = JSON.parse(savedConfig);
          setSelectedButton(config.selectedButton);
          setSubject1(config.subject);
          setDatatype1(config.datatype);
          setDataset1(config.dataset);
          setSelectedRanges(config.ranges);
          setSelectedChart(config.selectedChart);
          setChartData(config.chartData);
          setChartOptions(config.chartOptions);

          if (config.subject && config.datatype && config.dataset) {
            try {
              const response = await import(`../data/${config.subject}/${config.datatype}/${config.dataset}.json`);
              setDatasetData(response.default);
            } catch (error) {
              console.error("Error loading dataset:", error);
            }
          }

          localStorage.removeItem(`block-config-${blockId}`);
          return;
        }

        const blockConfig = localStorage.getItem(`block-${blockId}`);
        if (blockConfig) {
          const config = JSON.parse(blockConfig);
          
          if (config.dataset) {
            setSelectedButton("custom");
          } else {
            setSelectedButton("default");
          }
          
          setSubject1(config.subject);
          setDatatype1(config.datatype);
          setDataset1(config.dataset);
          setSelectedRanges(config.ranges || []);
          setSelectedChart(config.selectedChart);
          setChartData(config.chartData);
          setChartOptions(config.chartOptions);

          if (config.subject && config.datatype && config.dataset) {
            try {
              const response = await import(`../data/${config.subject}/${config.datatype}/${config.dataset}.json`);
              setDatasetData(response.default);
            } catch (error) {
              console.error("Error loading dataset:", error);
            }
          }
        }
      }
    };

    loadInitialData();
  }, [blockId]);

  useEffect(() => {
    return () => {
      if (blockId) {
        localStorage.removeItem(`block-config-${blockId}`);
      }
    };
  }, [blockId]);

  const loadDatasetData = async (subject, datatype, dataset) => {
    if (!subject || !datatype || !dataset) {
      console.error("Invalid subject, datatype, or dataset");
      return;
    }
    
    try {
      const response = await import(`../data/${subject}/${datatype}/${dataset}.json`);
      setDatasetData(response.default);
    } catch (error) {
      console.error("Error loading dataset:", error);
    }
  };

  const handleButtonClick = (buttonType) => {
    if (selectedButton === buttonType) return;

    const isSelected =
      (selectedButton === "custom" && (subject1 || datatype1 || dataset1)) ||
      (selectedButton === "default" && (subject1 || datatype1));

    if (isSelected) {
      Modal.confirm({
        title: "Are you certain you wish to proceed with the switch? ",
        content: "The selected data will be lost.",
        onOk: () => {
          clearWidget();
          if (buttonType === "custom") {
            setSubject1(null);
            setDatatype1(null);
            setDataset1(null);
            setSelectedRanges([]);
          } else {
            setDataset1(null);
            setSelectedRanges([]);
          }
          setSelectedButton(buttonType);
        },
      });
    } else {
      clearWidget();
      if (buttonType === "custom") {
        const blockConfig = localStorage.getItem(`block-${blockId}`);
        if (blockConfig) {
          const config = JSON.parse(blockConfig);
          setSubject1(config.subject);
          setDatatype1(config.datatype);
          setDataset1(config.dataset);
          setSelectedRanges(config.ranges || []);
          if (config.subject && config.datatype && config.dataset) {
            loadDatasetData(config.subject, config.datatype, config.dataset);
          }
        } else {
          setSubject1(null);
          setDatatype1(null);
          setDataset1(null);
          setSelectedRanges([]);
        }
      } else {
        const blockConfig = localStorage.getItem(`block-${blockId}`);
        if (blockConfig) {
          const config = JSON.parse(blockConfig);
          setSubject1(config.subject);
          setDatatype1(config.datatype);
        } else {
          setSubject1(null);
          setDatatype1(null);
        }
        setDataset1(null);
        setSelectedRanges([]);
      }
      setSelectedButton(buttonType);
    }
  };

  const clearWidget = () => {
    setSelectedChart(null);
    setChartData(null);
    setSubject1(null);
    setDatatype1(null);
    setDataset1(null);
    setSelectedRanges([]);
    
    localStorage.removeItem('configFormData');
  };
  

  const handleSubjectChange1 = (value) => {
    setSubject1(value);
    setDatatype1(null);
    setDataset1(null);
    setSelectedRanges([]);
    setChartData(null);
    setDatasetData(null);
    setSelectedChart(null);
    setIsPreviewVisible(false);

    const configData = {
      subject: value,
      datatype: null,
      dataset: null,
      ranges: [],
      selectedChart: null
    };
    localStorage.setItem('configFormData', JSON.stringify(configData));
  };

  const handleDatatypeChange1 = (value) => {
    setDatatype1(value);        
    setDataset1(null);
    setSelectedRanges([]);
    setChartData(null);
    setDatasetData(null);
    setSelectedChart(null);
    setIsPreviewVisible(false);

    const configData = {
      subject: subject1,
      datatype: value,
      dataset: null,
      ranges: [],
      selectedChart: null
    };
    localStorage.setItem('configFormData', JSON.stringify(configData));
  };

  const handleDatasetChange1 = (value) => {
    const selectedDataset = subjectData[subject1]?.[datatype1]?.find(
      (d) => d.dataset === value
    );
    setDataset1(value);
  
    console.log("Subject:", subject1);
    console.log("Datatype:", datatype1);
    console.log("Available Datasets:", subjectData[subject1]?.[datatype1]);
    console.log("Selected Dataset:", selectedDataset);

    console.log("Value:", value);
    console.log("Dataset Found:", selectedDataset);

  
    if (selectedDataset) {
      loadDatasetData(subject1, datatype1, value);
    }

    const configData = {
      subject: subject1,
      datatype: datatype1,
      dataset: value,
      ranges: selectedRanges,
      selectedChart: selectedChart
    };
    localStorage.setItem('configFormData', JSON.stringify(configData));
  }; 

  const handleRangeChange = (value) => {
    setSelectedRanges([value]);
    setDateVisible(value === "date");

    const configData = {
      subject: subject1,
      datatype: datatype1,
      dataset: dataset1,
      ranges: [value],
      selectedChart: selectedChart
    };
    localStorage.setItem('configFormData', JSON.stringify(configData));
  };

  const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
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
        text: dataset1?.dataset || "",
        font: {
          size: 12
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 10 }
        }
      },
      x: {
        ticks: {
          font: { size: 10 }
        }
      }
    }
  };

  const generateChartData = (dataset, range) => {
    const chartData = {
      labels: [],
      datasets: []
    };
  
    if (!datasetData) return chartData;
  
    const data = datasetData.dataByRange[range];
  
    if (range === "date") {
      if (!selectedRanges[1] || !selectedRanges[1][0] || !selectedRanges[1][1]) {
        return chartData;
      }

      const selectedStartDate = selectedRanges[1][0]?.toDate();
      const selectedEndDate = selectedRanges[1][1]?.toDate();
  
      data.labels.forEach((label, index) => {
        const date = moment(label, "D/M/YYYY").toDate();
        if (date >= selectedStartDate && date <= selectedEndDate) {
          chartData.labels.push(label);
          data.datasets.forEach((ds, dsIndex) => {
            if (!chartData.datasets[dsIndex]) {
              chartData.datasets[dsIndex] = {
                label: ds.label,
                data: [],
                backgroundColor: ds.backgroundColor,
                borderColor: ds.borderColor,
                borderWidth: ds.borderWidth
              };
            }
            chartData.datasets[dsIndex].data.push(ds.data[index]);
          });
        }
      });
    } else {
      chartData.labels = data.labels;
      chartData.datasets = data.datasets.map((ds) => ({
        ...ds,
        backgroundColor: ds.backgroundColor,
        borderColor: ds.borderColor,
        borderWidth: ds.borderWidth
      }));
    }
  
    return chartData;
  };
  
  useEffect(() => {
    if (dataset1 && selectedRanges.length > 0 && datasetData) {
      if (selectedRanges[0] === "date") {
        if (!selectedRanges[1] || !selectedRanges[1][0] || !selectedRanges[1][1]) {
          setChartData(null);
          setSelectedChart(null);
          return;
        }
      }
      const data = generateChartData(dataset1, selectedRanges[0]);
      setChartData(data);
    }
  }, [dataset1, selectedRanges, datasetData]);
  

  const handleChartClick = (chartType) => {
    setSelectedChart(chartType);

    const configData = {
      subject: subject1,
      datatype: datatype1,
      dataset: dataset1,
      ranges: selectedRanges,
      selectedChart: chartType
    };
    localStorage.setItem('configFormData', JSON.stringify(configData));
  };

  const chartStyle = (chartType) => ({
    
    width: "30%",
    height: "250px",
    maxWidth: "500px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border:
      selectedChart === chartType
        ? "3px solid var(--button-color)"
        : "1px solid #ddd",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
  });

  const djvodfColors = [
    "#22A7F0",
    "#00BCD4",
    "#76D7C4",
    "#4CAF50",
    "#009688",
    "#4DB6AC",
    "#B2EBF2",
    "#80DEEA",
    "#64B5F6",
    "#4FC3F7",
    "#29B6F6",
    "#039BE5",
  ];

  const handleGenerate = () => {
    if (!selectedChart || !chartData) {
      Modal.error({
        title: 'Error',
        content: 'Please select a chart type and ensure data is loaded'
      });
      return;
    }

    const blockConfig = {
      subject: subject1,
      datatype: datatype1,
      dataset: dataset1,
      ranges: selectedRanges,
      selectedChart: selectedChart,
      chartData: chartData,
      chartOptions: chartOptions || defaultChartOptions
    };

    localStorage.setItem(`block-${blockId}`, JSON.stringify(blockConfig));
    navigate('/');
  };

  const handlePreview = () => {
    if (!selectedChart || !chartData) {
      Modal.error({
        title: 'Error',
        content: 'Please select a chart type and ensure data is loaded'
      });
      return;
    }

    const previewData = {
      subject: subject1,
      datatype: datatype1,
      dataset: dataset1,
      ranges: selectedRanges,
      selectedChart: selectedChart,
      chartData: chartData,
      chartOptions: chartOptions || defaultChartOptions
    };
    localStorage.setItem('previewData', JSON.stringify(previewData));
    
    navigate(`/preview?block=${blockId}`);
  };

  return (
    <Container isCollapsed={isCollapsed}>
     
      <ButtonWrapper>
        <StyledButton
          type={selectedButton === "default" ? "primary" : "default"}
          onClick={() => handleButtonClick("default")}
        >
          Default
        </StyledButton>
        <StyledButton
          type={selectedButton === "custom" ? "primary" : "default"}
          onClick={() => handleButtonClick("custom")}
        >
          Custom
        </StyledButton>
      </ButtonWrapper>

      {selectedButton === "custom" && (
        <WrapperDiv1>
           <Breadcrumb style={{ color: 'var(--text--color)' }}>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {selectedButton === "default" ? "Default" : "Custom"}
        </Breadcrumb.Item>
      </Breadcrumb>
          <Label>Custom Content</Label>
          <Label>
            Select Subject <Required>*</Required>
          </Label>
          <StyledSelect
            placeholder="Select Subject"
            onChange={handleSubjectChange1}
            value={subject1}
          >
            {Object.keys(subjectData).map((key) => (
              <Option key={key} value={key}>
                {
                  subjectData[key][Object.keys(subjectData[key])[0]][0]
                    .subject_label
                }
              </Option>
            ))}
          </StyledSelect>

          <Label>
            Select DataType <Required>*</Required>
          </Label>
          <StyledSelect
            placeholder="Select Datatype"
            onChange={handleDatatypeChange1}
            value={datatype1}
            disabled={!subject1}
          >
            {subject1 &&
              Object.keys(subjectData[subject1]).map((datatype) => (
                <Option key={datatype} value={datatype}>
                  {subjectData[subject1][datatype][0].datatype_label}
                </Option>
              ))}
          </StyledSelect>

          <Label>
            Select Dataset <Required>*</Required>
          </Label>
          <StyledSelect
            placeholder="Select Dataset"
            onChange={handleDatasetChange1}
            value={dataset1 ? dataset1.dataset : null}
            disabled={!datatype1}
          >
            {datatype1 &&
              subjectData[subject1][datatype1].map((d) => (
                <Option key={d.dataset} value={d.dataset}>
                  {d.dataset_label}
                </Option>
              ))}
          </StyledSelect>

          <Label>
            Select Range <Required>*</Required>
          </Label>
          <Radio.Group
            value={selectedRanges[0]}
            onChange={(e) => handleRangeChange(e.target.value)}
            disabled={!dataset1}
          >
            <Radio value="date">Date</Radio>
            <Radio value="week">Week</Radio>
            <Radio value="month">Month</Radio>
            <Radio value="year">Year</Radio>
          </Radio.Group>

          {isDateVisible && (
            <div style={{ marginTop: "16px" }}>
              <Label style={{ color: "var(--text-color)" }}>
                Select a date range<Required>*</Required>
              </Label>
              <div style={{ width: "100%", marginTop: "1px" }}>
                <RangePicker
                  value={selectedRanges[1]}
                  onChange={(dates) => {
                    setSelectedRanges(["date", dates]);
                    setSelectedChart(null);
                  }}
                  disabledDate={(current) =>
                    current && current > moment().endOf("day")
                  }
                  style={{ marginTop: "16px" }}
                />
              </div>
              {selectedRanges[0] === "date" && 
               (!selectedRanges[1] || !selectedRanges[1][0] || !selectedRanges[1][1]) && (
                <div style={{ 
                  color: "var(--Required-color)", 
                  fontSize: "12px",
                  marginTop: "4px" 
                }}>
                  Please select both start and end dates to view charts
                </div>
              )}
            </div>
          )}
         {chartData && dataset1 && datasetData?.dataByRange && (
          selectedRanges[0] !== "date" || (
            selectedRanges[1] && 
            selectedRanges[1][0] && 
            selectedRanges[1][1]
          )
        ) && (
          <>
           <Label>Select Presentation<Required>*</Required></Label>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "100%",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {subjectData[subject1]?.[datatype1]?.find(d => d.dataset === dataset1)?.widget.includes("bar chart") && chartData?.datasets && (
        <div
          style={chartStyle("bar chart")}
          onClick={() => handleChartClick("bar chart")}
        >
          <Bar 
            data={chartData} 
            options={{
              ...(chartOptions || defaultChartOptions),
              plugins: {
                ...(chartOptions?.plugins || defaultChartOptions.plugins),
                title: {
                  display: true,
                  text: subject1,
                  position: 'top',
                  align: 'start',
                  font: {
                    size: 14,
                    weight: 'bold'
                  },
                  padding: {
                    top: 5,
                    bottom: 5
                  }
                }
              }
            }} 
          />
        </div>
      )}

      {subjectData[subject1]?.[datatype1]?.find(d => d.dataset === dataset1)?.widget.includes("line chart") && chartData?.datasets && (
        <div
          style={chartStyle("line chart")}
          onClick={() => handleChartClick("line chart")}
        >
          <Line 
            data={chartData} 
            options={{
              ...(chartOptions || defaultChartOptions),
              plugins: {
                ...(chartOptions?.plugins || defaultChartOptions.plugins),
                title: {
                  display: true,
                  text: subject1,
                  position: 'top',
                  align: 'start',
                  font: {
                    size: 14,
                    weight: 'bold'
                  },
                  padding: {
                    top: 5,
                    bottom: 5
                  }
                }
              }
            }}
          />
        </div>
      )}

      {subjectData[subject1]?.[datatype1]?.find(d => d.dataset === dataset1)?.widget.includes("doughnut chart") && chartData?.datasets && (
        <div
          style={chartStyle("doughnut chart")}
          onClick={() => handleChartClick("doughnut chart")}
        >
          <Doughnut 
            data={chartData} 
            options={{
              ...(chartOptions || defaultChartOptions),
              plugins: {
                ...(chartOptions?.plugins || defaultChartOptions.plugins),
                title: {
                  display: true,
                  text: subject1,
                  position: 'top',
                  align: 'start',
                  font: {
                    size: 14,
                    weight: 'bold'
                  },
                  padding: {
                    top: 5,
                    bottom: 5
                  }
                }
              }
            }}
          />
        </div>
      )}
    </div>
  </>
)}
          <ButtonsContainer>
            <StyledButton
              onClick={handlePreview}
              style={{ width: "120px", marginRight: "10px" }}
              disabled={!selectedChart} 
            >
              Preview
            </StyledButton>
            <StyledButton 
              onClick={handleGenerate}
              style={{ width: "120px", marginLeft: "10px" }}
              disabled={!selectedChart || !chartData}
            >
              Generate
            </StyledButton>
          </ButtonsContainer>
        </WrapperDiv1>
      )}

      {selectedButton === "default" && (
        <WrapperDiv2>
           <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {selectedButton === "default" ? "Default" : "Custom"}
        </Breadcrumb.Item>
      </Breadcrumb>
          <Label>Default Content</Label>
          <Label>
            Select Subject <Required>*</Required>
          </Label>
          <StyledSelect
            placeholder="Select Subject"
            onChange={handleSubjectChange1}
            value={subject1}
          >
            {Object.keys(subjectData).map((key) => (
              <Option key={key} value={key}>
                {
                  subjectData[key][Object.keys(subjectData[key])[0]][0]
                    .subject_label
                }
              </Option>
            ))}
          </StyledSelect>

          <Label>
            Select DataType <Required>*</Required>
          </Label>
          <StyledSelect
            placeholder="Select Datatype"
            onChange={handleDatatypeChange1}
            value={datatype1}
            disabled={!subject1}
          >
            {subject1 &&
              Object.keys(subjectData[subject1]).map((datatype) => (
                <Option key={datatype} value={datatype}>
                  {subjectData[subject1][datatype][0].datatype_label}
                </Option>
              ))}
          </StyledSelect>

          <ButtonsContainer>
            <StyledButton style={{ width: "120px", marginRight: "10px" }}>
              Preview
            </StyledButton>
            <StyledButton style={{ width: "120px", marginLeft: "10px" }}>
              Generate
            </StyledButton>
          </ButtonsContainer>
        </WrapperDiv2>
      )}
    </Container>
  );
};

export default ConfigForm;

const Container = styled.div`
  padding: 20px;
  background-color: var(--content-bg-color);
  color: var(--text-color);
  transition: margin-left 0.3s ease;
  margin-left: ${(props) => (props.isCollapsed ? "60px" : "240px")};
`;

const WrapperDiv1 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: var(--background-color);
  padding: 25px;
  border-radius: 8px;
  box-shadow: var(--box-shadow);
  border: 1px solid var(--border-color);
  position: relative;
  margin-top: 20px;
  min-height: 1000px;
  height: 1000px;
  label {
    color: var(--text-color);
  }
`;

const WrapperDiv2 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: var(--background-color);
  padding: 25px;
  border-radius: 8px;
  box-shadow: var(--box-shadow);
  border: 1px solid var(--border-color);
  position: relative;
  margin-top: 20px;
  min-height: 1000px;
  height: 1000px;
  label {
    color: var(--text-color);
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 60px;
`;

const StyledButton = styled(Button)`
  background-color: var(--button-color) !important;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: auto;
`;

const StyledSelect = styled(Select)`
  .ant-select-selector {
    background-color: var(--field-color) !important;
    border: 0px solid var(--card-bg-color) !important;
    border-radius: 8px;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0px;
  }
  .ant-select-selection-placeholder {
    color: var(--text-color);
    opacity: 0.8;
    background-color: var(--field-color);
  }

  .ant-select-selection-item {
    color: var(--text-color);
    background-color: var(--field-color);
  }

  .ant-select-arrow {
    color: var(--text-color);
  }

  .ant-select-dropdown {
    background-color: var(--field-color) !important;
    border-radius: 8px;
  }

  .ant-select-item-option {
    color: var(--text-color);
  }

  .ant-select-item-option:hover {
    background-color: var(--button-color);
    color: white;
  }

  &:hover .ant-select-selector {
    border-color: var(--button-color);
  }

  &:focus .ant-select-selector {
    border-color: var(--button-color);
  }
`;

const Label = styled.label`
  margin-bottom: 0px;
`;

const Required = styled.span`
  color: var(--Required-color);
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ChartPreviewContainer = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: var(--card-bg-color);
  border-radius: 8px;
  margin: 20px 0;
  position: relative;

  & > div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  canvas {
    max-width: 100% !important;
    max-height: 100% !important;
  }
`;
