import React, { useState, useEffect } from "react";
import { Select, Button, Radio, DatePicker, Modal } from "antd";
import styled from "styled-components";
import moment from "moment";
import { Bar, Line, Pie } from "react-chartjs-2";
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

  const loadDatasetData = async (subject, datatype, dataset) => {
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
        title: "Are you sure you want to switch?",
        content: "The selected data will be lost.",
        onOk: () => {
          if (buttonType === "custom") {
            setSubject1(null);
            setDatatype1(null);
            setDataset1(null);
          } else {
            setSubject1(null);
            setDatatype1(null);
          }
          setSelectedButton(buttonType);
        },
      });
    } else {
      if (buttonType === "custom") {
        setSubject1(null);
        setDatatype1(null);
        setDataset1(null);
      } else {
        setSubject1(null);
        setDatatype1(null);
      }
      setSelectedButton(buttonType);
    }
  };

  const handleSubjectChange1 = (value) => {
    setSubject1(value);
    setDatatype1(null);
    setDataset1(null);
  };

  const handleDatatypeChange1 = (value) => {
    setDatatype1(value);
    setDataset1(null);
  };

  const handleDatasetChange1 = (value) => {
    const selectedDataset = subjectData[subject1]?.[datatype1]?.find(
      (d) => d.dataset === value
    );
    setDataset1(selectedDataset);

    if (selectedDataset) {
      loadDatasetData(subject1, datatype1, selectedDataset.dataset);
    }
  };

  const handleRangeChange = (value) => {
    setSelectedRanges([value]);
    setDateVisible(value === "date");
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: dataset1?.dataset || "",
      },
    },
  };

  const generateChartData = (dataset, range) => {
    const chartData = {
      labels: [],
      datasets: [
        {
          label: dataset.dataset,
          data: [],
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          borderColor: "rgba(53, 162, 235, 1)",
        },
      ],
    };
  
    if (!datasetData) return chartData;
  
    const data = datasetData.charts[0].data;
  
    if (range === "date" && selectedRanges[1]) {
      const selectedStartDate = selectedRanges[1][0]?.toDate();
      const selectedEndDate = selectedRanges[1][1]?.toDate();
  
      data[range].forEach((item) => {
        const date = moment(item.date, "D/M/YYYY");
        if (date.isBetween(selectedStartDate, selectedEndDate, null, "[]")) {
          chartData.labels.push(item.date);
          chartData.datasets[0].data.push(item.value);
        }
      });
    } else {
      data[range].forEach((item) => {
        chartData.labels.push(item[range]);
        chartData.datasets[0].data.push(item.value);
      });
    }
  
    return chartData;
  };
  
  useEffect(() => {
    setChartData(null);
    if (dataset1 && selectedRanges.length > 0 && datasetData) {
      const data = generateChartData(dataset1, selectedRanges[0]);
      setChartData(data);
    }
  }, [dataset1, selectedRanges, datasetData]);
  

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
          <Label>Custom Content</Label>
          <Label>Select Subject</Label>
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

          <Label>Select DataType</Label>
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

          <Label>Select Dataset</Label>
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

          <Label>Select Range</Label>
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
              <RangePicker
                value={selectedRanges[1]} 
                onChange={(dates) => setSelectedRanges(["date", dates])} 
                disabledDate={(current) =>
                  current && current > moment().endOf("day")
                }
                style={{ marginTop: "16px" }}
              />
            </div>
          )}

          {chartData && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {dataset1.widget.includes("bar chart") && (
                <div style={{ width: "30%", maxWidth: "800px" }}>
                  <h3>Bar Chart</h3>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              )}

              {dataset1.widget.includes("line chart") && (
                <div style={{ width: "30%", maxWidth: "800px" }}>
                  <h3>Line Chart</h3>
                  <Line data={chartData} options={chartOptions} />
                </div>
              )}

              {dataset1.widget.includes("pie chart") && (
                <div style={{ width: "30%", maxWidth: "800px" }}>
                  <h3>Pie Chart</h3>
                  <Pie
                    data={{
                      ...chartData,
                      datasets: [
                        {
                          ...chartData.datasets[0],
                          backgroundColor: [
                            "rgba(255, 99, 132, 0.5)",
                            "rgba(54, 162, 235, 0.5)",
                            "rgba(255, 206, 86, 0.5)",
                            "rgba(75, 192, 192, 0.5)",
                            "rgba(153, 102, 255, 0.5)",
                          ],
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                </div>
              )}

              {dataset1.widget.includes("gauge chart") && (
                <div style={{ width: "30%", maxWidth: "800px" }}>
                  <h3>Gauge Chart</h3>
                  
                </div>
              )}

              {dataset1.widget.includes("number") && (
                <div style={{ width: "30%", maxWidth: "800px" }}>
                  <h3>Number Display</h3>
                 
                </div>
              )}
            </div>
          )}

          <ButtonsContainer>
            <StyledButton style={{ width: "120px", marginRight: "10px" }}>
              Preview
            </StyledButton>
            <StyledButton style={{ width: "120px", marginLeft: "10px" }}>
              Generate
            </StyledButton>
          </ButtonsContainer>
        </WrapperDiv1>
      )}

      {selectedButton === "default" && (
        <WrapperDiv2>
          <Label>Default Content</Label>
          <Label>Select Subject</Label>
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

          <Label>Select DataType</Label>
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
  min-height: 900px;
  height: 900px;
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
  min-height: 900px;
  height: 900px;
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
