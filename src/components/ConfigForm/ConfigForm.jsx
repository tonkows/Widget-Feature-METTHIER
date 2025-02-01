import React, { useState, useEffect } from "react";
import { Select, Button, Radio, DatePicker, Modal, Breadcrumb } from "antd";
import { Link, useSearchParams, useNavigate, Prompt } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { BiCamera as CameraIcon, FiCamera ,BiCameraOff as CameraOffIcon } from "react-icons/bi";
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
import defaultBlockContents from '../defaultdata/block_default_content.json';
import defaultData from '../defaultdata/default_data.json';

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
  const [originalSubjectData,setOriginalSubjectData] = useState(null);
  const [defaultContent, setDefaultContent] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savedDefaultContent, setSavedDefaultContent] = useState(null);

  useEffect(() => {
    console.log("Set selected chart " + selectedChart);
  }, [selectedChart]);

  useEffect(() => {
    setOriginalSubjectData(subjectData);
    const loadInitialData = async () => {
      if (blockId) {
        const savedConfig = localStorage.getItem(`block-config-${blockId}`);
        if (savedConfig) {
          const config = JSON.parse(savedConfig);
          
          setSelectedButton(config.selectedButton || "default");
          
          if (config.selectedButton === "default") {
            if (config.subject) {
              try {
                const defaultConfig = defaultBlockContents[blockId];
                const updatedContent = {
                  ...defaultConfig,
                  subject: config.subject,
                  datatype: config.datatype
                };

                if (config.datatype) {
                  const response = await import(`../defaultdata/${config.subject}/${config.datatype}/${config.datatype}.json`);
                  const chartData = response.default;
                  updatedContent.charts = chartData.charts;
                  updatedContent.layout = chartData.layout;
                  updatedContent.type = chartData.type;
                }

                setDefaultContent(updatedContent);
              } catch (error) {
                console.error("Error loading default content:", error);
              }
            }
          } else {
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
    const loadInitialData = async () => {
      if (blockId) {
        const blockConfig = localStorage.getItem(`block-${blockId}`);
        if (blockConfig) {
          const config = JSON.parse(blockConfig)
          if (config.dataset) {
            const lastDefaultConfig = localStorage.getItem(`block-${blockId}-last-default`);
            if (lastDefaultConfig) {
              const lastDefault = JSON.parse(lastDefaultConfig);
              setDefaultContent(lastDefault);
              setSavedDefaultContent(lastDefault);
            } else {
              const defaultConfig = defaultBlockContents[blockId];
              setDefaultContent(defaultConfig);
              setSavedDefaultContent(defaultConfig);
            }
          } else {
            
            setDefaultContent(config);
            setSavedDefaultContent(config);
          }
        } else {
          const defaultConfig = defaultBlockContents[blockId];
          setDefaultContent(defaultConfig);
          setSavedDefaultContent(defaultConfig);
        }
      }
    };
    loadInitialData();
  }, [blockId]);

  useEffect(() => {
    if (selectedButton === "custom") {
      setHasUnsavedChanges(!!(subject1 || datatype1 || dataset1 || selectedRanges.length > 0 || chartData));
    } else {
      const originalConfig = defaultBlockContents[blockId];
      setHasUnsavedChanges(
        JSON.stringify(defaultContent) !== JSON.stringify(originalConfig)
      );
    }
  }, [subject1, datatype1, dataset1, selectedRanges, chartData, defaultContent, blockId, selectedButton]);

 

  useEffect(() => {
    const savedSubject = localStorage.getItem('selectedSubject');
    const savedDatatype = localStorage.getItem('selectedDatatype');
    if (savedSubject && savedDatatype) {
      setSubject1(savedSubject);
      setDatatype1(savedDatatype);
    }
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
            setSavedDefaultContent(defaultContent);
          } else {
            const lastDefaultConfig = localStorage.getItem(`block-${blockId}-last-default`);
            if (lastDefaultConfig) {
              const lastDefault = JSON.parse(lastDefaultConfig);
              setDefaultContent(lastDefault);
            }
            setDataset1(null);
            setSelectedRanges([]);
          }
          setSelectedButton(buttonType);
          
          localStorage.removeItem(`config-temp-${blockId}`);
        },
      });
    } else {
      clearWidget();
      setSelectedButton(buttonType);
      
      localStorage.removeItem(`config-temp-${blockId}`);
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

    if (selectedButton === "default") {
      const tempConfig = {
        selectedButton: "default",
        subject: value,
        datatype: null
      };
      localStorage.setItem(`config-temp-${blockId}`, JSON.stringify(tempConfig));
    }
  };

  const handleDatatypeChange1 = async (value) => {
    setDatatype1(value);
    setDataset1(null);
    setSelectedRanges([]);
    setChartData(null);
    setDatasetData(null);
    setSelectedChart(null);
    setIsPreviewVisible(false);

    if (selectedButton === "default") {
      const tempConfig = {
        selectedButton: "default",
        subject: subject1,
        datatype: value,
        chartData: null
      };

      try {
        const defaultData = defaultBlockContents[blockId];
        if (defaultData) {
          tempConfig.chartData = defaultData.charts[0].data;
        }
      } catch (error) {
        console.error("Error loading default chart data:", error);
      }

      localStorage.setItem(`config-temp-${blockId}`, JSON.stringify(tempConfig));
    }
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
  
    if (range === "date" && selectedRanges[1]) {
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


  const handlePreview = () => {
    if (!blockId) return;
  
    
    const currentConfig = {
      selectedButton,
      subject1,
      datatype1,
      dataset1,
      selectedRanges: selectedRanges[0] === 'date' ? 
        ['date', [
          selectedRanges[1][0].format('YYYY-MM-DD'),
          selectedRanges[1][1].format('YYYY-MM-DD')
        ]] : 
        selectedRanges,
      selectedChart,
      chartData,
      chartOptions
    };
    localStorage.setItem(`config-temp-${blockId}`, JSON.stringify(currentConfig));
  
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('preview-')) {
        localStorage.removeItem(key);
      }
    });
  
    let previewData;
    if (selectedButton === "custom") {
      if (!selectedChart || !chartData) {
        Modal.error({
          title: 'Error',
          content: 'Please select a chart type and ensure data is loaded'
        });
        return;
      }
      previewData = {
        type: "chart-with-description",
        selectedButton: "custom",
        chart: {
          type: selectedChart,
          title: subject1,
          subtitle: datatype1,
          data: chartData,
          options: chartOptions || defaultChartOptions
        },
        description: {
          title: "Custom Analysis",
          content: `Analysis of ${subject1} data for ${datatype1}`,
          highlights: [
            `Dataset: ${dataset1}`,
            `Type: ${selectedChart}`
          ]
        }
      };
    } else {
      const defaultConfigToSave = {
        selectedButton: "default",
        subject: defaultContent.subject,
        datatype: defaultContent.datatype,
        type: "multi-chart",
        layout: defaultContent.layout,
        charts: defaultContent.charts
      };
      
      localStorage.setItem(`block-config-${blockId}`, JSON.stringify(defaultConfigToSave));

      previewData = {
        type: "multi-chart",
        selectedButton: "default",
        subject: defaultContent.subject,
        datatype: defaultContent.datatype,
        layout: defaultContent.layout,
        charts: defaultContent.charts.map(chart => ({
          type: chart.type,
          title: chart.title,
          subtitle: chart.subtitle,
          data: chart.data,
          options: {
            ...chart.options,
            maintainAspectRatio: false,
            responsive: true
          }
        }))
      };
    }

    localStorage.setItem(`preview-${blockId}`, JSON.stringify(previewData));
    window.removeEventListener('beforeunload', () => {});
    navigate(`/preview?block=${blockId}`);
  };
  

  const handleGenerate = () => {
    if (selectedButton === "default") {
      localStorage.setItem(`block-${blockId}`, JSON.stringify(defaultContent));
      navigate('/');
    } else {
      if (!selectedChart || !chartData) {
        Modal.error({
          title: 'Error',
          content: 'Please select a chart type and ensure data is loaded'
        });
        return;
      }

      const customData = {
        subject: subject1,
        datatype: datatype1,
        dataset: dataset1,
        ranges: selectedRanges,
        selectedChart: selectedChart,
        chartData: chartData,
        chartOptions: chartOptions || defaultChartOptions,
        subject_label: subject1,
        dataset_label: dataset1,
        subtitle: datatype1
      };

      localStorage.setItem(`block-${blockId}`, JSON.stringify(customData));
      localStorage.setItem(`block-${blockId}-last-default`, JSON.stringify(defaultContent));

      Modal.success({
        title: 'Success',
        content: 'Chart has been generated successfully',
        onOk: () => {
          window.removeEventListener('beforeunload', () => {});
          navigate('/');
        }
      });
    }
  };

  const handleDefaultSubjectChange = async (value) => {
    try {
    
      const clearedContent = {
        subject: value,
        datatype: null,
        type: null,
        layout: null,
        charts: [],
        items: [],
        styles: {}
      };
      
      setDefaultContent(clearedContent);

     
      localStorage.removeItem(`block-${blockId}-last-default`);
      
     
      const config = {
        selectedButton: "default",
        subject: value,
        datatype: null
      };
      localStorage.setItem(`block-config-${blockId}`, JSON.stringify(config));

      
    } catch (error) {
      console.error("Error handling subject change:", error);
      Modal.error({
        title: 'Error',
        content: 'Failed to change subject'
      });
    }
  };

  const handleDefaultDatatypeChange = async (value) => {
    try {
      const response = await import(`../defaultdata/${defaultContent.subject}/${value}/${value}.json`);
      const defaultData = response.default;
      
      const updatedContent = {
        ...defaultContent,
        datatype: value,
        type: defaultData.type || "multi-chart",
        layout: defaultData.layout || "horizontal",
        charts: defaultData.charts || [],
        items: defaultData.items || [],
        styles: defaultData.styles || {},
      };
      
      setDefaultContent(updatedContent);

      const config = {
        selectedButton: "default",
        subject: defaultContent.subject,
        datatype: value,
        ...updatedContent
      };
      localStorage.setItem(`block-config-${blockId}`, JSON.stringify(config));

    } catch (error) {
      console.error("Error loading default chart data:", error);
      Modal.error({
        title: 'Error',
        content: `Failed to load chart data from path: ${defaultContent.subject}/${value}/${value}.json`
      });
    }
  };

  const handleLeavePage = (path) => {
    if (hasUnsavedChanges) {
      Modal.confirm({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes. Are you sure you want to leave?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => {
          setHasUnsavedChanges(false);
          navigate(path);
        }
      });
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    localStorage.setItem('previousPath', '/config-form');
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.removeEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const loadSavedConfig = async () => {
      const savedConfig = localStorage.getItem(`config-temp-${blockId}`);
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        
        setSelectedButton(config.selectedButton);
        setSubject1(config.subject1);
        setDatatype1(config.datatype1);
        setDataset1(config.dataset1);
        
     
        if (config.selectedRanges[0] === 'date' && config.selectedRanges[1]) {
          const dates = [
            moment(config.selectedRanges[1][0], 'YYYY-MM-DD'),
            moment(config.selectedRanges[1][1], 'YYYY-MM-DD')
          ];
          setSelectedRanges(['date', dates]);
        } else {
          setSelectedRanges(config.selectedRanges);
        }

        setSelectedChart(config.selectedChart);
        setChartData(config.chartData);
        setChartOptions(config.chartOptions);

     
        if (config.subject1 && config.datatype1 && config.dataset1) {
          try {
            const response = await import(`../data/${config.subject1}/${config.datatype1}/${config.dataset1}.json`);
            setDatasetData(response.default);
          } catch (error) {
            console.error("Error loading dataset:", error);
          }
        }

        localStorage.removeItem(`config-temp-${blockId}`);
      }
    };

    loadSavedConfig();
  }, [blockId]);

  const handleDateRangeChange = (dates) => {
    if (!dates) {
      setSelectedRanges(['date', null]);
      setChartData(null);
      return;
    }

   
    const formattedDates = [
      moment(dates[0]).format('YYYY-MM-DD'),
      moment(dates[1]).format('YYYY-MM-DD')
    ];
    
 
    setSelectedRanges(['date', dates]);


    const currentConfig = {
      selectedButton,
      subject1,
      datatype1,
      dataset1,
      selectedRanges: ['date', formattedDates],
      selectedChart,
      chartData,
      chartOptions
    };
    localStorage.setItem(`config-temp-${blockId}`, JSON.stringify(currentConfig));


    if (dataset1 && datasetData) {
      const newChartData = generateChartData(dataset1, 'date');
      setChartData(newChartData);
    }
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
           <Breadcrumb>
        <Breadcrumb.Item>
          <a onClick={(e) => {
            e.preventDefault();
            if (hasUnsavedChanges) {
              Modal.confirm({
                title: 'Unsaved Changes',
                content: 'You have unsaved changes. Are you sure you want to go back to home?',
                okText: 'Yes',
                cancelText: 'No',
                onOk: () => {
                  navigate('/');
                }
              });
            } else {
              navigate('/');
            }
          }}>
            Home
          </a>
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
                  onChange={handleDateRangeChange}
                  disabledDate={(current) =>
                    current && current > moment().endOf("day")
                  }
                  style={{ marginTop: "16px" }}
                  format="DD/MM/YYYY"
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
                  text: [
                    subjectData[subject1]?.[datatype1]?.[0]?.subject_label || subject1,
                    subjectData[subject1]?.[datatype1]?.find(d => d.dataset === dataset1)?.dataset_label || dataset1
                  ],
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
                  text: [
                    subjectData[subject1]?.[datatype1]?.[0]?.subject_label || subject1,
                    subjectData[subject1]?.[datatype1]?.find(d => d.dataset === dataset1)?.dataset_label || dataset1
                  ],
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
                  text: [
                    subjectData[subject1]?.[datatype1]?.[0]?.subject_label || subject1,
                    subjectData[subject1]?.[datatype1]?.find(d => d.dataset === dataset1)?.dataset_label || dataset1
                  ],
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
              onClick={() => {
                if (hasUnsavedChanges) {
                  handleGenerate();
                }
              }}
              style={{ width: "120px", marginLeft: "10px" }}
              disabled={!selectedChart || !chartData}
            >
              Generate
            </StyledButton>
          </ButtonsContainer>
        </WrapperDiv1>
      )}

{selectedButton === "default" && defaultContent && (
        <WrapperDiv2>
           <Breadcrumb>
           <Breadcrumb.Item>
          <a onClick={(e) => {
            e.preventDefault();
            if (selectedButton === "default") {
              Modal.confirm({
                title: 'Unsaved Changes',
                content: 'You have unsaved changes. Are you sure you want to go back to home?',
                okText: 'Yes',
                cancelText: 'No',
                onOk: () => {
                 
                  localStorage.removeItem(`block-${blockId}-last-default`);
                  setDefaultContent(savedDefaultContent);
                  navigate('/');
                }
              });
            } else {
              navigate('/');
            }
          }}>
            Home
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Default</Breadcrumb.Item>
      </Breadcrumb>
      
          <Label>Default Content</Label>
          <Label>
            Select Subject <Required>*</Required>
          </Label>
          
          <StyledSelect
            placeholder="Select Subject"
            value={defaultContent.subject}
            onChange={handleDefaultSubjectChange}
          >
            {Object.keys(defaultData).map(subject => (
              <Option key={subject} value={subject}>
                {subject.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Option>
            ))}
          </StyledSelect>
          <Label>
            Select DataType <Required>*</Required>
          </Label>
          <StyledSelect
            placeholder="Select Datatype"
            value={defaultContent.datatype}
            onChange={handleDefaultDatatypeChange}
            disabled={!defaultContent.subject}
          >
            {defaultContent.subject && 
              Object.keys(defaultData[defaultContent.subject] || {}).map(datatype => (
                <Option key={datatype} value={datatype}>
                  {datatype.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Option>
              ))}
          </StyledSelect>

          <div style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            {defaultContent.type === "combined-display" ? (
              <CombinedPreviewContainer>
                <InfoSection width={defaultContent.styles?.infoSectionWidth}>
                  <InfoDisplayContainer>
                    {defaultContent.items.map((item) => (
                      <InfoItem
                        key={item.id}
                        style={{
                          backgroundColor: item.style?.backgroundColor || 'var(--background-color)',
                          borderColor: item.style?.borderColor || 'var(--border-color)',
                          width: '100%'
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
                </InfoSection>

                <ChartSection width={defaultContent.styles?.chartSectionWidth}>
                  <ChartGrid layout={defaultContent.layout}>
                    {defaultContent.charts.map((chart, index) => {
                      const ChartComponent = {
                        'bar chart': Bar,
                        'line chart': Line,
                        'doughnut chart': Doughnut
                      }[chart.type];

                      if (!ChartComponent) return null;

                      return (
                        <ChartBox key={index} layout={defaultContent.layout}>
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
                                    font: { size: 11 }
                                  }
                                },
                                title: {
                                  display: true,
                                  text: [chart.title, chart.subtitle],
                                  font: { size: 12, weight: 'bold' },
                                  padding: { top: 10, bottom: 10 }
                                }
                              }
                            }}
                          />
                        </ChartBox>
                      );
                    })}
                  </ChartGrid>
                </ChartSection>
              </CombinedPreviewContainer>
            ) : defaultContent.type === "info-display" ? (
              <InfoDisplayPreview>
                <InfoDisplayContainer layout={defaultContent.layout}>
                  {defaultContent.items.map((item) => (
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
              </InfoDisplayPreview>
            ) : (
              <ChartPreviewContainer>
                <ChartGrid layout={defaultContent.layout}>
                  {defaultContent?.charts ? (
                    defaultContent.charts.map((chart, index) => {
                      const ChartComponent = {
                        'bar chart': Bar,
                        'line chart': Line,
                        'doughnut chart': Doughnut
                      }[chart.type];

                      if (!ChartComponent) return null;

                      return (
                        <ChartCard key={index}>
                          <div className="chart-header">
                            <div className="chart-title">{chart.title}</div>
                            <div className="chart-subtitle">{chart.subtitle}</div>
                          </div>
                          <div className="chart-content">
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
                                      font: { size: 11 }
                                    }
                                  }
                                }
                              }}
                            />
                          </div>
                        </ChartCard>
                      );
                    })
                  ) : null}
                </ChartGrid>
              </ChartPreviewContainer>
            )}
          </div>

          <ButtonsContainer>
            <StyledButton 
              onClick={handlePreview}
              style={{ width: "120px", marginRight: "10px" }}
              disabled={!defaultContent.subject || !defaultContent.datatype || !defaultContent.charts || defaultContent.charts.length === 0}
            >
              Preview
            </StyledButton>
            <StyledButton 
              onClick={() => {
                if (hasUnsavedChanges) {
                  handleGenerate();
                }
              }}
              style={{ width: "120px", marginLeft: "10px" }}
              disabled={!defaultContent.subject || !defaultContent.datatype || !defaultContent.charts || defaultContent.charts.length === 0}
            >
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
  width: 50%;
  height: 300px;
  border-radius: 8px;
  padding: 16px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ChartCard = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;

  .chart-header {
    margin-bottom: 8px;
    padding: 0 8px;

    .chart-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-color);
    }

    .chart-subtitle {
      font-size: 10px;
      color: var(--text-color);
      opacity: 0.8;
    }
  }

  .chart-content {
    flex: 1;
    min-height: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const ChartGrid = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: ${props => props.layout === 'vertical' ? 'column' : 'row'};
  gap: 12px;
  justify-content: center;
  align-items: center;
`;

const ChartBox = styled.div`
  width: ${props => props.layout === 'horizontal' ? '380px' : '760px'};
  height: ${props => props.layout === 'horizontal' ? '360px' : '170px'};
  background: var(--background-color);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  canvas {
    max-width: 100% !important;
    max-height: 100% !important;
  }
`;

const InfoDisplayPreview = styled.div`
  width: 100%;
  padding: 16px;
  background: var(--card-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InfoDisplayContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.layout === 'horizontal' ? 'row' : 'column'};
  gap: 12px;
  width: 100%;
  justify-content: ${props => props.layout === 'horizontal' ? 'space-between' : 'flex-start'};
  align-items: ${props => props.layout === 'horizontal' ? 'center' : 'stretch'};
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
  margin-right: 10px;
  color: ${props => props.status === 'active' ? 'var(--button-color)' : 'var(--text-color)'};
`;

const InfoContent = styled.div`
  text-align: left;
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

const CombinedPreviewContainer = styled.div`
  width: 50%;
  height: 300px;
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
