import React, { useState } from "react";
import { Select, Button, Radio } from "antd";
import styled from "styled-components";
import subjectData from '../subjectData.json';

const { Option } = Select;

const MainContent = ({ isCollapsed }) => {
  const [subject, setSubject] = useState(null);
  const [dataset, setDataset] = useState(null);
  const [datatype, setDatatype] = useState(null);
  const [selectedRanges, setSelectedRanges] = useState([]);
  const [selectedButton, setSelectedButton] = useState("default");

  const handleSubjectChange = (value) => {
    setSubject(value);
    setDataset(null);
  };

  const handleDatasetChange = (value) => {
    const selectedDataset = subjectData[subject].datasets.find(
      (d) => d.name === value
    );
    setDataset(selectedDataset);
  };

  const handleDatatypeChange = (value) => {
    setDatatype(value);
  };

  const handleRangeChange = (checkedValues) => {
    setSelectedRanges(checkedValues);
    console.log("Selected Ranges:", checkedValues);
  };

  const handleButtonClick = (buttonType) => {
    setSelectedButton(buttonType);
  };

  const handleGenerateClick = () => {
    console.log("Generate button clicked!");
    // Add logic for generating something here
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

      {/* WrapperDiv 1 */}
      {selectedButton === "custom" && (
        <WrapperDiv1>
          <Label>Custom Content</Label>
          <Label>
            Select Subject <Required>*</Required>
          </Label>
          <StyledSelect
            placeholder="Select Subject"
            onChange={handleSubjectChange}
            value={subject}
          >
            {Object.keys(subjectData).map((key) => (
              <Option key={key} value={key}>
                {subjectData[key].name}
              </Option>
            ))}
          </StyledSelect>

          <Label>
            Select DataType <Required>*</Required>
          </Label>
          <StyledSelect
            placeholder="Select DataType"
            onChange={handleDatatypeChange}
            value={datatype}
          >
            <Option value="type1">Type 1</Option>
            <Option value="type2">Type 2</Option>
          </StyledSelect>

          <Label>
            Select Dataset <Required>*</Required>
          </Label>
          <StyledSelect
            placeholder="Select Dataset"
            onChange={handleDatasetChange}
            value={dataset ? dataset.name : null}
          >
            {subject &&
              subjectData[subject].datasets.map((dataset, index) => (
                <Option key={index} value={dataset.name}>
                  {dataset.name}
                </Option>
              ))}
          </StyledSelect>

          <Label>
            Select Range <Required>*</Required>
          </Label>
          <Radio.Group
            value={selectedRanges[0]} 
            onChange={(e) => handleRangeChange([e.target.value])} 
          >
            <Radio value="date">Date</Radio>
            <Radio value="week">Week</Radio>
            <Radio value="month">Month</Radio>
            <Radio value="year">Year</Radio>
          </Radio.Group>

           {/* Chart */}

           
          <StyledButton style={{ width: '120px' , marginLeft: 'auto'}} >
            Generate
          </StyledButton>
        </WrapperDiv1>
      )}

      {/* WrapperDiv2 */}
      {selectedButton === "default" && (
        <WrapperDiv2>
          <Label>Default Content</Label>
          <Label>
            Select Subject <Required>*</Required>
          </Label>
          <StyledSelect
            placeholder="Select Subject"
            onChange={handleSubjectChange}
            value={subject}
          >
            {Object.keys(subjectData).map((key) => (
              <Option key={key} value={key}>
                {subjectData[key].name}
              </Option>
            ))}
          </StyledSelect>

          <Label>
            Select DataType <Required>*</Required>
          </Label>
          <StyledSelect
            placeholder="Select DataType"
            onChange={handleDatatypeChange}
            value={datatype}
          >
            <Option value="type1">Type 1</Option>
            <Option value="type2">Type 2</Option>
          </StyledSelect>


         {/* Chart */}


          <StyledButton style={{ width: '120px' , marginLeft: 'auto'}} >
            Generate
          </StyledButton>
        </WrapperDiv2>
      )}
    </Container>
  );
};

export default MainContent;

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
  min-height: 500px; 
  height: 500px; 

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
  min-height: 500px; 
  height: 500px; 

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
  padding: 6px 10px; /* Adjust the padding to make the button narrower */
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: auto; /* Ensure the width adjusts based on content */
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

